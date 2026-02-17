import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FounderProfileComponent } from './founder-profile.component';

describe('FounderProfileComponent', () => {
  let component: FounderProfileComponent;
  let fixture: ComponentFixture<FounderProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FounderProfileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FounderProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
