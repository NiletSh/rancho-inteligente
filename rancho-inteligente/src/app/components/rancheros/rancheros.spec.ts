import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RancherosComponent } from './rancheros';

describe('Rancheros', () => {
  let component: RancherosComponent;
  let fixture: ComponentFixture<RancherosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RancherosComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RancherosComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
