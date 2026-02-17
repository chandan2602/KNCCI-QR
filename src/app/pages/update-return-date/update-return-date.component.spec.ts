import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UpdateReturnDateComponent } from './update-return-date.component';

describe('UpdateReturnDateComponent', () => {
  let component: UpdateReturnDateComponent;
  let fixture: ComponentFixture<UpdateReturnDateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateReturnDateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateReturnDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
