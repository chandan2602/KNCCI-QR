import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ContentAuthoringComponent } from './content-authoring.component';

describe('ContentAuthoringComponent', () => {
  let component: ContentAuthoringComponent;
  let fixture: ComponentFixture<ContentAuthoringComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentAuthoringComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentAuthoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
