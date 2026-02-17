import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OfflinePaymentComponent } from './offline-payment.component';

describe('OfflinePaymentComponent', () => {
  let component: OfflinePaymentComponent;
  let fixture: ComponentFixture<OfflinePaymentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OfflinePaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfflinePaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
