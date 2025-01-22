import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginWebsiteComponent } from './login-website.component';

describe('LoginWebsiteComponent', () => {
  let component: LoginWebsiteComponent;
  let fixture: ComponentFixture<LoginWebsiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginWebsiteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginWebsiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
