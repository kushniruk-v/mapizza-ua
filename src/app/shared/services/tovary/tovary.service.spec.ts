import { TestBed } from '@angular/core/testing';

import { TovaryService } from './tovary.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { environment } from '../../../../environments/environment';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
describe('TovaryService', () => {
  let service: TovaryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        provideFirebaseApp(() => initializeApp(environment.firebase)),
        provideFirestore(() => getFirestore()),
      ],
    });
    service = TestBed.inject(TovaryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
