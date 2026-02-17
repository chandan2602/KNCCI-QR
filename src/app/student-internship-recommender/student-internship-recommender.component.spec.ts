import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentInternshipRecommenderComponent } from './student-internship-recommender.component';

describe('StudentInternshipRecommenderComponent', () => {
  let component: StudentInternshipRecommenderComponent;
  let fixture: ComponentFixture<StudentInternshipRecommenderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentInternshipRecommenderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentInternshipRecommenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
