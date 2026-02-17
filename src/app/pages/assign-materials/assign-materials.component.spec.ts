import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AssignMaterialsComponent } from './assign-materials.component';

describe('AssignMaterialsComponent', () => {
  let component: AssignMaterialsComponent;
  let fixture: ComponentFixture<AssignMaterialsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignMaterialsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignMaterialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
