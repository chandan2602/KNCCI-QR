import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderContactsComponent } from './header-contacts.component';

describe('HeaderContactsComponent', () => {
  let component: HeaderContactsComponent;
  let fixture: ComponentFixture<HeaderContactsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeaderContactsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderContactsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
