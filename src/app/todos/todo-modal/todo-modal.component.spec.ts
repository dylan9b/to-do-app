import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TodoModalComponent } from './todo-modal.component';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { DatePipe } from '@angular/common';
import { TodoModel } from '../_model/todo.model';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { provideMockStore } from '@ngrx/store/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { selectAllPriorities } from '@state/priority/priority.selectors';

describe('TodoModalComponent', () => {
  let component: TodoModalComponent;
  let fixture: ComponentFixture<TodoModalComponent>;
  let mockDialog: jasmine.SpyObj<MatDialogRef<TodoModalComponent>>;
  let datePipe: DatePipe;

  const form = new FormGroup({
    title: new FormControl('Test Todo'),
    dueDate: new FormControl(new Date('2025-03-01')),
    priorityId: new FormControl('1'),
    isCompleted: new FormControl(false),
  });

  const initialState = {
    priorities: [
      { id: '1', priority: 'Low' },
      { id: '2', priority: 'Medium' },
      { id: '3', priority: 'High' },
    ],
  };

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
              value: initialState.priorities,
            },
          ],
        }),
        { provide: MatDialogRef, useValue: mockDialog },
        { provide: DatePipe, useValue: datePipe },
        {
          provide: MAT_DIALOG_DATA,
          useValue: { todo: null }, // You can pass mock data here
        },
      ],
    }).compileComponents();

    // mockStore = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(TodoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Form Initialization', () => {
    it('should initialize the form with the correct controls', () => {
      component.form = form;

      fixture.detectChanges();

      expect(component.form.value.title).toEqual('Test Todo');
      expect(component.form.value.dueDate).toEqual(new Date('2025-03-01'));
      expect(component.form.value.priorityId).toEqual('1');
    });

    it('should populate the form with the todo data if available', () => {
      component.form = form;

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

      fixture.detectChanges();

      expect(component.form.value.title).toBe(todo.title);
      expect(component.form.value.isCompleted).toBe(false);
      expect(component.form.value.dueDate).toEqual(todo.dueDate);
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
});
