import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TovaryComponent } from './tovary.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { environment } from '../../../environments/environment';
describe('TovaryComponent', () => {
  let component: TovaryComponent;
  let fixture: ComponentFixture<TovaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TovaryComponent ],
      imports:[HttpClientModule,
        RouterTestingModule,
        provideFirebaseApp(() => initializeApp(environment.firebase)),
        provideFirestore(() => getFirestore()),
        provideStorage(() => getStorage())],
       
    })
    .compileComponents();

    fixture = TestBed.createComponent(TovaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
