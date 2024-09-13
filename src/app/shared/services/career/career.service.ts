import { Injectable } from '@angular/core';
import { ICareerRequest } from '../../interfaces/career/career-interface';
import { HttpClient } from '@angular/common/http';
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
export class CareerService {
  private url = environment.BACKEND_URL;
  private api = { careers: `${this.url}/careers` };
  private careerCollection!: CollectionReference<DocumentData>;
  constructor(private http: HttpClient, private AngularFireStorage: Firestore) {
    this.careerCollection = collection(AngularFireStorage, 'careers');
  }

  getAllFirebase() {
    return collectionData(this.careerCollection, { idField: 'id' });
  }

  getOneFirebase(id: string) {
    const careerDocumentReferens = doc(
      this.AngularFireStorage,
      `careers/${id}`
    );
    return docData(careerDocumentReferens, { idField: 'id' });
  }
  createFirebase(career: ICareerRequest) {
    return addDoc(this.careerCollection, career);
  }
  updateFirebase(career: ICareerRequest, id: string) {
    const careerDocumentReferens = doc(
      this.AngularFireStorage,
      `careers/${id}`
    );
    return updateDoc(careerDocumentReferens, { ...career });
  }
  deleteFirebase(id: string) {
    const careerDocumentReferens = doc(
      this.AngularFireStorage,
      `careers/${id}`
    );
    return deleteDoc(careerDocumentReferens);
  }
}
