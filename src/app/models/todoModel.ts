export interface TodoModelBase {
  title: string;
  deadline: string;
  isCompleted: boolean;
  category: {
    name: string;
    color: string;
  };
}

export interface TodoModel extends TodoModelBase {
  id: string;
}
