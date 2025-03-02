import { TestBed } from '@angular/core/testing';
import { PriorityService } from './priority.service';
import { provideHttpClient } from '@angular/common/http';
import {
  provideHttpClientTesting,
  HttpTestingController,
} from '@angular/common/http/testing';
import { environment } from '../environment/environment';
import { PriorityModel } from '../state/priority/priority.model';

describe('PriorityService', () => {
  let service: PriorityService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(PriorityService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch priorities', () => {
    const mockPriorities: PriorityModel[] = [
      { id: '1', priority: 'High' },
      { id: '2', priority: 'Medium' },
      { id: '3', priority: 'Low' },
    ];

    service.priorities$().subscribe((priorities) => {
      expect(priorities.length).toBe(3);
      expect(priorities).toEqual(mockPriorities);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}priorities`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPriorities);
  });

  it('should handle error when fetching priorities', () => {
    const errorMessage = 'Failed to load priorities';

    service.priorities$().subscribe(
      () => fail('expected an error, not priorities'),
      (error) => expect(error).toBeTruthy()
    );

    const req = httpMock.expectOne(`${environment.apiUrl}priorities`);
    expect(req.request.method).toBe('GET');
    req.flush(errorMessage, { status: 500, statusText: 'Server Error' });
  });
});
