import { TestBed } from '@angular/core/testing';

import { AuthProtectedGuard } from './auth-protected.guard';

describe('AuthProtectedGuard', () => {
  let guard: AuthProtectedGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AuthProtectedGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
