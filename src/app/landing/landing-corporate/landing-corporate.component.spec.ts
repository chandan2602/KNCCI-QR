import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingCorporateComponent } from './landing-corporate.component';

describe('LandingCorporateComponent', () => {
  let component: LandingCorporateComponent;
  let fixture: ComponentFixture<LandingCorporateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LandingCorporateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LandingCorporateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
