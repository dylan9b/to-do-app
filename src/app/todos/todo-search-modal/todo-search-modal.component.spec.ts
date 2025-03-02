import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { TodoSearchModalComponent } from './todo-search-modal.component';
import { AppState } from '@state/app.state';
import { todosActions } from '@state/todo/todo-actions';
import { selectSearchTerm } from '@state/todo/todo-selectors';
import { CommonModule } from '@angular/common';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

describe('TodoSearchModalComponent', () => {
  let component: TodoSearchModalComponent;
  let fixture: ComponentFixture<TodoSearchModalComponent>;
  let store: MockStore<AppState>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<TodoSearchModalComponent>>;

  beforeEach(async () => {
    dialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [MatDialogModule, FormsModule, MatInputModule, CommonModule],
      providers: [
        provideNoopAnimations(),
        provideMockStore({
          selectors: [
            {
              selector: selectSearchTerm,
              value: 'test',
            },
          ],
        }),
        { provide: MatDialogRef, useValue: dialogRef },
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(TodoSearchModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch load action with search term on filterBySearchTerm', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    const inputElement: DebugElement = fixture.debugElement.query(
      By.css('input')
    );
    const event = { target: inputElement.nativeElement } as Event;
    inputElement.nativeElement.value = 'test search';

    component.filterBySearchTerm(event);

    expect(dispatchSpy).toHaveBeenCalledWith(
      todosActions.load({ request: { searchTerm: 'test search' } })
    );
    expect(dialogRef.close).toHaveBeenCalled();
  });

  it('should close the dialog on filterBySearchTerm', () => {
    const inputElement: DebugElement = fixture.debugElement.query(
      By.css('input')
    );
    const event = { target: inputElement.nativeElement } as Event;
    inputElement.nativeElement.value = 'test search';

    component.filterBySearchTerm(event);

    expect(dialogRef.close).toHaveBeenCalled();
  });
});
