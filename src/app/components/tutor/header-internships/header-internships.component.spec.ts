import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderInternshipsComponent } from './header-internships.component';

describe('HeaderInternshipsComponent', () => {
  let component: HeaderInternshipsComponent;
  let fixture: ComponentFixture<HeaderInternshipsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeaderInternshipsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderInternshipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
