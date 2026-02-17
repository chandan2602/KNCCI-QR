import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EvaluateassignmentsComponent } from './evaluateassignments.component';

describe('EvaluateassignmentsComponent', () => {
  let component: EvaluateassignmentsComponent;
  let fixture: ComponentFixture<EvaluateassignmentsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EvaluateassignmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluateassignmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
