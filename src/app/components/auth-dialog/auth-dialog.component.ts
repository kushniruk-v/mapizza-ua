import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from '@angular/fire/auth';
import { Firestore, doc, docData, setDoc } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { createMask } from '@ngneat/input-mask';
import { ROLE } from '../../shared/constans/role-constans';

export interface Iregister {
  firstName: string;
  lastName: string;
  birthday: string;
  email: string;
  phoneNumber: string;
  password: string;
  repeatpassword?: string;
}

@Component({
  selector: 'app-auth-dialog',
  templateUrl: './auth-dialog.component.html',
  styleUrls: ['./auth-dialog.component.scss'],
})
export class AuthDialogComponent {
  public authForm!: FormGroup;
  public registerForm!: FormGroup;
  public isModal = false;
  private registerData!: Iregister;
  public checkPassword = false;

  telInputMask = createMask('+38 (999) 999 99 99');
  birthdayInputMask = createMask<Date>({
    alias: 'datetime',
    inputFormat: 'dd.mm.yyyy',
    parser: (value: string) => {
      const values = value.split('.');
      const year = +values[2];
      const month = +values[1] - 1;
      const date = +values[0];
      return new Date(year, month, date);
    },
  });

  constructor(
    private fb: FormBuilder,
    private auth: Auth,
    private AngularFireStorage: Firestore,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.initAuthForm();
    this.InitRegisterForm();
  }

  initAuthForm(): void {
    this.authForm = this.fb.group({
      email: [null, [Validators.required,Validators.email]],
      password: [null, [Validators.required]],
    });
  }
  InitRegisterForm(): void {
    this.registerForm = this.fb.group({
      firstName: [null, [Validators.required]],
      lastName: [null, [Validators.required]],
      birthday: [null, [Validators.required]],
      email: [null, [Validators.required]],
      phoneNumber: [null, [Validators.required]],
      password: [null, [Validators.required]],
      repeatpassword: [null, [Validators.required]],
    });
  }
  loginUser(): void {
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
    docData(
      doc(this.AngularFireStorage, 'users', credential.user.uid)
    ).subscribe(
      (user) => {
        const currentUser = { ...user, uid: credential.user.uid };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        if (user && user['role'] === ROLE.USER) {
          this.router.navigate(['/userprofile']);
        }
      },
      (e) => {
        console.log('error', e);
      }
    );
  }
  registerUser(): void {
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
      birthday: this.registerData.birthday,
      email: credential.user.email,
      phoneNumber: this.registerData.phoneNumber,
      orders: [],
      role: 'USER',
    };
    setDoc(doc(this.AngularFireStorage, 'users', credential.user.uid), user);
  }
}
