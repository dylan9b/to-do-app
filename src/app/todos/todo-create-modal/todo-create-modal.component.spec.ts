import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoCreateModalComponent } from './todo-create-modal.component';

describe('TodoCreateModalComponent', () => {
  let component: TodoCreateModalComponent;
  let fixture: ComponentFixture<TodoCreateModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoCreateModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TodoCreateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
