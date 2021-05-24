import { Body, Controller, Get, Post } from '@nestjs/common';
import { Todo } from './todos.entity';
import { TodosService } from './todos.service';

@Controller('todos')
export class TodosController {
  constructor(private todosService: TodosService) {}

  @Get()
  async getTodos(): Promise<TodoDto[]> {
    return await this.todosService.findAll();
  }

  //   @Post()
  //   async createTodo(@Body() params: CreateTodoDto): Promise<TodoDto> {
  //     return await this.todosService.create(params);
  //   }
}
