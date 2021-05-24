class CreateTodoDto {
  name: string;
  email: string;
  description: string;
  defaultAdmin: boolean;
  adminId?: number;
}

export { CreateTodoDto };
