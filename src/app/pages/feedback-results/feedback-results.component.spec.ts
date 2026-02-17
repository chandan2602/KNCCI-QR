import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FeedbackResultsComponent } from './feedback-results.component';

describe('FeedbackResultsComponent', () => {
  let component: FeedbackResultsComponent;
  let fixture: ComponentFixture<FeedbackResultsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FeedbackResultsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedbackResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
