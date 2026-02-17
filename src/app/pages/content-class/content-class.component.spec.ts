import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ContentClassComponent } from './content-class.component';

describe('ContentClassComponent', () => {
  let component: ContentClassComponent;
  let fixture: ComponentFixture<ContentClassComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentClassComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentClassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
