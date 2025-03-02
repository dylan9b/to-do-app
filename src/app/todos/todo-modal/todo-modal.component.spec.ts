import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TodoModalComponent } from './todo-modal.component';
import { Store } from '@ngrx/store';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { todosActions } from '../../state/todo/todo-actions';
import { AppState } from '../../state/app.state';
import { DatePipe } from '@angular/common';
import { TodoModel } from '../_model/todo.model';
import { CreateTodoRequestModel } from '../_model/request/create-todo-request.model';
import { UpdateTodoRequestModel } from '../_model/request/update-todo-request.model';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { selectAllPriorities } from '@state/priority/priority.selectors';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

describe('TodoModalComponent', () => {
  let component: TodoModalComponent;
  let fixture: ComponentFixture<TodoModalComponent>;
  let mockStore: MockStore<AppState>;
  let mockDialog: jasmine.SpyObj<MatDialogRef<TodoModalComponent>>;
  let datePipe: DatePipe;

  beforeEach(async () => {
    mockDialog = jasmine.createSpyObj('MatDialogRef', ['close']);
    datePipe = new DatePipe('en-US');

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, MatDialogModule, MatSlideToggleModule],
      providers: [
        provideNoopAnimations(),
        provideMomentDateAdapter(),
        provideMockStore({
          selectors: [
            {
              selector: selectAllPriorities,
              value: [
                { id: '1', priority: 'High' },
                {
                  id: '2',
                  priority: 'Medium',
                },
                { id: '3', priority: 'Low' },
              ],
            },
          ],
        }),
        { provide: Store, useValue: mockStore },
        { provide: MatDialogRef, useValue: mockDialog },
        { provide: DatePipe, useValue: datePipe },
        {
          provide: MAT_DIALOG_DATA,
          useValue: { todo: null }, // You can pass mock data here
        },
      ],
    }).compileComponents();

    mockStore = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(TodoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Form Initialization', () => {
    it('should initialize the form with the correct controls', () => {
      expect(component.form.contains('title')).toBeTrue();
      expect(component.form.contains('dueDate')).toBeTrue();
      expect(component.form.contains('priorityId')).toBeTrue();
    });

    it('should populate the form with the todo data if available', () => {
      const todo: TodoModel = {
        id: '1',
        title: 'Test Todo',
        dueDate: new Date('2025-03-01'),
        priorityId: '1',
        isCompleted: false,
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-01-01'),
        isPinned: false,
        order: 1,
        userId: 'user-1',
      };
      if (component.data) {
        component.data.todo = { ...component.data.todo, ...todo };
      }

      fixture.detectChanges();

      expect(component.form.value.title).toBe(todo.title);
      expect(component.form.value.dueDate).toBe(todo.dueDate);
      expect(component.form.value.priorityId).toBe(todo.priorityId);
    });
  });

  describe('onSubmit', () => {
    it('should call createTodo if there is no todo id', () => {
      spyOn(component, 'onSubmit');
      component.onSubmit();
      expect(component.onSubmit).toHaveBeenCalled();
    });

    it('should call updateTodo if there is a todo id', () => {
      const todo: TodoModel = {
        id: '1',
        title: 'Test Todo',
        dueDate: new Date('2025-03-01'),
        priorityId: '1',
        isCompleted: false,
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-01-01'),
        isPinned: false,
        order: 1,
        userId: 'user-1',
      };
      if (component.data) {
        component.data.todo = { ...component.data.todo, ...todo };
      }
      spyOn(component, 'onSubmit');
      component.onSubmit();
      expect(component.onSubmit).toHaveBeenCalled();
    });
  });

  describe('createTodo', () => {
    it('should dispatch the correct action to create a todo', () => {
      const createRequest: CreateTodoRequestModel = {
        dueDate: '2025-03-01',
        title: 'Test Todo',
        priorityId: '1',
      };

      component.form.setValue({
        title: 'Test Todo',
        dueDate: new Date('2025-03-01'),
        priorityId: 1,
      });

      component.onSubmit();

      expect(mockStore.dispatch).toHaveBeenCalledWith(
        todosActions.create({ request: createRequest })
      );
    });
  });

  describe('updateTodo', () => {
    it('should dispatch the correct action to update a todo', () => {
      const updateRequest: Partial<UpdateTodoRequestModel> = {
        id: '1',
        dueDate: '2025-03-01',
        title: 'Updated Todo',
        priorityId: '1',
        isCompleted: false,
      };

      component.form.setValue({
        id: 1,
        title: 'Updated Todo',
        dueDate: new Date('2025-03-01'),
        priorityId: 1,
        isCompleted: false,
      });

      component.onSubmit();

      expect(mockStore.dispatch).toHaveBeenCalledWith(
        todosActions.update({ request: updateRequest })
      );
    });
  });
});
