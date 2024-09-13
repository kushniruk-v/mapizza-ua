import { Component } from '@angular/core';
import {
  deleteObject,
  getDownloadURL,
  percentage,
  ref,
  Storage,
  uploadBytesResumable,
} from '@angular/fire/storage';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { INewsResponse } from '../../shared/interfaces/news/news-interface';
import { NewsService } from '../../shared/services/news/news.service';

@Component({
  selector: 'app-admin-news',
  templateUrl: './admin-news.component.html',
  styleUrls: ['./admin-news.component.scss'],
})
export class AdminNewsComponent {
  public adminNews: Array<INewsResponse> = [];
  public isOpen = false;
  public isModal = false;
  public newsForm!: FormGroup;
  private currentActionId!: number | string;
  public uploadPercent!: number;
  public uploadPercentAdd!: number;
  public isUploaded = false;
  public isUploadedAdd = false;
  public editStatus = false;
  public isDelete = true;
  newFormNews: any;
  constructor(
    private newsService: NewsService,
    private fb: FormBuilder,
    private storage: Storage
  ) {}
  ngOnInit(): void {
    this.initNewsForm();
    this.loadNews();
  }
  addNews(): void {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.isModal = true;
    } else {
      this.isModal = false;
    }
  }
  initNewsForm(): void {
    this.newsForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      imagePath: ['', Validators.required],
      newFormNews: new FormArray([]),
    });
  }
  get addNewsArray(): FormArray {
    return this.newsForm.get('newFormNews') as FormArray;
  }
  addPassenger(): void {
    this.addNewsArray.push(
      this.fb.group({
        header: [''],
        additionalDescription: [''],
        additionalImage: null,
        additionalList: [''],
      })
    );
    this.newsForm.updateValueAndValidity();
    this.uploadPercentAdd = 0;
    this.isUploadedAdd = false;
  }
  deleteAdditionalNews(index: number): void {
    this.addNewsArray.removeAt(index);
  }
  loadNews(): void {
    this.newsService.getAllFirebase().subscribe((data) => {
      this.adminNews = data as INewsResponse[];
    });
  }
  editNews(news: INewsResponse): void {
    this.newsForm.patchValue({
      title: news.title,
      description: news.description,
      imagePath: news.imagePath,
    });
    const newsArray: FormGroup[] = news.newFormNews.map((newFormNews) => {
      return this.fb.group({
        header: newFormNews.header,
        additionalDescription: newFormNews.additionalDescription,
        additionalImage: newFormNews.additionalImage,
        additionalList: newFormNews.additionalList,
      });
    });
    this.newsForm.setControl('newFormNews', this.fb.array(newsArray));
    this.currentActionId = news.id;
    this.currentActionId = news.id;
    this.editStatus = true;
    this.isModal = true;
    this.isUploaded = true;
    this.isUploadedAdd = true;
    this.uploadPercent = 0;
    this.uploadPercentAdd = 0;
  }
  saveNews(): void {
    if (this.editStatus) {
      this.newsService
        .updateFirebase(this.newsForm.value, this.currentActionId as string)
        .then(() => {
          this.loadNews();
        });
    } else {
      this.newsService.createFirebase(this.newsForm.value).then(() => {
        this.loadNews();
      });
    }
    this.newsForm.reset();
    this.editStatus = false;
    this.isUploaded = false;
    this.uploadPercent = 0;
    this.uploadPercentAdd = 0;
  }
  deleteAction(): void {
    this.isDelete = true;
  }
  deleteModalAction(action: INewsResponse): void {
    if (this.isDelete) {
      this.newsService.deleteFirebase(action.id as string).then(() => {
        this.loadNews();
      });
    }
  }

  upload(event: any): void {
    const file = event.target.files[0];
    this.uploadFile('images', file.name, file)
      .then((data) => {
        this.newsForm.patchValue({
          imagePath: data,
        });
        this.isUploaded = true;
      })
      .catch((err) => {
        console.log(err);
      });
  }
  uploadAdd(event: any): void {
    const file = event.target.files[0];
    const index = this.addNewsArray.length - 1;
    this.uploadFileAdd('images', file.name, file)
      .then((data) => {
        this.addNewsArray.at(index)?.patchValue({
          additionalImage: data,
        });
        this.isUploadedAdd = true;
      })
      .catch((err) => {
        console.log(err);
      });
  }
  async uploadFile(
    folder: string,
    name: string,
    file: File | null
  ): Promise<string> {
    const path = `${folder}/${name}`;
    let url = '';
    if (file) {
      try {
        const storageRef = ref(this.storage, path);
        const task = uploadBytesResumable(storageRef, file);
        percentage(task).subscribe((data) => {
          this.uploadPercent = data.progress;
        });
        await task;
        url = await getDownloadURL(storageRef);
      } catch (e: any) {
        console.error(e);
      }
    } else {
      console.log('wrong format');
    }
    return Promise.resolve(url);
  }
  async uploadFileAdd(
    folder: string,
    name: string,
    file: File | null
  ): Promise<string> {
    const path = `${folder}/${name}`;
    let url = '';
    if (file) {
      try {
        const storageRef = ref(this.storage, path);
        const task = uploadBytesResumable(storageRef, file);
        percentage(task).subscribe((data) => {
          this.uploadPercentAdd = data.progress;
        });
        await task;
        url = await getDownloadURL(storageRef);
      } catch (e: any) {
        console.error(e);
      }
    } else {
      console.log('wrong format');
    }
    return Promise.resolve(url);
  }
  deleteImage(): void {
    const task = ref(this.storage, this.valueByControl('imagePath'));
    deleteObject(task).then(() => {
      console.log('File deleted');
      this.isUploaded = false;
      this.uploadPercent = 0;
      this.newsForm.patchValue({
        imagePath: null,
      });
    });
  }
  deleteImageAdd(index: number): void {
    const additionalImageValue = this.valueByControlAdd(
      'additionalImage',
      index
    );
    if (additionalImageValue) {
      const task = ref(this.storage, additionalImageValue);
      deleteObject(task)
        .then(() => {
          console.log('File deleted ');
          const addNewsArray = this.newsForm.get('newFormNews') as FormArray;
          const newsControl = addNewsArray.at(index) as FormGroup;
          newsControl.patchValue({
            additionalImage: null,
          });
          this.isUploadedAdd = false;
          this.uploadPercentAdd = 0;
        })
        .catch((error) => {
          console.error('Error deleting file:', error);
        });
    }
    this.isUploadedAdd = true;
  }
  valueByControl(control: string): string {
    return this.newsForm.get(control)?.value;
  }
  valueByControlAdd(control: string, index: number): string {
    return this.addNewsArray.at(index).get(control)?.value;
  }
}
