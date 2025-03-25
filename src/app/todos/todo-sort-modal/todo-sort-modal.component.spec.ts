import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoSortModalComponent } from './todo-sort-modal.component';

describe('TodoSortModalComponent', () => {
  let component: TodoSortModalComponent;
  let fixture: ComponentFixture<TodoSortModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoSortModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TodoSortModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
