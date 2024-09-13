import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  deleteObject,
  getDownloadURL,
  percentage,
  ref,
  Storage,
  uploadBytesResumable,
} from '@angular/fire/storage';
import { ITovaryResponse } from '../../shared/interfaces/tovary/tovary-interface';
import { ICategoryResponse } from '../../shared/interfaces/category/category-interface';
import { CategoryService } from '../../shared/services/category/category.service';
import { TovaryService } from '../../shared/services/tovary/tovary.service';
@Component({
  selector: 'app-admin-tovary',
  templateUrl: './admin-tovary.component.html',
  styleUrls: ['./admin-tovary.component.scss'],
})
export class AdminTovaryComponent {
  public adminTovary: Array<ITovaryResponse> = [];
  public adminCategories: Array<ICategoryResponse> = [];
  public tovaryForm!: FormGroup;
  public isOpen = false;
  public isModal = false;
  public editStatus = false;
  private currentTovaryId!: number | string;
  public uploadPercent!: number;
  public uploadPercentCategory!: number;
  public isUploaded = false;
  public isUploadedCategory = false;
  public isDelete = true;
  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private tovaryService: TovaryService,
    private storage: Storage
  ) {}
  ngOnInit(): void {
    this.initTovaryForm();
    this.loadTovary();
    this.loadCategories();
  }
  addTovary(): void {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.isModal = true;
    } else {
      this.isModal = false;
    }
    this.uploadPercent = 0;
  }
  initTovaryForm(): void {
    this.tovaryForm = this.fb.group({
      category: [null, Validators.required],
      name: [null, Validators.required],
      path: [null, Validators.required],
      description: [null, Validators.required],
      weight: [null],
      price: [null, Validators.required],
      bonus: [null, Validators.required],
      imagePath: [null, Validators.required],
      imagePathCategory: [null],
      categoryTovary: [null],
      categoryTovarPath: [null],
    });
  }
  loadCategories(): void {
    this.categoryService.getAllFirebase().subscribe((data) => {
      this.adminCategories = data as ICategoryResponse[];
      this.tovaryForm.patchValue({
        category: this.adminCategories[0].id,
      });
    });
  }
  loadTovary(): void {
    this.tovaryService.getAllFirebase().subscribe((data) => {
      this.adminTovary = data as ITovaryResponse[];
    });
  }
  saveTovary(): void {
    if (this.editStatus) {
      this.tovaryService
        .updateFirebase(this.tovaryForm.value, this.currentTovaryId as string)
        .then(() => {
          this.loadTovary();
          this.isModal = false;
        });
    } else {
      this.tovaryService.createFirebase(this.tovaryForm.value).then(() => {
        this.loadTovary();
      });
    }
    this.editStatus = false;
    this.isUploaded = false;
    this.isUploadedCategory = false;
    this.uploadPercent = 0;
    this.uploadPercentCategory = 0;
    this.tovaryForm.reset();
  }
  editTovary(tovary: ITovaryResponse): void {
    this.tovaryForm.patchValue({
      category: tovary.category,
      name: tovary.name,
      path: tovary.path,
      description: tovary.description,
      weight: tovary.weight,
      price: tovary.price,
      bonus: tovary.bonus,
      imagePath: tovary.imagePath,
      imagePathCategory: tovary.imagePathCategory,
      categoryTovary: tovary.categoryTovary,
      categoryTovarPath: tovary.categoryTovarPath,
    });
    this.currentTovaryId = tovary.id as number;
    this.editStatus = true;
    this.isModal = true;
    this.isUploaded = true;
    this.isUploadedCategory = true;
    this.uploadPercent = 0;
    this.uploadPercentCategory = 0;
  }
  deleteTovary(tovary: ITovaryResponse): void {
    if (confirm('Ви справді хочете видалити товар?')) {
      this.tovaryService.deleteFirebase(tovary.id as string).then(() => {
        this.loadTovary();
      });
    }
  }
  upload(event: any): void {
    const file = event.target.files[0];
    this.uploadFile('images', file.name, file)
      .then((data) => {
        this.tovaryForm.patchValue({
          imagePath: data,
        });
        this.isUploaded = true;
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
  uploadCategoryTovary(event: any): void {
    const file = event.target.files[0];
    this.uploadFileCategory('images', file.name, file)
      .then((data) => {
        this.tovaryForm.patchValue({
          imagePathCategory: data,
        });
        this.isUploadedCategory = true;
      })
      .catch((err) => {
        console.log(err);
      });
  }
  async uploadFileCategory(
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
          this.uploadPercentCategory = data.progress;
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
      this.tovaryForm.patchValue({
        imagePath: null,
      });
    });
  }
  deleteImageCategory(): void {
    const task = ref(this.storage, this.valueByControl('imagePathCategory'));
    deleteObject(task).then(() => {
      console.log('File deleted');
      this.isUploadedCategory = false;
      this.uploadPercentCategory = 0;
      this.tovaryForm.patchValue({
        imagePathCategory: null,
      });
    });
  }
  valueByControl(control: string): string {
    return this.tovaryForm.get(control)?.value;
  }
  valueByControlCategory(control: string): string {
    return this.tovaryForm.get(control)?.value;
  }
}
