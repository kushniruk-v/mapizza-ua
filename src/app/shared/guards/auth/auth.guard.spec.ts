import { TestBed } from '@angular/core/testing';

import { AuthGuard } from './auth.guard';
import { environment } from '../../../../environments/environment';
import { AngularFireModule } from '@angular/fire/compat';

describe('AuthGuard', () => {
  let guard: AuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AngularFireModule.initializeApp(environment.firebase)],
    });
    guard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
