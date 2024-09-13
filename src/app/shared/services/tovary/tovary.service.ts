import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ITovaryRequest } from '../../interfaces/tovary/tovary-interface';
import {
  Firestore,
  CollectionReference,
  addDoc,
  collectionData,
  doc,
  updateDoc,
  deleteDoc,
  docData,
} from '@angular/fire/firestore';
import { DocumentData, collection } from '@firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class TovaryService {
  private url = environment.BACKEND_URL;
  private api = { tovary: `${this.url}/tovary` };
  private tovaryCollection!: CollectionReference<DocumentData>;
  constructor(private http: HttpClient, private AngularFireStorage: Firestore) {
    this.tovaryCollection = collection(AngularFireStorage, 'tovary');
  }

  getAllFirebase() {
    return collectionData(this.tovaryCollection, { idField: 'id' });
  }

  getAllByCategoryFirebase() {
    return collectionData(this.tovaryCollection, { idField: 'id' });
  }
  getOneFirebase(id: string) {
    const tovarDocumentReferens = doc(this.AngularFireStorage, `tovary/${id}`);
    return docData(tovarDocumentReferens, { idField: 'id' });
  }
  createFirebase(tovar: ITovaryRequest) {
    return addDoc(this.tovaryCollection, tovar);
  }
  updateFirebase(tovary: ITovaryRequest, id: string) {
    const tovarDocumentReferens = doc(this.AngularFireStorage, `tovary/${id}`);
    return updateDoc(tovarDocumentReferens, { ...tovary });
  }
  deleteFirebase(id: string) {
    const tovarDocumentReferens = doc(this.AngularFireStorage, `tovary/${id}`);
    return deleteDoc(tovarDocumentReferens);
  }
}
