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
import { ICategoryResponse } from '../../shared/interfaces/category/category-interface';
import { CategoryService } from '../../shared/services/category/category.service';
@Component({
  selector: 'app-admin-category',
  templateUrl: './admin-category.component.html',
  styleUrls: ['./admin-category.component.scss'],
})
export class AdminCategoryComponent {
  public adminCategories: Array<ICategoryResponse> = [];
  public categoryForm!: FormGroup;
  public isOpen = false;
  public isModal = false;
  public editStatus = false;
  private currentCategoryId!: number | string;
  public uploadPercent!: number;
  public isUploaded = false;
  public isDelete = true;
  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private storage: Storage
  ) {}
  ngOnInit(): void {
    this.initCategoryForm();
    this.loadCategories();
  }
  addCategory(): void {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.isModal = true;
    } else {
      this.isModal = false;
    }
    this.uploadPercent = 0;
  }
  initCategoryForm(): void {
    this.categoryForm = this.fb.group({
      name: [null, Validators.required],
      path: [null, Validators.required],
      imagePath: ['', Validators.required],
    });
  }
  loadCategories(): void {
    this.categoryService.getAllFirebase().subscribe((data) => {
      this.adminCategories = data as ICategoryResponse[];
    });
  }
  editCategory(category: ICategoryResponse): void {
    this.categoryForm.patchValue({
      name: category.name,
      path: category.path,
      imagePath: category.imagePath,
    });
    this.currentCategoryId = category.id as number;
    this.editStatus = true;
    this.isModal = true;
    this.isUploaded = true;
    this.uploadPercent = 0;
  }
  saveCategory(): void {
    if (this.editStatus) {
      this.categoryService
        .updateFirebase(
          this.categoryForm.value,
          this.currentCategoryId as string
        )
        .then(() => {
          this.loadCategories();
        });
      this.isModal = false;
    } else {
      this.categoryService.createFirebase(this.categoryForm.value).then(() => {
        this.loadCategories();
      });
    }
    this.categoryForm.reset();
    this.editStatus = false;
    this.isUploaded = false;
    this.uploadPercent = 0;
  }
  deleteCategory(): void {
    this.isDelete = true;
  }
  deleteModalCategory(category: ICategoryResponse): void {
    if (this.isDelete) {
      this.categoryService.deleteFirebase(category.id as string).then(() => {
        this.loadCategories();
      });
    }
  }
  upload(event: any): void {
    const file = event.target.files[0];
    this.uploadFile('images', file.name, file)
      .then((data) => {
        this.categoryForm.patchValue({
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

  deleteImage(): void {
    const task = ref(this.storage, this.valueByControl('imagePath'));
    deleteObject(task).then(() => {
      console.log('File deleted');
      this.isUploaded = false;
      this.uploadPercent = 0;
      this.categoryForm.patchValue({
        imagePath: null,
      });
    });
  }
  valueByControl(control: string): string {
    return this.categoryForm.get(control)?.value;
  }
}
