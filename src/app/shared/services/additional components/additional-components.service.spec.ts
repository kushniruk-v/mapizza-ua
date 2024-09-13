import { TestBed } from '@angular/core/testing';

import { AdditionalComponentsService } from './additional-components.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { environment } from '../../../../environments/environment';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

describe('AdditionalComponentsService', () => {
  let service: AdditionalComponentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[
        HttpClientTestingModule,
        provideFirebaseApp(() => initializeApp(environment.firebase)),
        provideFirestore(() => getFirestore())
      ]
    });
    service = TestBed.inject(AdditionalComponentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
