import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PolsComponent } from './pols.component';

describe('PolsComponent', () => {
  let component: PolsComponent;
  let fixture: ComponentFixture<PolsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PolsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
