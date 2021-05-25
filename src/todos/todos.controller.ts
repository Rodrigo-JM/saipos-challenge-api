import {
  Body,
  Controller,
  Get,
  HttpException,
  Post,
  Put,
} from '@nestjs/common';
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
    try {
      return await this.todosService.findAll();
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }

  @Post()
  async createTodo(@Body() params: CreateTodoDto): Promise<TodoDto | Error> {
    try {
      return await this.todosService.create(params);
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }

  @Put()
  async changeTodoStatus(
    @Body() params: ChangeTodoStatusDto,
  ): Promise<TodoDto | Error> {
    try {
      return await this.todosService.changeTodoStatus(params);
    } catch (error) {
      console.log(error.message);
      throw new HttpException(error.message, 500);
    }
  }

  @Post('/fill-empty-tasks')
  async fillEmptyTasks(): Promise<any[] | Error> {
    try {
      return await this.todosService.fillEmptyTasks();
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }
}
