import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CreateTenantRegistrationComponent } from './create-tenant-registration.component';

describe('CreateTenantRegistrationComponent', () => {
  let component: CreateTenantRegistrationComponent;
  let fixture: ComponentFixture<CreateTenantRegistrationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateTenantRegistrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTenantRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
