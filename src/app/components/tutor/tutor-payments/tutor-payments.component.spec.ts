import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TutorPaymentsComponent } from './tutor-payments.component';

describe('TutorPaymentsComponent', () => {
  let component: TutorPaymentsComponent;
  let fixture: ComponentFixture<TutorPaymentsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TutorPaymentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutorPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
