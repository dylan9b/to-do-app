import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TodoSortModalComponent } from './todo-sort-modal.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { AppState } from '@state/app.state';
import { TodoService } from '@services/todo.service';
import { provideMockStore } from '@ngrx/store/testing';
import { selectFilters } from '@state/todo/todo-selectors';
import { todosActions } from '@state/todo/todo-actions';
import { of } from 'rxjs';
import { TodoRequestModel } from '../_model/request/todo-request.model';
import { TodoModel } from '../_model/todo.model';
import { computed } from '@angular/core';

describe('TodoSortModalComponent', () => {
  let component: TodoSortModalComponent;
  let fixture: ComponentFixture<TodoSortModalComponent>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<TodoSortModalComponent>>;
  let mockStore: jasmine.SpyObj<Store<AppState>>;
  let mockTodoService: jasmine.SpyObj<TodoService>;
  let mockMatDialogData: { totalVisibleTodos: number };

  beforeEach(() => {
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
    mockStore = jasmine.createSpyObj('Store', ['selectSignal', 'dispatch']);
    mockStore.selectSignal.and.returnValue(computed(() => ({})));
    mockTodoService = jasmine.createSpyObj('TodoService', ['todos$']);
    mockMatDialogData = { totalVisibleTodos: 10 };

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: selectFilters,
              value: {
                request: null,
              },
            },
          ],
        }),
        { provide: MAT_DIALOG_DATA, useValue: mockMatDialogData },
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: Store, useValue: mockStore },
        { provide: TodoService, useValue: mockTodoService },
        FormBuilder,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TodoSortModalComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call loadItems$ and dispatch updateFilters on submit', () => {
    const mockResponse = {
      results: [{ id: 1, title: 'Test Todo' } as unknown as TodoModel],
      total: 1,
    };
    const mockRequest: Partial<TodoRequestModel> = {
      orderColumn: 'title',
      orderDirection: 'ASC',
      limit: mockMatDialogData.totalVisibleTodos,
    };

    mockTodoService.todos$.and.returnValue(of(mockResponse));

    component.form.setValue({ column: 'title', direction: 'ASC' });

    component.onSubmit();

    expect(mockTodoService.todos$).toHaveBeenCalledWith(mockRequest);
    expect(mockStore.dispatch).toHaveBeenCalledWith(
      todosActions.updateFilters({ request: mockRequest })
    );
    expect(mockDialogRef.close).toHaveBeenCalledWith(mockResponse);
  });

  it('should not dispatch updateFilters if the form is invalid', () => {
    component.form.setValue({ column: '', direction: '' });

    component.onSubmit();

    expect(mockStore.dispatch).not.toHaveBeenCalled();
    expect(mockDialogRef.close).not.toHaveBeenCalled();
  });
});
