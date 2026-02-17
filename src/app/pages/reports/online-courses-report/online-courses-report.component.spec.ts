import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OnlineCoursesReportComponent } from './online-courses-report.component';

describe('OnlineCoursesReportComponent', () => {
  let component: OnlineCoursesReportComponent;
  let fixture: ComponentFixture<OnlineCoursesReportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OnlineCoursesReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnlineCoursesReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
