import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncubatorDashboardComponent } from './incubator-dashboard.component';

describe('IncubatorDashboardComponent', () => {
  let component: IncubatorDashboardComponent;
  let fixture: ComponentFixture<IncubatorDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncubatorDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncubatorDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
