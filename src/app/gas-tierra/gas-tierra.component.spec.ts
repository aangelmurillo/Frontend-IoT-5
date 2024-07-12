import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GasTierraComponent } from './gas-tierra.component';

describe('GasTierraComponent', () => {
  let component: GasTierraComponent;
  let fixture: ComponentFixture<GasTierraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GasTierraComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GasTierraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
