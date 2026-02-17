import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingInternsComponent } from './landing-interns.component';

describe('LandingInternsComponent', () => {
  let component: LandingInternsComponent;
  let fixture: ComponentFixture<LandingInternsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LandingInternsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LandingInternsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
