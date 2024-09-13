import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from '@angular/fire/auth';
import { Firestore, doc, docData, setDoc } from '@angular/fire/firestore';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ROLE } from '../../shared/constans/role-constans';

export interface Iregister {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  repeatpassword?: string;
}

@Component({
  selector: 'app-authorization',
  templateUrl: './authorization.component.html',
  styleUrls: ['./authorization.component.scss'],
})
export class AuthorizationComponent implements OnInit, OnDestroy {
  public authForm!: FormGroup;
  public registerForm!: FormGroup;
  public loginSubsrition: Subscription = new Subscription();
  public isModal = false;
  private registerData!: Iregister;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private AngularFireStorage: Firestore,
    private auth: Auth
  ) {}

  ngOnDestroy(): void {
    this.loginSubsrition.unsubscribe();
  }
  ngOnInit(): void {
    this.initAuthForm();
    this.InitRegisterForm();
  }
  initAuthForm(): void {
    this.authForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]],
    });
  }
  loginAdmin(): void {
    this.isModal = false;
    const { email, password } = this.authForm.value;
    this.login(email, password)
      .then(() => {
        console.log('login done');
      })
      .catch((e) => {
        console.log('login error', e);
      });
  }
  async login(email: string, password: string): Promise<void> {
    const credential = await signInWithEmailAndPassword(
      this.auth,
      email,
      password
    );
    console.log(credential.user.uid);
    this.loginSubsrition = docData(
      doc(this.AngularFireStorage, 'users', credential.user.uid)
    ).subscribe(
      (user) => {
        const currentUser = { ...user, uid: credential.user.uid };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        if (user && user['role'] === ROLE.ADMIN) {
          this.router.navigate(['/admin']);
        }
      },
      (e) => {
        console.log('error', e);
      }
    );
  }
  InitRegisterForm(): void {
    this.registerForm = this.fb.group({
      firstName: [null, [Validators.required]],
      lastName: [null, [Validators.required]],
      email: [null, [Validators.required]],
      password: [null, [Validators.required]],
      repeatpassword: [null, [Validators.required]],
    });
  }
  registerAdmin(): void {
    this.isModal = true;
    const { email, password } = this.registerForm.value;
    this.registerData = this.registerForm.value;
    this.emailSingUp(email, password)
      .then(() => {
        this.registerForm.reset();
      })
      .catch((e) => {
        console.log(e);
      });
  }
  async emailSingUp(email: string, password: string): Promise<any> {
    const credential = await createUserWithEmailAndPassword(
      this.auth,
      email,
      password
    );
    const user = {
      firstName: this.registerData.firstName,
      lastName: this.registerData.lastName,
      email: credential.user.email,
      role: 'ADMIN',
    };
    setDoc(doc(this.AngularFireStorage, 'users', credential.user.uid), user);
  }
}
