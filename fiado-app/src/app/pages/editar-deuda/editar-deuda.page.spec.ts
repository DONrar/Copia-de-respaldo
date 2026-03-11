import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditarDeudaPage } from './editar-deuda.page';

describe('EditarDeudaPage', () => {
  let component: EditarDeudaPage;
  let fixture: ComponentFixture<EditarDeudaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarDeudaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
