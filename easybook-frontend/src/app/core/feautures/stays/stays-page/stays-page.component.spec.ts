import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaysPageComponent } from './stays-page.component';

describe('StaysPageComponent', () => {
  let component: StaysPageComponent;
  let fixture: ComponentFixture<StaysPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StaysPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StaysPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
