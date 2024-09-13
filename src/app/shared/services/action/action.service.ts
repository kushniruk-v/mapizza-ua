import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
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
} from '@angular/fire/firestore';
import { DocumentData, collection } from '@firebase/firestore';
import { IActionRequest } from '../../interfaces/action/action-interface';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class ActionService {
  private url = environment.BACKEND_URL;
  private api = { actions: `${this.url}/actions` };
  private actionCollection!: CollectionReference<DocumentData>;

  constructor(private http: HttpClient, private AngularFireStorage: Firestore) {
    this.actionCollection = collection(AngularFireStorage, 'actions');
  }
  getAllFirebase() {
    return collectionData(this.actionCollection, { idField: 'id' });
  }
  getOneFirebase(id: string) {
    const actionDocumentReferens = doc(
      this.AngularFireStorage,
      `actions/${id}`
    );
    return docData(actionDocumentReferens, { idField: 'id' });
  }
  createFirebase(action: IActionRequest) {
    return addDoc(this.actionCollection, action);
  }
  updateFirebase(action: IActionRequest, id: string) {
    const actionDocumentReferens = doc(
      this.AngularFireStorage,
      `actions/${id}`
    );
    return updateDoc(actionDocumentReferens, { ...action });
  }
  deleteFirebase(id: string) {
    const actionDocumentReferens = doc(
      this.AngularFireStorage,
      `actions/${id}`
    );
    return deleteDoc(actionDocumentReferens);
  }
}
