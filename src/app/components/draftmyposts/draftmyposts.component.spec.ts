import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DraftmypostsComponent } from './draftmyposts.component';

describe('DraftmypostsComponent', () => {
  let component: DraftmypostsComponent;
  let fixture: ComponentFixture<DraftmypostsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DraftmypostsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DraftmypostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
