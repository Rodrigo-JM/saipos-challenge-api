import { HttpException, Injectable } from '@nestjs/common';
import { AdminRepository } from 'src/admins/admins.repository';
import { todoConstants } from 'src/shared/constants/todo-constants';
import { CheckEmailService } from 'src/shared/services/check-email/check-email.service';
import { SuperheroesService } from 'src/shared/services/superheroes/superheroes.service';
import { TodoFlowRepository } from 'src/todos-flow/todos-flow.repository';
import { ChangeTodoStatusDto } from './dto/change-todo-status.dto';
import { CreateTodoDto } from './dto/create-todo-input.dto';
import { TodoDto } from './dto/get-todos-output.dto';
import { TodoRepository } from './todos.repository';

@Injectable()
export class TodosService {
  constructor(
    private readonly adminRepository: AdminRepository,
    private readonly todoFlowRepository: TodoFlowRepository,
    private readonly todoRepository: TodoRepository,
    private readonly checkEmailService: CheckEmailService,
    private readonly superheroesService: SuperheroesService,
  ) {}

  async findAll(): Promise<TodoDto[]> {
    return this.todoRepository.find();
  }

  async fillEmptyTasks() {
    try {
      const supeHr = await this.superheroesService.fetchSuperheroes();

      return Promise.all(
        supeHr.map(async ({ data }) => {
          const newTodoParams: CreateTodoDto = {
            description: data['full-name'] || data['name'] || 'Superhero',
            name: 'Eu',
            email: 'eu@me.com',
            defaultAdmin: true,
          };
          return await this.create(newTodoParams);
        }),
      );
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, 500);
    }
  }

  async changeTodoStatus(params: ChangeTodoStatusDto): Promise<TodoDto> {
    try {
      const todo = await this.todoRepository.findOne(params.todoId, {
        relations: ['admin', 'statusHistory'],
      });

      if (params.status === todoConstants.TODO_STATUS.COMPLETED) {
        todo.status = todoConstants.TODO_STATUS.COMPLETED;

        const newTodoFlow = this.todoFlowRepository.create({
          todo,
          status: todoConstants.TODO_STATUS.COMPLETED,
        });

        this.todoFlowRepository.save(newTodoFlow);
        todo.statusHistory = [...todo.statusHistory, newTodoFlow];

        return this.todoRepository.save(todo);
      }

      if (todo.admin.password !== params.password) {
        throw Error(todoConstants.ERROR_MESSAGES.INVALID_ADMIN_PASSWORD);
      }

      if (
        todo.statusHistory.filter(
          (flow) => flow.status === todoConstants.TODO_STATUS.PENDING,
        ).length > 1
      ) {
        throw Error(todoConstants.ERROR_MESSAGES.MAX_RETURNS);
      }

      todo.status = todoConstants.TODO_STATUS.PENDING;

      const newTodoFlow = this.todoFlowRepository.create({
        todo,
        status: todoConstants.TODO_STATUS.PENDING,
      });

      this.todoFlowRepository.save(newTodoFlow);
      todo.statusHistory = [...todo.statusHistory, newTodoFlow];

      return this.todoRepository.save(todo);
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, 500);
    }
  }

  async create(params: CreateTodoDto): Promise<TodoDto> {
    try {
      const validEmail = await this.checkEmailService.checkEmail(params.email);

      if (!validEmail.format_valid) {
        throw Error(
          `${todoConstants.ERROR_MESSAGES.INVALID_EMAIL_FORMAT}${
            validEmail.did_you_mean
              ? ' Você quis dizer: ' + validEmail.did_you_mean + '?'
              : ''
          }`,
        );
      }

      if (!validEmail.mx_found) {
        throw Error(
          `${todoConstants.ERROR_MESSAGES.EMAIL_ADDRESS_NOT_FOUND}${
            validEmail.did_you_mean
              ? ' Você quis dizer: ' + validEmail.did_you_mean + '?'
              : ''
          }`,
        );
      }

      if (params.defaultAdmin) {
        const findDefaultAdmin = await this.adminRepository.findOne({
          where: {
            default: true,
          },
        });

        if (!findDefaultAdmin) {
          throw Error(todoConstants.ERROR_MESSAGES.NO_DEFAULT_ADMIN_FOUND);
        }
        params.adminId = findDefaultAdmin.id;
      }

      const newTodo = this.todoRepository.create(params);

      newTodo.admin = await this.adminRepository.findOne({
        where: {
          id: params.adminId,
        },
      });

      return this.todoRepository.save(newTodo);
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, 500);
    }
  }
}
