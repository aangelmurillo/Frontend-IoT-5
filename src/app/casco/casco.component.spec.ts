import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CascoComponent } from './casco.component';

describe('CascoComponent', () => {
  let component: CascoComponent;
  let fixture: ComponentFixture<CascoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CascoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CascoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
