import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncubatorLstComponent } from './incubator-lst.component';

describe('IncubatorLstComponent', () => {
  let component: IncubatorLstComponent;
  let fixture: ComponentFixture<IncubatorLstComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncubatorLstComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncubatorLstComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
