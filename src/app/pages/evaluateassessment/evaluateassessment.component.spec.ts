import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EvaluateassessmentComponent } from './evaluateassessment.component';

describe('EvaluateassessmentComponent', () => {
  let component: EvaluateassessmentComponent;
  let fixture: ComponentFixture<EvaluateassessmentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EvaluateassessmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluateassessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
