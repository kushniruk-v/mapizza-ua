import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { IActionResponse } from '../../shared/interfaces/action/action-interface';
import { ActionService } from '../../shared/services/action/action.service';
import {
  deleteObject,
  getDownloadURL,
  percentage,
  ref,
  Storage,
  uploadBytesResumable,
} from '@angular/fire/storage';

@Component({
  selector: 'app-admin-actions',
  templateUrl: './admin-actions.component.html',
  styleUrls: ['./admin-actions.component.scss'],
})
export class AdminActionsComponent {
  public adminActions: Array<IActionResponse> = [];
  public isOpen = false;
  public isModal = false;
  public actionForm!: FormGroup;
  private currentActionId!: number | string;
  public uploadPercent!: number;
  public uploadPercentAdd!: number;
  public isUploaded = false;
  public isUploadedAdd = false;
  public editStatus = false;
  public isDelete = true;
  constructor(
    private actionService: ActionService,
    private fb: FormBuilder,
    private storage: Storage
  ) {}
  ngOnInit(): void {
    this.initActionForm();
    this.loadActions();
  }

  addAction(): void {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.isModal = true;
    } else {
      this.isModal = false;
    }
  }
  initActionForm(): void {
    this.actionForm = this.fb.group({
      name: [null, Validators.required],
      title: [null, Validators.required],
      description: [null, Validators.required],
      imagePath: ['', Validators.required],
      newFormAction: new FormArray([]),
    });
  }
  get addNewsArray(): FormArray {
    return this.actionForm.get('newFormAction') as FormArray;
  }
  addPassenger(): void {
    this.addNewsArray.push(
      this.fb.group({
        additionalImage: null,
        additionalList: [''],
      })
    );
    this.isUploadedAdd = false;
    this.uploadPercentAdd = 0;
    this.actionForm.updateValueAndValidity();
  }
  deleteAdditionalNews(index: number): void {
    this.addNewsArray.removeAt(index);
  }
  loadActions(): void {
    this.actionService.getAllFirebase().subscribe((data) => {
      this.adminActions = data as IActionResponse[];
    });
  }
  editAction(action: IActionResponse): void {
    this.actionForm.patchValue({
      name: action.name,
      title: action.title,
      description: action.description,
      imagePath: action.imagePath,
    });
    const actionArray: FormGroup[] = action.newFormAction.map(
      (newFormAction) => {
        return this.fb.group({
          additionalImage: newFormAction.additionalImage,
          additionalList: newFormAction.additionalList,
        });
      }
    );
    this.actionForm.setControl('newFormAction', this.fb.array(actionArray));
    this.currentActionId = action.id;
    this.editStatus = true;
    this.isModal = true;
    this.isUploaded = true;
    this.isUploadedAdd = true;
    this.uploadPercentAdd = 0;
    this.uploadPercent = 0;
  }

  saveAction(): void {
    if (this.editStatus) {
      this.actionService
        .updateFirebase(this.actionForm.value, this.currentActionId as string)
        .then(() => {
          this.loadActions();
        });
      this.isModal = false;
    } else {
      this.actionService.createFirebase(this.actionForm.value).then(() => {
        this.loadActions();
      });
    }
    this.actionForm.reset();
    this.editStatus = false;
    this.isUploaded = false;
    this.isUploadedAdd = false;
    this.uploadPercent = 0;
    this.uploadPercentAdd = 0;
  }
  deleteAction(): void {
    this.isDelete = true;
  }
  deleteModalAction(action: IActionResponse): void {
    if (this.isDelete) {
      this.actionService.deleteFirebase(action.id as string).then(() => {
        this.loadActions();
      });
    }
  }
  upload(event: any): void {
    const file = event.target.files[0];
    this.uploadFile('images', file.name, file)
      .then((data) => {
        this.actionForm.patchValue({
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
      this.actionForm.patchValue({
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
          const addNewsArray = this.actionForm.get(
            'newFormAction'
          ) as FormArray;
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
    return this.actionForm.get(control)?.value;
  }
  valueByControlAdd(control: string, index: number): string {
    return this.addNewsArray.at(index).get(control)?.value;
  }
}
