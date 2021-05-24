import { Todo } from 'src/todos/todos.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  BaseEntity,
} from 'typeorm';

@Entity({ name: 'todo_flow' })
export class TodoFlow extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  status: number;

  @ManyToOne(() => Todo, (todo) => todo.statusHistory)
  todo: Todo;
}
