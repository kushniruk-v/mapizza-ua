import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActionInfoResolver } from './action-info.resolver';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { environment } from '../../../../environments/environment';
describe('ActionInfoResolver', () => {
  let resolver: ActionInfoResolver;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        provideFirebaseApp(() => initializeApp(environment.firebase)),
        provideFirestore(() => getFirestore()),
      ],
    });
    resolver = TestBed.inject(ActionInfoResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
