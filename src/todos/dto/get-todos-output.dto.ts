class GetTodosOutputDto {
  todos: TodoDto[];
}

class TodoDto {
  name: string;
  status: number;
  email: string;
  description: string;
  createdAt: Date;
}
