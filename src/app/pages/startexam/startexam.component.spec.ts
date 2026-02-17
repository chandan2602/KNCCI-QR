import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { StartexamComponent } from './startexam.component';

describe('StartexamComponent', () => {
  let component: StartexamComponent;
  let fixture: ComponentFixture<StartexamComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ StartexamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StartexamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
