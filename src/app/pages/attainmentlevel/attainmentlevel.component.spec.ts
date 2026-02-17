import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AttainmentlevelComponent } from './attainmentlevel.component';

describe('AttainmentlevelComponent', () => {
  let component: AttainmentlevelComponent;
  let fixture: ComponentFixture<AttainmentlevelComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AttainmentlevelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttainmentlevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
