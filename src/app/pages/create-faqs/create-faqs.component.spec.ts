import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CreateFAQsComponent } from './create-faqs.component';

describe('CreateFAQsComponent', () => {
  let component: CreateFAQsComponent;
  let fixture: ComponentFixture<CreateFAQsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateFAQsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateFAQsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
