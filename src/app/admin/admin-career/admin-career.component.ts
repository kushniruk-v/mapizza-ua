import { Component } from '@angular/core';
import {
  deleteObject,
  getDownloadURL,
  percentage,
  ref,
  Storage,
  uploadBytesResumable,
} from '@angular/fire/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ICareerResponse } from '../../shared/interfaces/career/career-interface';
import { CareerService } from '../../shared/services/career/career.service';
@Component({
  selector: 'app-admin-career',
  templateUrl: './admin-career.component.html',
  styleUrls: ['./admin-career.component.scss'],
})
export class AdminCareerComponent {
  public adminCareer: Array<ICareerResponse> = [];
  public isOpen = false;
  public isModal = false;
  public careerForm!: FormGroup;
  private currentCareerId!: number | string;
  public uploadPercent!: number;
  public isUploaded = false;
  public editStatus = false;
  public isDelete = true;
  constructor(
    private careerService: CareerService,
    private fb: FormBuilder,
    private storage: Storage
  ) {}
  ngOnInit(): void {
    this.initCareerForm();
    this.loadCareer();
  }
  addCareer(): void {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.isModal = true;
    } else {
      this.isModal = false;
    }
  }
  initCareerForm(): void {
    this.careerForm = this.fb.group({
      name: [null, Validators.required],
      title: [null, Validators.required],
      description: [null, Validators.required],
      imagePath: ['', Validators.required],
    });
  }
  loadCareer(): void {
    this.careerService.getAllFirebase().subscribe((data) => {
      this.adminCareer = data as ICareerResponse[];
    });
  }
  editCareer(career: ICareerResponse): void {
    this.careerForm.patchValue({
      name: career.name,
      title: career.title,
      description: career.description,
      imagePath: career.imagePath,
    });
    this.currentCareerId = career.id;
    this.editStatus = true;
    this.isModal = true;
    this.isUploaded = true;
    this.uploadPercent = 0;
  }
  saveCareer(): void {
    if (this.editStatus) {
      this.careerService
        .updateFirebase(this.careerForm.value, this.currentCareerId as string)
        .then(() => {
          this.loadCareer();
        });
    } else {
      this.careerService.createFirebase(this.careerForm.value).then(() => {
        this.loadCareer();
      });
    }
    this.careerForm.reset();
    this.editStatus = false;
    this.isUploaded = false;
    this.uploadPercent = 0;
  }
  deleteCareer(): void {
    this.isDelete = true;
  }
  deleteModalCareer(career: ICareerResponse): void {
    if (this.isDelete) {
      this.careerService.deleteFirebase(career.id as string).then(() => {
        this.loadCareer();
      });
    }
  }
  upload(event: any): void {
    const file = event.target.files[0];
    this.uploadFile('images', file.name, file)
      .then((data) => {
        this.careerForm.patchValue({
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
      this.careerForm.patchValue({
        imagePath: null,
      });
    });
  }
  valueByControl(control: string): string {
    return this.careerForm.get(control)?.value;
  }
}
