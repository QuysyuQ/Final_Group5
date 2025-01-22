import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePayToMoneyComponent } from './update-pay-to-money.component';

describe('UpdatePayToMoneyComponent', () => {
  let component: UpdatePayToMoneyComponent;
  let fixture: ComponentFixture<UpdatePayToMoneyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdatePayToMoneyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdatePayToMoneyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
