import { TestBed } from '@angular/core/testing';

import { EmpleadoGuardGuard } from './empleado-guard.guard';

describe('EmpleadoGuardGuard', () => {
  let guard: EmpleadoGuardGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(EmpleadoGuardGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
