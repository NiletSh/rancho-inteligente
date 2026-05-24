import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VacunasComponent } from './vacunas';

describe('VacunasComponent', () => {
  let component: VacunasComponent;
  let fixture: ComponentFixture<VacunasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VacunasComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VacunasComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
