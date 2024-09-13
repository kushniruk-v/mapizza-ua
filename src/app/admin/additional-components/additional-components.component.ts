import { Component } from '@angular/core';
import { IAdditionalComponensResponse } from '../../shared/interfaces/additional-components/additional-components-interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdditionalComponentsService } from '../../shared/services/additional components/additional-components.service';
import {
  deleteObject,
  getDownloadURL,
  percentage,
  ref,
  Storage,
  uploadBytesResumable,
} from '@angular/fire/storage';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-additional-components',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './additional-components.component.html',
  styleUrl: './additional-components.component.scss',
})
export class AdditionalComponentsComponent {
  public adminAdditionalComponents: Array<IAdditionalComponensResponse> = [];
  public isOpen = false;
  public isModal = false;
  public additionalForm!: FormGroup;
  private additionalComponentsId!: number | string;
  public uploadPercent!: number;
  public isUploaded = false;
  public editStatus = false;
  public isDelete = true;
  constructor(
    private additionalService: AdditionalComponentsService,
    private fb: FormBuilder,
    private storage: Storage
  ) {}

  ngOnInit(): void {
    this.initAdditionalForm();
    this.loadAdditionalComponents();
  }
  addAdditional(): void {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.isModal = true;
    } else {
      this.isModal = false;
    }
  }
  initAdditionalForm(): void {
    this.additionalForm = this.fb.group({
      name: [null, Validators.required],
      price: [null, Validators.required],
      weight: [null, Validators.required],
      imagePath: ['', Validators.required],
    });
  }
  loadAdditionalComponents(): void {
    this.additionalService.getAllFirebase().subscribe((data) => {
      this.adminAdditionalComponents = data as IAdditionalComponensResponse[];
    });
  }

  editAdditionalComponents(additional: IAdditionalComponensResponse): void {
    this.additionalForm.patchValue({
      name: additional.name,
      price: additional.price,
      weight: additional.weight,
      imagePath: additional.imagePath,
    });
    this.additionalComponentsId = additional.id;
    this.editStatus = true;
    this.isModal = true;
    this.isUploaded = true;
    this.uploadPercent = 0;
  }

  saveAdditionalComponents(): void {
    if (this.editStatus) {
      this.additionalService
        .updateFirebase(
          this.additionalForm.value,
          this.additionalComponentsId as string
        )
        .then(() => {
          this.loadAdditionalComponents();
        });
    } else {
      this.additionalService
        .createFirebase(this.additionalForm.value)
        .then(() => {
          this.loadAdditionalComponents();
        });
    }
    this.additionalForm.reset();
    this.editStatus = false;
    this.isUploaded = false;
    this.uploadPercent = 0;
  }
  deleteAdditionalComponents(): void {
    this.isDelete = true;
  }
  deleteModalAdditionalComponents(
    additional: IAdditionalComponensResponse
  ): void {
    if (this.isDelete) {
      this.additionalService
        .deleteFirebase(additional.id as string)
        .then(() => {
          this.loadAdditionalComponents();
        });
    }
  }
  upload(event: any): void {
    const file = event.target.files[0];
    this.uploadFile('images', file.name, file)
      .then((data) => {
        this.additionalForm.patchValue({
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
      this.additionalForm.patchValue({
        imagePath: null,
      });
    });
  }

  valueByControl(control: string): string {
    return this.additionalForm.get(control)?.value;
  }
}
