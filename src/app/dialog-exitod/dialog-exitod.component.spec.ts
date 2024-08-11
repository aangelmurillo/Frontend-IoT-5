import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogExitodComponent } from './dialog-exitod.component';

describe('DialogExitodComponent', () => {
  let component: DialogExitodComponent;
  let fixture: ComponentFixture<DialogExitodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogExitodComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogExitodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
