import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, switchMap } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
@Injectable({
  providedIn: 'root',
})
export class AccountService {
  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore
  ) {}
  getCurrentUser(): Observable<any> {
    return this.afAuth.authState.pipe(
      switchMap((user) => {
        if (user) {
          return this.firestore
            .doc<any>(`users/${user.uid}`)
            .valueChanges()
            .pipe(
              switchMap((userData) => {
                return of({ uid: user.uid, ...userData });
              })
            );
        } else {
          return of(null);
        }
      })
    );
  }
  getUserOrders(userId: string): Observable<any[]> {
    return this.firestore
      .doc(`users/${userId}`)
      .valueChanges()
      .pipe(map((userData: any) => userData.orders || []));
  }
  register(
    email: string,
    password: string,
    role: string
  ): Promise<firebase.auth.UserCredential> {
    return this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((cred) => {
        return this.firestore
          .doc(`users/${cred.user?.uid}`)
          .set({
            email,
            role,
          })
          .then(() => cred);
      });
  }

  login(
    email: string,
    password: string
  ): Promise<firebase.auth.UserCredential> {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  logout(): Promise<void> {
    return this.afAuth.signOut();
  }
  updateUserOrders(userId: string, orders: any[]): Promise<void> {
    return this.firestore.doc(`users/${userId}`).update({ orders });
  }
}
