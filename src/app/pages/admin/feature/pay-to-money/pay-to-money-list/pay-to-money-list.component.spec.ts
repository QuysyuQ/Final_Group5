import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayToMoneyListComponent } from './pay-to-money-list.component';

describe('PayToMoneyListComponent', () => {
  let component: PayToMoneyListComponent;
  let fixture: ComponentFixture<PayToMoneyListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PayToMoneyListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayToMoneyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
