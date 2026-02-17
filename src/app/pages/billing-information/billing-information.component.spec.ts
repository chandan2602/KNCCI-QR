import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BillingInformationComponent } from './billing-information.component';

describe('BillingInformationComponent', () => {
  let component: BillingInformationComponent;
  let fixture: ComponentFixture<BillingInformationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BillingInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillingInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
