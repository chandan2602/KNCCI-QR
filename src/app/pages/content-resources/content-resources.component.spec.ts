import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ContentResourcesComponent } from './content-resources.component';

describe('ContentResourcesComponent', () => {
  let component: ContentResourcesComponent;
  let fixture: ComponentFixture<ContentResourcesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentResourcesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentResourcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
