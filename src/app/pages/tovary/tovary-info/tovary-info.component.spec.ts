import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TovaryInfoComponent } from './tovary-info.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Firestore } from '@angular/fire/firestore';
import { environment } from '../../../../environments/environment';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { AngularFireModule } from '@angular/fire/compat';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
xdescribe('TovaryInfoComponent', () => {
  let component: TovaryInfoComponent;
  let fixture: ComponentFixture<TovaryInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TovaryInfoComponent ],
      imports:[
        HttpClientTestingModule,
        RouterTestingModule,
        provideFirebaseApp(() => initializeApp(environment.firebase)),
        provideFirestore(() => getFirestore()),
        AngularFireModule.initializeApp(environment.firebase)
      ],
   
      schemas:[
        NO_ERRORS_SCHEMA
      ],
      providers: [
        { provide: Firestore, useValue: getFirestore() }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TovaryInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
