import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HolidayNotificationComponent } from './holiday-notification.component';

describe('HolidayNotificationComponent', () => {
  let component: HolidayNotificationComponent;
  let fixture: ComponentFixture<HolidayNotificationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HolidayNotificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HolidayNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
