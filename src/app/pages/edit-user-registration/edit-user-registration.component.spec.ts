import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditUserRegistrationComponent } from './edit-user-registration.component';

describe('EditUserRegistrationComponent', () => {
  let component: EditUserRegistrationComponent;
  let fixture: ComponentFixture<EditUserRegistrationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditUserRegistrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditUserRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
