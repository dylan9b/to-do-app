import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { SocialAuthService } from '@abacritt/angularx-social-login';
import { Store } from '@ngrx/store';
import { AppState } from '@state/app.state';
import { LoginResponseModel } from '@auth/login/_model/login-response.model';
import { RegisterResponseModel } from '@auth/register/_model/register-response.model';
import { AuthRequestModel } from '@auth/_model/auth-request.model';
import { provideHttpClient } from '@angular/common/http';
import { SessionStorageEnum } from '@shared/sessionStorage.enum';
import { userActions } from '@state/user/user-actions';
import { environment } from '../environment/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let cookieService: jasmine.SpyObj<CookieService>;
  let router: jasmine.SpyObj<Router>;
  let socialAuthService: jasmine.SpyObj<SocialAuthService>;
  let store: jasmine.SpyObj<Store<AppState>>;

  beforeEach(() => {
    const cookieServiceSpy = jasmine.createSpyObj('CookieService', ['delete']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const socialAuthServiceSpy = jasmine.createSpyObj('SocialAuthService', [
      'signOut',
    ]);
    const storeSpy = jasmine.createSpyObj('Store', ['dispatch']);

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: CookieService, useValue: cookieServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: SocialAuthService, useValue: socialAuthServiceSpy },
        { provide: Store, useValue: storeSpy },
      ],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    cookieService = TestBed.inject(
      CookieService
    ) as jasmine.SpyObj<CookieService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    socialAuthService = TestBed.inject(
      SocialAuthService
    ) as jasmine.SpyObj<SocialAuthService>;
    store = TestBed.inject(Store) as jasmine.SpyObj<Store<AppState>>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login with Google', () => {
    const tokenId = 'test-token';
    const mockResponse: LoginResponseModel = {
      success: true,
      message: 'Login successful',
      data: {
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        expiryDate: new Date(),
      },
    };

    service.loginInWithGoogle$(tokenId).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}loginGoogle`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should login', () => {
    const request: AuthRequestModel = {
      email: 'test@example.com',
      password: 'password123',
    };
    const mockResponse: LoginResponseModel = {
      success: true,
      message: 'Login successful',
      data: {
        accessToken: 'mock-access',
        refreshToken: 'mock-refresh',
        expiryDate: new Date(),
      },
    };

    service.login$(request).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}login`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should register', () => {
    const request: AuthRequestModel = {
      email: 'newuser@example.com',
      password: 'newpassword123',
    };
    const mockResponse: RegisterResponseModel = {
      success: true,
      message: 'Registration successful',
    };

    service.register$(request).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}register`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should logout from Google', () => {
    socialAuthService.signOut.and.returnValue(Promise.resolve());

    service.logoutFromGoogle$().subscribe((response) => {
      expect(response).toBeTrue();
    });

    expect(socialAuthService.signOut).toHaveBeenCalled();
  });

  it('should log out and navigate to login', (done) => {
    router.navigate.and.returnValue(Promise.resolve(true));

    service.logOut();

    setTimeout(() => {
      expect(router.navigate).toHaveBeenCalledWith(['/auth', 'login']);
      expect(store.dispatch).toHaveBeenCalledWith(userActions.logout());
      expect(cookieService.delete).toHaveBeenCalledWith(
        SessionStorageEnum.GOOGLE_ACCESS_TOKEN
      );
      expect(cookieService.delete).toHaveBeenCalledWith(
        SessionStorageEnum.ACCESS_TOKEN
      );
      done();
    }, 0);
  });
});
