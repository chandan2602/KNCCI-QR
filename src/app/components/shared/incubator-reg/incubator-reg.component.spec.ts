import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncubatorRegComponent } from './incubator-reg.component';

describe('IncubatorRegComponent', () => {
  let component: IncubatorRegComponent;
  let fixture: ComponentFixture<IncubatorRegComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncubatorRegComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncubatorRegComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
