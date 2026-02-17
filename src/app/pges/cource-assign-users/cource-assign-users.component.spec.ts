import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CourceAssignUsersComponent } from './cource-assign-users.component';

describe('CourceAssignUsersComponent', () => {
  let component: CourceAssignUsersComponent;
  let fixture: ComponentFixture<CourceAssignUsersComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CourceAssignUsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourceAssignUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
