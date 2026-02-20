import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprenticeshipsApplicationsComponent } from './apprenticeships-applications.component';

describe('ApprenticeshipsApplicationsComponent', () => {
  let component: ApprenticeshipsApplicationsComponent;
  let fixture: ComponentFixture<ApprenticeshipsApplicationsComponent>;

  beforeEach(async) {
    await TestBed.configureTestingModule({
      declarations: [ ApprenticeshipsApplicationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprenticeshipsApplicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
