import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartsUpComponent } from './starts-up.component';

describe('StartsUpComponent', () => {
  let component: StartsUpComponent;
  let fixture: ComponentFixture<StartsUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StartsUpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StartsUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
