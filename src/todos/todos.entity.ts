import { Admin } from 'src/admins/admins.entity';
import { TodoFlow } from 'src/todos-flow/todos-flow.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  BaseEntity,
} from 'typeorm';

@Entity({ name: 'todos' })
export class Todo extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  email: string;

  @Column({ nullable: false })
  description: string;

  @Column({ default: 0 })
  status: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ManyToOne(() => Admin)
  admin: Admin;

  @OneToMany(() => TodoFlow, (todoFlow) => todoFlow.todo)
  statusHistory: TodoFlow[];
}
