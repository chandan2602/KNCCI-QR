import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SmtpComponent } from './smtp.component';

describe('SmtpComponent', () => {
  let component: SmtpComponent;
  let fixture: ComponentFixture<SmtpComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SmtpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmtpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
