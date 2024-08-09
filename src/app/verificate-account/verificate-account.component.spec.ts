import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerificateAccountComponent } from './verificate-account.component';

describe('VerificateAccountComponent', () => {
  let component: VerificateAccountComponent;
  let fixture: ComponentFixture<VerificateAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerificateAccountComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerificateAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
