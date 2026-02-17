import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TaskInRolesComponent } from './task-in-roles.component';

describe('TaskInRolesComponent', () => {
  let component: TaskInRolesComponent;
  let fixture: ComponentFixture<TaskInRolesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskInRolesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskInRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
