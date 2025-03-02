import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { AuthService } from '@services/auth.service';
import { RegisterComponent } from './register.component';
import { AuthRequestModel } from '../_model/auth-request.model';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['register$']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    component.form.patchValue({
      email: 'test@test.com',
      password: '12345678',
      reTypePassword: '12345678',
    });
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
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

  it('should navigate to login on successful registration', () => {
    component.form.controls['email']?.setValue('test@example.com');
    component.form.controls['password']?.setValue('12345678');
    component.form.controls['reTypePassword']?.setValue('12345678');

    authService.register$.and.returnValue(
      of({ success: true, message: 'Registration successful' })
    );

    component.onSubmit();

    expect(router.navigate).toHaveBeenCalledWith(['/auth', 'login']);
  });

  it('should not call AuthService register$ on invalid form submission', () => {
    component.form.controls['email']?.setValue('');
    component.form.controls['password']?.setValue('');
    component.form.controls['reTypePassword']?.setValue('');

    component.onSubmit();

    expect(authService.register$).not.toHaveBeenCalled();
  });
});
