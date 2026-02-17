import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AttendanceDetailsReportComponent } from './attendance-details-report.component';

describe('AttendanceDetailsReportComponent', () => {
  let component: AttendanceDetailsReportComponent;
  let fixture: ComponentFixture<AttendanceDetailsReportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AttendanceDetailsReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttendanceDetailsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
