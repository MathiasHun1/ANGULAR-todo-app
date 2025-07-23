import { TestBed } from "@angular/core/testing";
import { TodoService } from "./todoService";
import { Apiservice } from "./apiService";
import { NotificationService } from "./notificationService";
import { of, throwError } from "rxjs";
import { TodoModel, TodoModelBase } from "../models/todoModel";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { provideHttpClient } from "@angular/common/http";

// Mock data
const mockTodos: TodoModel[] = [
  {
    id: "1",
    title: "Test 1",
    deadline: "2024-12-31",
    isCompleted: false,
    category: { name: "cat1", color: "#ff0000" },
  },
  {
    id: "2",
    title: "Test 2",
    deadline: "2024-12-31",
    isCompleted: true,
    category: { name: "cat2", color: "#00ff00" },
  },
];

describe("TodoService", () => {
  let service: TodoService; // service to test
  let apiServiceSpy: jasmine.SpyObj<Apiservice>; // mock service
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>; // mock service

  beforeEach(() => {
    apiServiceSpy = jasmine.createSpyObj("ApiService", ["getAllTodos", "addTodo"]);
    notificationServiceSpy = jasmine.createSpyObj("NotificationService", [
      "setSuccessMessage",
      "setWarningMessage",
    ]);

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        TodoService,
        { provide: Apiservice, useValue: apiServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy },
      ],
    });

    service = TestBed.inject(TodoService);
  });

  describe("getAllTodos", () => {
    it("service exist and initialized with empty array", () => {
      expect(service).toBeTruthy();
      expect(service.todos()).toEqual([]);
    });

    it("should fetch todos and update state", () => {
      apiServiceSpy.getAllTodos.and.returnValue(of(mockTodos));

      service.getAllTodos();

      expect(apiServiceSpy.getAllTodos).toHaveBeenCalled();
      expect(service.todos()).toEqual(mockTodos);
      expect(service.loading()).toBeFalse();
    });

    it("should catch errors and set error message", () => {
      apiServiceSpy.getAllTodos.and.returnValue(throwError(() => new Error()));

      service.getAllTodos();

      expect(apiServiceSpy.getAllTodos).toHaveBeenCalled(); // api have benn called
      expect(notificationServiceSpy.setWarningMessage).toHaveBeenCalled(); // notification service have been called
      expect(notificationServiceSpy.setWarningMessage).toHaveBeenCalledWith(
        "Hiba történt a feladatok betöltése során"
      ); // notif. service have been called with proper message
      expect(service.loading()).toBe(false);
    });
  });

  describe("addTodo", () => {
    const newTodoBase: TodoModelBase = {
      title: "test 3",
      deadline: "2026-01-01",
      isCompleted: false,
      category: {
        name: "Munka",
        color: "red",
      },
    };

    const newTodoWithId = { ...newTodoBase, id: "111" };

    beforeEach(() => {
      service.todos.set(mockTodos); //set initial state
    });

    it("should call the apiService", () => {
      apiServiceSpy.addTodo.and.returnValue(of({ ...newTodoBase, id: "111" }));
      service.addTodo(newTodoBase);

      expect(apiServiceSpy.addTodo).toHaveBeenCalled();
    });

    it("should update the state and set success message", () => {
      apiServiceSpy.addTodo.and.returnValue(of(newTodoWithId));

      service.addTodo(newTodoBase);
      const lastTodo: TodoModel = service.todos()[service.todos().length - 1];

      expect(service.todos().length).toBe(mockTodos.length + 1);
      expect(lastTodo).toEqual(newTodoWithId);
      expect(notificationServiceSpy.setSuccessMessage).toHaveBeenCalled();
    });

    it("should handle error and set error message", () => {
      apiServiceSpy.addTodo.and.returnValue(throwError(() => new Error()));

      service.addTodo(newTodoBase);

      expect(service.todos().length).toBe(mockTodos.length);
      expect(notificationServiceSpy.setWarningMessage).toHaveBeenCalled();
    });
  });
});
