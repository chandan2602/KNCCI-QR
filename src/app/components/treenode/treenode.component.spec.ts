import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TreenodeComponent } from './treenode.component';

describe('TreenodeComponent', () => {
  let component: TreenodeComponent;
  let fixture: ComponentFixture<TreenodeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TreenodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreenodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
