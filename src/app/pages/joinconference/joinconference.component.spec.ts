import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { JoinconferenceComponent } from './joinconference.component';

describe('JoinconferenceComponent', () => {
  let component: JoinconferenceComponent;
  let fixture: ComponentFixture<JoinconferenceComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ JoinconferenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JoinconferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
