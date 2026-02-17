import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AssessmentResultComponent } from './assessment-result.component';

describe('AssessmentResultComponent', () => {
  let component: AssessmentResultComponent;
  let fixture: ComponentFixture<AssessmentResultComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AssessmentResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssessmentResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
