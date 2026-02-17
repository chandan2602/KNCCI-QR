import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CourseProgramOutcomeComponent } from './course-program-outcome.component';

describe('CourseProgramOutcomeComponent', () => {
  let component: CourseProgramOutcomeComponent;
  let fixture: ComponentFixture<CourseProgramOutcomeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CourseProgramOutcomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseProgramOutcomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
