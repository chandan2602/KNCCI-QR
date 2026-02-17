import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AssessmentQuestionnaireComponent } from './assessment-questionnaire.component';

describe('AssessmentQuestionnaireComponent', () => {
  let component: AssessmentQuestionnaireComponent;
  let fixture: ComponentFixture<AssessmentQuestionnaireComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AssessmentQuestionnaireComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssessmentQuestionnaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
