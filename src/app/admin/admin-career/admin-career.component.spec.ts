import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminCareerComponent } from './admin-career.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { environment } from '../../../environments/environment';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideStorage, getStorage } from '@angular/fire/storage';
describe('AdminCareerComponent', () => {
  let component: AdminCareerComponent;
  let fixture: ComponentFixture<AdminCareerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminCareerComponent],
      imports: [
        HttpClientModule,
        RouterTestingModule,
        provideFirebaseApp(() => initializeApp(environment.firebase)),
        provideFirestore(() => getFirestore()),
        provideStorage(() => getStorage()),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminCareerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
