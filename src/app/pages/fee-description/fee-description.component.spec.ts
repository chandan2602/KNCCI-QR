import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FeeDescriptionComponent } from './fee-description.component';

describe('FeeDescriptionComponent', () => {
  let component: FeeDescriptionComponent;
  let fixture: ComponentFixture<FeeDescriptionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FeeDescriptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeeDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
