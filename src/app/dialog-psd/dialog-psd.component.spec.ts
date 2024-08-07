import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogPsdComponent } from './dialog-psd.component';

describe('DialogPsdComponent', () => {
  let component: DialogPsdComponent;
  let fixture: ComponentFixture<DialogPsdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogPsdComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogPsdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
