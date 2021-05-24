import { Injectable } from '@nestjs/common';
import { AdminRepository } from 'src/admins/admins.repository';
import { TodoFlowRepository } from 'src/todos-flow/todos-flow.repository';
import { TodoRepository } from './todos.repository';

@Injectable()
export class TodosService {
  constructor(
    // private readonly adminRepository: AdminRepository,
    // private readonly todoFlowRepository: TodoFlowRepository,
    private readonly todoRepository: TodoRepository,
  ) {}

  async findAll(): Promise<TodoDto[]> {
    return this.todoRepository.find();
  }

  //   async create(params: CreateTodoDto): Promise<TodoDto> {
  //     const validEmail =
  //   }
}
