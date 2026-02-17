import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CourseInformationReportComponent } from './course-information-report.component';

describe('CourseInformationReportComponent', () => {
  let component: CourseInformationReportComponent;
  let fixture: ComponentFixture<CourseInformationReportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CourseInformationReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseInformationReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
