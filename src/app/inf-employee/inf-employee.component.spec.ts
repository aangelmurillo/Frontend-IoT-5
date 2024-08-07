import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfEmployeeComponent } from './inf-employee.component';

describe('InfEmployeeComponent', () => {
  let component: InfEmployeeComponent;
  let fixture: ComponentFixture<InfEmployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfEmployeeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
