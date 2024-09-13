import { TestBed } from '@angular/core/testing';
import { CareerService } from './career.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { environment } from '../../../../environments/environment';

describe('CareerService', () => {
  let service: CareerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        provideFirebaseApp(() => initializeApp(environment.firebase)),
        provideFirestore(() => getFirestore()),
      ],
      providers: [CareerService],
    });
    service = TestBed.inject(CareerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
