import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DetailedAssessmentComponent } from './detailed-assessment.component';

describe('DetailedAssessmentComponent', () => {
  let component: DetailedAssessmentComponent;
  let fixture: ComponentFixture<DetailedAssessmentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailedAssessmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailedAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
