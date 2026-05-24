import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VeterinariosComponent } from './veterinarios';

describe('Veterinarios', () => {
  let component: VeterinariosComponent;
  let fixture: ComponentFixture<VeterinariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VeterinariosComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VeterinariosComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
