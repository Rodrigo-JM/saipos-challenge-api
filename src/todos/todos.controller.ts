import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo-input.dto';
import { TodoDto } from './dto/get-todos-output.dto';
import { Todo } from './todos.entity';
import { TodosService } from './todos.service';
import { todoConstants } from 'src/shared/constants/todo-constants';
import { ChangeTodoStatusDto } from './dto/change-todo-status.dto';

@Controller('todos')
export class TodosController {
  constructor(private todosService: TodosService) {}

  @Get()
  async getTodos(): Promise<TodoDto[] | Error> {
    return await this.todosService.findAll();
  }

  @Post()
  async createTodo(@Body() params: CreateTodoDto): Promise<TodoDto | Error> {
    return await this.todosService.create(params);
  }

  @Put()
  async changeTodoStatus(
    @Body() params: ChangeTodoStatusDto,
  ): Promise<TodoDto | Error> {
    return await this.todosService.changeTodoStatus(params);
  }

  @Post('/fill-empty-tasks')
  async fillEmptyTasks(): Promise<any[] | Error> {
    return await this.todosService.fillEmptyTasks();
  }
}
