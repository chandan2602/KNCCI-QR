import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprenticeshipDetailsComponent } from './apprenticeship-details.component';

describe('ApprenticeshipDetailsComponent', () => {
  let component: ApprenticeshipDetailsComponent;
  let fixture: ComponentFixture<ApprenticeshipDetailsComponent>;

  beforeEach(async) {
    await TestBed.configureTestingModule({
      declarations: [ ApprenticeshipDetailsComponent ]
    })
    .compileComponents();
  }

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprenticeshipDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
