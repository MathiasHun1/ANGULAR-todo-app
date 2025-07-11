export interface TodoModelBase {
  title: string;
  deadline: string;
  isCompleted: boolean;
}

export interface TodoModel extends TodoModelBase {
  id: string;
}
