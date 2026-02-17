import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentJobMenuComponent } from './student-job-menu.component';

describe('StudentJobMenuComponent', () => {
  let component: StudentJobMenuComponent;
  let fixture: ComponentFixture<StudentJobMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentJobMenuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentJobMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
