import { TestBed } from '@angular/core/testing';

import { AutheticateService } from './autheticate.service';

describe('AutheticateService', () => {
  let service: AutheticateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AutheticateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
