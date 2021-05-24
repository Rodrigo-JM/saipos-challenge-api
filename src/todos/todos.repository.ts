import { EntityRepository, Repository } from 'typeorm';
import { CreateTodoDto } from './dto/create-todo-input.dto';
import { Todo } from './todos.entity';

@EntityRepository(Todo)
export class TodoRepository extends Repository<Todo> {}
