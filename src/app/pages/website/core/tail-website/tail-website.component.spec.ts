import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TailWebsiteComponent } from './tail-website.component';

describe('TailWebsiteComponent', () => {
  let component: TailWebsiteComponent;
  let fixture: ComponentFixture<TailWebsiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TailWebsiteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TailWebsiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
