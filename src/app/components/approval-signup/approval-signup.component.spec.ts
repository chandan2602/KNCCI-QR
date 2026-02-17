import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalSignupComponent } from './approval-signup.component';

describe('ApprovalSignupComponent', () => {
  let component: ApprovalSignupComponent;
  let fixture: ComponentFixture<ApprovalSignupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApprovalSignupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovalSignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
