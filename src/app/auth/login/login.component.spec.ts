import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '@services/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { GoogleLoginProvider } from '@abacritt/angularx-social-login';
import { provideRouter, RouterLink } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { LoginResponseModel } from './_model/login-response.model';
import { SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import { environment } from '../../environment/environment';
import { provideMockStore } from '@ngrx/store/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { routes } from '../../app.routes';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let cookieServiceSpy: jasmine.SpyObj<CookieService>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', [
      'login$',
      'loginInWithGoogle$',
    ]);
    cookieServiceSpy = jasmine.createSpyObj('CookieService', ['set', 'delete']);

    await TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, RouterLink],
      providers: [
        {
          provide: 'SocialAuthServiceConfig',
          useValue: {
            autoLogin: false,
            providers: [
              {
                id: GoogleLoginProvider.PROVIDER_ID,
                provider: new GoogleLoginProvider(environment.clientId, {
                  oneTapEnabled: false,
                  scopes: ['https://www.googleapis.com/auth/calendar'],
                }),
              },
            ],
            onError: (error) => {
              console.error('GOOGLE ERROR ***', error);
            },
          } as SocialAuthServiceConfig,
        },
        provideMockStore(),
        provideRouter(routes),
        { provide: AuthService, useValue: authServiceSpy },
        { provide: CookieService, useValue: cookieServiceSpy },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form on creation', () => {
    expect(component.form).toBeDefined();
    expect(component.form.controls['email']).toBeDefined();
    expect(component.form.controls['password']).toBeDefined();
    expect(component.form.controls['rememberMe']).toBeDefined();
  });

  it('should call onSubmit and login when form is valid', () => {
    const mockResponse: LoginResponseModel = {
      data: {
        accessToken: 'mockToken',
        expiryDate: new Date(),
        refreshToken: '',
      },
      success: true,
      message: 'Successfully logged in',
    };
    authServiceSpy.login$.and.returnValue(of(mockResponse));
    component.form.setValue({
      email: 'test@example.com',
      password: 'password123',
      rememberMe: true,
    });

    component.onSubmit();

    expect(authServiceSpy.login$).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
    expect(cookieServiceSpy.set).toHaveBeenCalled();
  });

  it('should not call login when form is invalid', () => {
    component.form.setValue({
      email: '',
      password: '',
      rememberMe: false,
    });

    component.onSubmit();

    expect(authServiceSpy.login$).not.toHaveBeenCalled();
  });

  it('should clear all tokens when clearAllTokens is called', () => {
    spyOn(sessionStorage, 'removeItem');
    component.clearAllTokens();

    expect(cookieServiceSpy.delete).toHaveBeenCalledWith(
      component['_tokenKey']
    );

    expect(sessionStorage.removeItem).toHaveBeenCalled();
  });
});
