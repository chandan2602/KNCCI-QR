import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { StudentCgpaComponent } from './student-cgpa.component';

describe('StudentCgpaComponent', () => {
  let component: StudentCgpaComponent;
  let fixture: ComponentFixture<StudentCgpaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentCgpaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentCgpaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
