import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CourseTrainersDetailsComponent } from './course-trainers-details.component';

describe('CourseTrainersDetailsComponent', () => {
  let component: CourseTrainersDetailsComponent;
  let fixture: ComponentFixture<CourseTrainersDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CourseTrainersDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseTrainersDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
