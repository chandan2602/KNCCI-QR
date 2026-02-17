import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FeedbackquestionaireComponent } from './feedbackquestionaire.component';

describe('FeedbackquestionaireComponent', () => {
  let component: FeedbackquestionaireComponent;
  let fixture: ComponentFixture<FeedbackquestionaireComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FeedbackquestionaireComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedbackquestionaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
