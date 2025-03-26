import {
  Component,
  inject,
  ChangeDetectionStrategy,
  DestroyRef,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { CreateTodoRequestModel } from '../_model/request/create-todo-request.model';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { TodoModel } from '../_model/todo.model';
import { UpdateTodoRequestModel } from '../_model/request/update-todo-request.model';
import { TodoModalFormControl } from './_model/todo-modal-form-control.model';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { UpdateTodoResponseModel } from '../_model/response/update-todo-response.model';
import { Observable } from 'rxjs';
import { TodoService } from '@services/todo.service';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { CreateTodoResponseModel } from '../_model/response/create-todo-response.model';
import { PriorityService } from '@services/priority.service';

@Component({
  selector: 'app-todo-create-modal',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatDatepickerModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSlideToggleModule,
  ],
  providers: [DatePipe],
  templateUrl: './todo-modal.component.html',
  styleUrl: './todo-modal.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoModalComponent {
  private readonly _formBuilder = inject(FormBuilder);
  private readonly _datePipe = inject(DatePipe);
  private readonly _dialog = inject(MatDialog);
  private readonly _todoService = inject(TodoService);
  private readonly _proritiesService = inject(PriorityService);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _dialogRef = inject(MatDialogRef<TodoModalComponent>);

  readonly prioritiesSignal = toSignal(this._proritiesService.priorities$());

  readonly data?: { todo?: TodoModel | null } = inject(MAT_DIALOG_DATA);

  form!: FormGroup;

  constructor() {
    this.form = this.populateFormControl();
  }

  private populateFormControl(): FormGroup {
    const form = new TodoModalFormControl();

    if (this.data?.todo?.id) {
      form.dueDate.setValue(this.data?.todo?.dueDate);
      form.id.setValue(this.data?.todo?.id);
      form.priorityId.setValue(this.data?.todo?.priorityId);
      form.title.setValue(this.data?.todo?.title);
      form.isCompleted.setValue(this.data?.todo?.isCompleted);
    }

    return this._formBuilder.group(form);
  }

  onSubmit(): void {
    if (this.data?.todo?.id) {
      this.updateTodo();
    } else {
      this.createTodo();
    }

    this._dialog.closeAll();
  }

  private createTodo(): void {
    const { dueDate, title, priorityId } = this.form.value;
    const date = this._datePipe.transform(dueDate, 'YYYY-MM-dd') as string;

    const request: CreateTodoRequestModel = {
      dueDate: date,
      title,
      priorityId,
    };

    if (this.form.valid) {
      this.createTodo$(request)
        .pipe(takeUntilDestroyed(this._destroyRef))
        .subscribe((response) => {
          this._dialogRef.close(response?.todo);
        });
    }
  }

  private updateTodo(): void {
    const { id, isCompleted, dueDate, title, priorityId } = this.form.value;
    const date = this._datePipe.transform(dueDate, 'YYYY-MM-dd') as string;

    const request: Partial<UpdateTodoRequestModel> = {
      id,
      isCompleted,
      dueDate: date,
      title,
      priorityId,
    };

    if (this.form.valid) {
      this.updateTodo$(request)
        .pipe(takeUntilDestroyed(this._destroyRef))
        .subscribe((response) => {
          this._dialogRef.close(response?.todo);
        });
    }
  }

  private updateTodo$(
    request: Partial<UpdateTodoRequestModel>
  ): Observable<UpdateTodoResponseModel> {
    return this._todoService
      .updateTodo$(request)
      .pipe(takeUntilDestroyed(this._destroyRef));
  }

  private createTodo$(
    request: CreateTodoRequestModel
  ): Observable<CreateTodoResponseModel> {
    return this._todoService
      .createTodo$(request)
      .pipe(takeUntilDestroyed(this._destroyRef));
  }
}
