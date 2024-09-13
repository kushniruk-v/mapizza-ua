import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ICategoryRequest } from '../../interfaces/category/category-interface';
import {
  CollectionReference,
  Firestore,
  addDoc,
  collectionData,
  deleteDoc,
  doc,
  updateDoc,
} from '@angular/fire/firestore';
import { DocumentData, collection } from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private url = environment.BACKEND_URL;
  private api = { categories: `${this.url}/categories` };
  private categoryCollection!: CollectionReference<DocumentData>;

  constructor(private http: HttpClient, private AngularFireStorage: Firestore) {
    this.categoryCollection = collection(AngularFireStorage, 'categories');
  }

  getAllFirebase() {
    return collectionData(this.categoryCollection, { idField: 'id' });
  }
  createFirebase(category: ICategoryRequest) {
    return addDoc(this.categoryCollection, category);
  }
  updateFirebase(category: ICategoryRequest, id: string) {
    const categoryDocumentReferens = doc(
      this.AngularFireStorage,
      `categories/${id}`
    );
    return updateDoc(categoryDocumentReferens, { ...category });
  }
  deleteFirebase(id: string) {
    const categoryDocumentReferens = doc(
      this.AngularFireStorage,
      `categories/${id}`
    );
    return deleteDoc(categoryDocumentReferens);
  }
}
