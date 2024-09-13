import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IAdditionalComponensReguest } from '../../interfaces/additional-components/additional-components-interface';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  Firestore,
  CollectionReference,
  addDoc,
  collectionData,
  doc,
  updateDoc,
  deleteDoc,
  docData,
  DocumentData,
  collection,
} from '@angular/fire/firestore';
@Injectable({
  providedIn: 'root',
})
export class AdditionalComponentsService {
  private url = environment.BACKEND_URL;
  private api = { additionals: `${this.url}/additional-components` };
  private additionalCollection!: CollectionReference<DocumentData>;
  constructor(private http: HttpClient, private AngularFireStorage: Firestore) {
    this.additionalCollection = collection(
      AngularFireStorage,
      'additional-components'
    );
  }

  getAllFirebase() {
    return collectionData(this.additionalCollection, { idField: 'id' });
  }

  getOneFirebase(id: string) {
    const additionalDocumentReferens = doc(
      this.AngularFireStorage,
      `additional-components/${id}`
    );
    return docData(additionalDocumentReferens, { idField: 'id' });
  }
  createFirebase(additional: IAdditionalComponensReguest) {
    return addDoc(this.additionalCollection, additional);
  }
  updateFirebase(additional: IAdditionalComponensReguest, id: string) {
    const additionalDocumentReferens = doc(
      this.AngularFireStorage,
      `additional-components/${id}`
    );
    return updateDoc(additionalDocumentReferens, { ...additional });
  }
  deleteFirebase(id: string) {
    const additionalDocumentReferens = doc(
      this.AngularFireStorage,
      `additional-components/${id}`
    );
    return deleteDoc(additionalDocumentReferens);
  }
}
