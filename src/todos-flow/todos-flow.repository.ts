import { EntityRepository, Repository } from 'typeorm';
import { TodoFlow } from './todos-flow.entity';
@EntityRepository(TodoFlow)
export class TodoFlowRepository extends Repository<TodoFlow> {}
