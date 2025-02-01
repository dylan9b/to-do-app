import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-todos',
  imports: [FormsModule],
  templateUrl: './todos.component.html',
  styleUrl: './todos.component.scss',
  standalone: true,
})
export class TodosComponent {
  newTodo: string | undefined;
}
