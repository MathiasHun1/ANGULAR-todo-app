import {
  Component,
  inject,
  Signal,
  signal,
  input,
  output,
  computed,
  OnInit,
  WritableSignal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TodoService } from '../../services/todoService';
import { TodoModel } from '../../models/todoModel';
import { Form } from '../form/form';
import { FiltersService } from '../../services/filtersService';
import { sortTodosBydate } from '../../shared/utilities';

@Component({
  selector: 'app-todos-section',
  templateUrl: './todoSection.html',
  styleUrl: './todoSection.scss',
  imports: [FormsModule, Form, CommonModule],
})
export class TodoSection implements OnInit {
  // --- DEPENDENCIES --- //

  private todoService = inject(TodoService);
  private filtersService = inject(FiltersService);

  // --- INPUTS --- //

  todoFormOpen = input<boolean>(false);
  itemFormOpen = input<string>('');

  // --- OUTPUTS --- //

  requestOpenTodoForm = output();
  requestCloseTodoForm = output();
  requestOpenItemForm = output<string>();
  requestCloseItemForm = output();

  // --- SIGNALS --- //
  dataLoading = this.todoService.loading;
  fetchedTodos: WritableSignal<TodoModel[] | undefined> =
    this.todoService.todos;

  editedTodo = signal<TodoModel | null>(null);
  newTitle = signal<string>('');
  renderedTodos: Signal<TodoModel[] | undefined> = computed(() => {
    const todos = this.fetchedTodos();
    if (!todos) {
      return;
    }

    const filter = this.filtersService.getActiveDefaultFilter();
    const categoryFilter = this.filtersService.getActivecategoryName();

    let filterdByDefaultTodos: TodoModel[];

    switch (filter) {
      case 'Mind':
        filterdByDefaultTodos = todos;
        break;
      case 'Befejezett':
        filterdByDefaultTodos = todos.filter((f) => f.isCompleted);
        break;
      case 'Függőben':
        filterdByDefaultTodos = todos.filter((f) => !f.isCompleted);
        break;
      default:
        filterdByDefaultTodos = todos;
        break;
    }

    if (categoryFilter === 'Mind') {
      return sortTodosBydate(filterdByDefaultTodos);
    }

    return sortTodosBydate(
      filterdByDefaultTodos.filter((t) => t.category.name === categoryFilter)
    );
  });

  ngOnInit(): void {
    this.todoService.getAllTodos();
  } // get all todos on first page load

  // --- PUBLIC METHODS --- //

  deleteItem(id: string): void {
    this.todoService.deleteTodo(id);
  }

  toggleCompletion(id: string) {
    const todo = this.fetchedTodos()?.find((t) => t.id === id);

    if (todo) {
      todo.isCompleted = !todo.isCompleted;
      this.todoService.updateTodo(todo);
    }
  }

  openEditState(todo: TodoModel) {
    this.editedTodo.set(todo);
    console.log(`passed id: "${this.itemFormOpen()}"`);
    console.log(`in component id: "${this.editedTodo()?.id}"`);
  }

  updateTodo() {
    const editedTodo = this.editedTodo();

    if (editedTodo) {
      this.todoService.updateTodo(editedTodo);
    }
    this.editedTodo.set(null);
    this.requestCloseItemForm.emit();
  }

  editTitle(event: Event) {
    const target = event.target as HTMLInputElement;
    const editedTodo = this.editedTodo();
    if (editedTodo) {
      this.editedTodo.set({ ...editedTodo, title: target.value });
    }
  }

  editDeadline(event: Event) {
    const target = event.target as HTMLInputElement;
    const editedTodo = this.editedTodo();
    const newDeadline = target.value;

    if (editedTodo) {
      this.editedTodo.set({ ...editedTodo, deadline: newDeadline });
    }
  }
}
