import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncubatorProfileComponent } from './incubator-profile.component';

describe('IncubatorProfileComponent', () => {
  let component: IncubatorProfileComponent;
  let fixture: ComponentFixture<IncubatorProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncubatorProfileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncubatorProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
