import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPayToMoneyComponent } from './add-pay-to-money.component';

describe('AddPayToMoneyComponent', () => {
  let component: AddPayToMoneyComponent;
  let fixture: ComponentFixture<AddPayToMoneyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddPayToMoneyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPayToMoneyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
