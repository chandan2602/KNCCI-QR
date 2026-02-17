import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddUserRegistrationComponent } from './add-user-registration.component';

describe('AddUserRegistrationComponent', () => {
  let component: AddUserRegistrationComponent;
  let fixture: ComponentFixture<AddUserRegistrationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddUserRegistrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUserRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
