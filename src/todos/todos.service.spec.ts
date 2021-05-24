import { TodosService } from './todos.service';
import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from 'src/shared/services/config.service';
import { HttpService } from '@nestjs/common';
import { SuperheroesService } from 'src/shared/services/superheroes/superheroes.service';
import { TodoFlowRepository } from 'src/todos-flow/todos-flow.repository';
import { Todo } from './todos.entity';
import { TodoRepository } from './todos.repository';
import { AdminRepository } from 'src/admins/admins.repository';

import { CheckEmailService } from 'src/shared/services/check-email/check-email.service';
import { Admin } from 'src/admins/admins.entity';
import { CreateTodoDto } from './dto/create-todo-input.dto';
import { todoConstants } from 'src/shared/constants/todo-constants';
import { TodoFlow } from 'src/todos-flow/todos-flow.entity';
describe('TodosService', () => {
  let todoService: TodosService;
  let todos: Todo[];
  let adminRepository: AdminRepository;
  let todoFlowRepository: TodoFlowRepository;
  let todoRepository: TodoRepository;
  let configService: ConfigService;
  let httpService: HttpService;
  let checkEmailService: CheckEmailService;
  let superheroesService: SuperheroesService;

  beforeEach(async () => {
    configService = new ConfigService();
    httpService = new HttpService();
    adminRepository = new AdminRepository();
    todoFlowRepository = new TodoFlowRepository();
    todoRepository = new TodoRepository();
    checkEmailService = new CheckEmailService(httpService, configService);
    superheroesService = new SuperheroesService(httpService, configService);

    todoService = new TodosService(
      adminRepository,
      todoFlowRepository,
      todoRepository,
      checkEmailService,
      superheroesService,
    );
  });

  it('should be defined', () => {
    expect(todoService).toBeDefined();
  });

  describe('findAll', () => {
    it('retorna lista de todos', async () => {
      const todo1 = new Todo();
      const todo2 = new Todo();

      todo1.id = 1;
      todo1.description = 'Todo1';
      todo1.email = 'rodrigo@gmail.com';
      todo1.name = 'rodrigo';

      todo2.id = 2;
      todo2.description = 'Todo2';
      todo2.email = 'rodrigo@gmail.com';
      todo2.name = 'rodrigo';
      todo2.status = 1;

      const todos = [todo1, todo2];

      jest
        .spyOn(todoRepository, 'find')
        .mockReturnValue(new Promise((r) => r(todos)));

      expect(await todoService.findAll()).toEqual(todos);
    });
  });

  describe('create', () => {
    it('cria e retorna nova todo', async () => {
      const todo1 = new Todo();
      const defaultAdminEnt = new Admin();

      const todoParams: CreateTodoDto = {
        description: `Todo1`,
        name: `rodrigo`,
        email: `rodrigo@gmail.com`,
        defaultAdmin: true,
      };

      todo1.id = 1;
      todo1.description = 'Todo1';
      todo1.email = 'rodrigo@gmail.com';
      todo1.name = 'rodrigo';

      defaultAdminEnt.id = 1;
      defaultAdminEnt.default = true;

      todo1.admin = defaultAdminEnt;

      jest.spyOn(todoRepository, 'create').mockReturnValue(todo1);
      jest
        .spyOn(todoRepository, 'save')
        .mockReturnValue(new Promise((r) => r(todo1)));

      jest
        .spyOn(adminRepository, 'findOne')
        .mockReturnValue(new Promise((r) => r(defaultAdminEnt)));

      expect(await todoService.create(todoParams)).toEqual(todo1);
    });

    it('falha com email errado', async () => {
      const todoParams: CreateTodoDto = {
        description: `Todo1`,
        name: `rodrigo`,
        email: `rodrigoggmail.com`,
        defaultAdmin: true,
      };
      await expect(todoService.create(todoParams)).rejects.toThrowError(
        todoConstants.ERROR_MESSAGES.INVALID_EMAIL_FORMAT,
      );
    });

    it('falha com email nao encontrado e faz sugestao', async () => {
      const todoParams: CreateTodoDto = {
        description: `Todo1`,
        name: `rodrigo`,
        email: `rodrigomallmann@gmaill.com`,
        defaultAdmin: true,
      };

      await expect(todoService.create(todoParams)).rejects.toThrowError(
        `${
          todoConstants.ERROR_MESSAGES.EMAIL_ADDRESS_NOT_FOUND
        }${' Você quis dizer: rodrigomallmann@gmail.com?'}`,
      );
    });

    it(`falha com admin default nao encontrado`, async () => {
      const todoParams: CreateTodoDto = {
        description: `Todo1`,
        name: `rodrigo`,
        email: `rodrigomallmann@gmail.com`,
        defaultAdmin: true,
      };

      jest
        .spyOn(adminRepository, 'findOne')
        .mockReturnValue(new Promise((r) => r(null)));

      await expect(todoService.create(todoParams)).rejects.toThrowError(
        todoConstants.ERROR_MESSAGES.NO_DEFAULT_ADMIN_FOUND,
      );
    });
  });

  describe(`changeTodoStatus`, async () => {
    let todo1: Todo;
    let admin: Admin;

    beforeEach(() => {
      todo1 = new Todo();
      admin = new Admin();

      todo1.id = 1;
      todo1.description = 'Todo1';
      todo1.email = 'rodrigo@gmail.com';
      todo1.name = 'rodrigo';
      admin.password = `TrabalheNaSaipos`;
      admin.default = true;
      todo1.admin = admin;
    });

    it(`Atualiza o status para concluido`, async () => {
      const updateParams = {
        status: 1,
        todoId: 1,
        password: `TrabalheNaSaipos`,
      };

      const todoFlow = new TodoFlow();

      jest
        .spyOn(todoRepository, 'findOne')
        .mockReturnValue(new Promise((r) => r(todo1)));

      todo1.status = 1;

      jest.spyOn(todoFlowRepository, 'create').mockReturnValue(todoFlow);

      todoFlow.status = 1;
      todoFlow.todo = todo1;

      todo1.statusHistory = [todoFlow];

      jest
        .spyOn(todoFlowRepository, 'save')
        .mockReturnValue(new Promise((r) => r(todoFlow)));

      jest
        .spyOn(todoRepository, 'save')
        .mockReturnValue(new Promise((r) => r(todo1)));

      expect(await todoService.changeTodoStatus(updateParams)).toEqual(todo1);
    });

    it(`Retorna o status para pendente`, async () => {
      const updateParams = {
        status: 0,
        todoId: 1,
        password: `TrabalheNaSaipos`,
      };

      const todoFlow1 = new TodoFlow();

      todo1.status = 1;
      todoFlow1.status = 1;
      todoFlow1.todo = todo1;

      todo1.statusHistory = [todoFlow1];

      jest
        .spyOn(todoRepository, 'findOne')
        .mockReturnValue(new Promise((r) => r(todo1)));

      const todoFlow2 = new TodoFlow();

      todoFlow2.status = 0;
      todoFlow2.todo = todo1;

      jest.spyOn(todoFlowRepository, 'create').mockReturnValue(todoFlow2);

      jest
        .spyOn(todoFlowRepository, 'save')
        .mockReturnValue(new Promise((r) => r(todoFlow2)));

      todo1.status = 0;

      jest
        .spyOn(todoRepository, 'save')
        .mockReturnValue(new Promise((r) => r(todo1)));

      expect(await todoService.changeTodoStatus(updateParams)).toEqual(todo1);
    });

    it(`Retorna erro de senha incorreta quando muda para pendente`, async () => {
      const updateParams = {
        status: 0,
        todoId: 1,
        password: `TrabalheNaSaippos`,
      };

      jest
        .spyOn(todoRepository, 'findOne')
        .mockReturnValue(new Promise((r) => r(todo1)));

      await expect(
        todoService.changeTodoStatus(updateParams),
      ).rejects.toThrowError(
        todoConstants.ERROR_MESSAGES.INVALID_ADMIN_PASSWORD,
      );
    });

    it(`Retorna erro quando tem dois retornos para pendente`, async () => {
      const updateParams = {
        status: 0,
        todoId: 1,
        password: `TrabalheNaSaipos`,
      };

      const todoFlow1 = new TodoFlow();

      todo1.status = 1;
      todoFlow1.status = 0;
      todoFlow1.todo = todo1;

      const todoFlow2 = new TodoFlow();

      todoFlow2.status = 0;
      todoFlow2.todo = todo1;

      todo1.statusHistory = [todoFlow1, todoFlow2];

      jest
        .spyOn(todoRepository, 'findOne')
        .mockReturnValue(new Promise((r) => r(todo1)));

      await expect(
        todoService.changeTodoStatus(updateParams),
      ).rejects.toThrowError(todoConstants.ERROR_MESSAGES.MAX_RETURNS);
    });
  });
});
