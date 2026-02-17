import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CreatepolComponent } from './createpol.component';

describe('CreatepolComponent', () => {
  let component: CreatepolComponent;
  let fixture: ComponentFixture<CreatepolComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatepolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatepolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
