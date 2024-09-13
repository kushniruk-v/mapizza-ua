import { TestBed } from '@angular/core/testing';

import { TovaryInfoResolver } from './tovary-info.resolver';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { environment } from '../../../../environments/environment';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
describe('TovaryInfoResolver', () => {
  let resolver: TovaryInfoResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        provideFirebaseApp(() => initializeApp(environment.firebase)),
        provideFirestore(() => getFirestore()),
      ],
    });
    resolver = TestBed.inject(TovaryInfoResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
