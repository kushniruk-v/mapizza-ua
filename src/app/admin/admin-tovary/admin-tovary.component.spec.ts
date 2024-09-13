import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTovaryComponent } from './admin-tovary.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { environment } from '../../../environments/environment';
describe('AdminTovaryComponent', () => {
  let component: AdminTovaryComponent;
  let fixture: ComponentFixture<AdminTovaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminTovaryComponent],
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        provideFirebaseApp(() => initializeApp(environment.firebase)),
        provideFirestore(() => getFirestore()),
        provideStorage(() => getStorage()),
      ],

      providers: [{ provide: Storage, useValue: {} }],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminTovaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
