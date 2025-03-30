import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { provideRouter, RouterLink, RouterModule } from '@angular/router';
import { of } from 'rxjs';
import { AuthService } from '@services/auth.service';
import { RegisterComponent } from './register.component';
import { AuthRequestModel } from '../_model/auth-request.model';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { routes } from '../../app.routes';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['register$']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterModule, RouterLink],
      providers: [
        provideRouter(routes),
        { provide: AuthService, useValue: authServiceSpy },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    component.form.patchValue({
      email: 'test@test.com',
      password: '12345678',
      reTypePassword: '12345678',
    });
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with default values', () => {
    expect(component.form.value).toEqual({
      email: 'test@test.com',
      password: '12345678',
      reTypePassword: '12345678',
    });
  });

  it('should validate password match', () => {
    component.form.controls['password']?.setValue('password123');
    component.form.controls['reTypePassword']?.setValue('password1234');
    expect(component.form.valid).toBeFalse();
  });

  it('should call AuthService register$ on valid form submission', () => {
    component.form.controls['email']?.setValue('test@example.com');
    component.form.controls['password']?.setValue('password123');
    component.form.controls['reTypePassword']?.setValue('password123');

    const authRequest: AuthRequestModel = {
      email: component.form.controls['email']?.value,
      password: component.form.controls['password']?.value,
    };

    authService.register$.and.returnValue(
      of({ success: true, message: 'Registration successful' })
    );

    component.onSubmit();

    expect(authService.register$).toHaveBeenCalledWith(authRequest);
  });

  it('should not call AuthService register$ on invalid form submission', () => {
    component.form.controls['email']?.setValue('');
    component.form.controls['password']?.setValue('');
    component.form.controls['reTypePassword']?.setValue('');

    component.onSubmit();

    expect(authService.register$).not.toHaveBeenCalled();
  });
});
