import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CourseshAssignUsersComponent } from './coursesh-assign-users.component';

describe('CourseshAssignUsersComponent', () => {
  let component: CourseshAssignUsersComponent;
  let fixture: ComponentFixture<CourseshAssignUsersComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CourseshAssignUsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseshAssignUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
