import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderWebsiteComponent } from './header-website.component';

describe('HeaderWebsiteComponent', () => {
  let component: HeaderWebsiteComponent;
  let fixture: ComponentFixture<HeaderWebsiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderWebsiteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderWebsiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
