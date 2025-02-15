import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoSearchModalComponent } from './todo-search-modal.component';

describe('TodoSearchModalComponent', () => {
  let component: TodoSearchModalComponent;
  let fixture: ComponentFixture<TodoSearchModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoSearchModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TodoSearchModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
