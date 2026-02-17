import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentInternshipMenuComponent } from './student-internship-menu.component';

describe('StudentInternshipMenuComponent', () => {
  let component: StudentInternshipMenuComponent;
  let fixture: ComponentFixture<StudentInternshipMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentInternshipMenuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentInternshipMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
