import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminRepository } from 'src/admins/admins.repository';
import { SharedModule } from 'src/shared/shared.module';
import { TodosController } from './todos.controller';
import { TodoRepository } from './todos.repository';
import { TodosService } from './todos.service';
import { TodoFlowRepository } from 'src/todos-flow/todos-flow.repository';

@Module({
  imports: [
    SharedModule,
    TypeOrmModule.forFeature([AdminRepository]),
    TypeOrmModule.forFeature([TodoFlowRepository]),
    TypeOrmModule.forFeature([TodoRepository]),
  ],
  controllers: [TodosController],
  providers: [TodosService],
})
export class TodosModule {}
