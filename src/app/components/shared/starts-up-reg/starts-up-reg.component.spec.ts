import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartsUpRegComponent } from './starts-up-reg.component';

describe('StartsUpRegComponent', () => {
  let component: StartsUpRegComponent;
  let fixture: ComponentFixture<StartsUpRegComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StartsUpRegComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StartsUpRegComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
