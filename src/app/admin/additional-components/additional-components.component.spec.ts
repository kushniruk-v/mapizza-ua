import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdditionalComponentsComponent } from './additional-components.component';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { environment } from '../../../environments/environment';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideStorage, getStorage } from '@angular/fire/storage';
describe('AdditionalComponentsComponent', () => {
  let component: AdditionalComponentsComponent;
  let fixture: ComponentFixture<AdditionalComponentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AdditionalComponentsComponent,
        HttpClientTestingModule,
        provideFirebaseApp(() => initializeApp(environment.firebase)),
        provideFirestore(() => getFirestore()),
        provideStorage(() => getStorage()),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdditionalComponentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
