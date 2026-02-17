import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddAsseementQuestioniareComponent } from './add-asseement-questioniare.component';

describe('AddAsseementQuestioniareComponent', () => {
  let component: AddAsseementQuestioniareComponent;
  let fixture: ComponentFixture<AddAsseementQuestioniareComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAsseementQuestioniareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAsseementQuestioniareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
