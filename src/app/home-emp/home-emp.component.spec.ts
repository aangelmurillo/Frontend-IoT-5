import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeEmpComponent } from './home-emp.component';

describe('HomeEmpComponent', () => {
  let component: HomeEmpComponent;
  let fixture: ComponentFixture<HomeEmpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeEmpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeEmpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
