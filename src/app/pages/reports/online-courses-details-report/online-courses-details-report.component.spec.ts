import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OnlineCoursesDetailsReportComponent } from './online-courses-details-report.component';

describe('OnlineCoursesDetailsReportComponent', () => {
  let component: OnlineCoursesDetailsReportComponent;
  let fixture: ComponentFixture<OnlineCoursesDetailsReportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OnlineCoursesDetailsReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnlineCoursesDetailsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
