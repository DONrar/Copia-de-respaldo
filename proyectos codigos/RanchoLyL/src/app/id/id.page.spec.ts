import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IdPage } from './id.page';

describe('IdPage', () => {
  let component: IdPage;
  let fixture: ComponentFixture<IdPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(IdPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
