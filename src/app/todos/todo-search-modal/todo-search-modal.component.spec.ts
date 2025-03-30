import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { TodoSearchModalComponent } from './todo-search-modal.component';
import { TodoService } from '@services/todo.service';
import { Signal } from '@angular/core';
import { provideMockStore } from '@ngrx/store/testing';
import { selectFilters } from '@state/todo/todo-selectors';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

describe('TodoSearchModalComponent', () => {
  let component: TodoSearchModalComponent;
  let fixture: ComponentFixture<TodoSearchModalComponent>;
  let mockStore: jasmine.SpyObj<Store<unknown>>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<TodoSearchModalComponent>>;
  let mockTodoService: jasmine.SpyObj<TodoService>;

  beforeEach(async () => {
    mockStore = jasmine.createSpyObj('Store', ['selectSignal', 'dispatch']);
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
    mockTodoService = jasmine.createSpyObj('TodoService', ['todos$']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      providers: [
        FormBuilder,
        provideNoopAnimations(),
        provideMockStore({
          selectors: [
            {
              selector: selectFilters,
              value: {},
            },
          ],
        }),
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: TodoService, useValue: mockTodoService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TodoSearchModalComponent);
    component = fixture.componentInstance;

    mockStore.selectSignal.and.returnValue({
      searchTerm: 'test',
    } as unknown as Signal<unknown>);
    mockTodoService.todos$.and.returnValue(of({ results: [], total: 0 }));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call loadItems$ and dispatch updateFilters on valid form submission', () => {
    component.form.setValue({ searchTerm: 'new search' });

    component.onSubmit();

    expect(mockTodoService.todos$).toHaveBeenCalledWith({
      searchTerm: 'new search',
    });

    expect(mockDialogRef.close).toHaveBeenCalledWith([]);
  });

  it('should close the dialog with results on successful submission', () => {
    const mockResults = [
      {
        id: '1',
        title: 'Test Todo',
        isCompleted: false,
        isPinned: false,
        order: 0,
        dueDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        priorityId: '',
        userId: '',
      },
    ];
    mockTodoService.todos$.and.returnValue(
      of({ results: mockResults, total: 1 })
    );
    component.form.setValue({ searchTerm: 'test' });

    component.onSubmit();

    expect(mockDialogRef.close).toHaveBeenCalledWith(mockResults);
  });
});
