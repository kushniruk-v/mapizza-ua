import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KontaktyComponent } from './kontakty.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('KontaktyComponent', () => {
  let component: KontaktyComponent;
  let fixture: ComponentFixture<KontaktyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [KontaktyComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(KontaktyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
