import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { INewsRequest } from '../../interfaces/news/news-interface';
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
export class NewsService {
  private url = environment.BACKEND_URL;
  private api = { news: `${this.url}/news` };
  private newsCollection!: CollectionReference<DocumentData>;
  constructor(private http: HttpClient, private AngularFireStorage: Firestore) {
    this.newsCollection = collection(AngularFireStorage, 'news');
  }

  getAllFirebase() {
    return collectionData(this.newsCollection, { idField: 'id' });
  }

  getOneFirebase(id: string) {
    const newsDocumentReferens = doc(this.AngularFireStorage, `news/${id}`);
    return docData(newsDocumentReferens, { idField: 'id' });
  }
  createFirebase(news: INewsRequest) {
    return addDoc(this.newsCollection, news);
  }
  updateFirebase(news: INewsRequest, id: string) {
    const newsDocumentReferens = doc(this.AngularFireStorage, `news/${id}`);
    return updateDoc(newsDocumentReferens, { ...news });
  }
  deleteFirebase(id: string) {
    const newsDocumentReferens = doc(this.AngularFireStorage, `news/${id}`);
    return deleteDoc(newsDocumentReferens);
  }
}
