import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebtNewPage } from './debt-new.page';

describe('DebtNewPage', () => {
  let component: DebtNewPage;
  let fixture: ComponentFixture<DebtNewPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DebtNewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
