import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddNewTeacherComponent } from './add-new-teacher.component';

describe('AddNewTeacherComponent', () => {
  let component: AddNewTeacherComponent;
  let fixture: ComponentFixture<AddNewTeacherComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddNewTeacherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewTeacherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
