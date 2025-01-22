import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebsiteProductListComponent } from './website-product-list.component';

describe('WebsiteProductListComponent', () => {
  let component: WebsiteProductListComponent;
  let fixture: ComponentFixture<WebsiteProductListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebsiteProductListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WebsiteProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
