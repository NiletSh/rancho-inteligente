import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GanadoComponent} from './ganado';

describe('Ganado', () => {
  let component: GanadoComponent;
  let fixture: ComponentFixture<GanadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GanadoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GanadoComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
