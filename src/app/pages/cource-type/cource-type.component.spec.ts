import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CourceTypeComponent } from './cource-type.component';

describe('CourceTypeComponent', () => {
  let component: CourceTypeComponent;
  let fixture: ComponentFixture<CourceTypeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CourceTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourceTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
