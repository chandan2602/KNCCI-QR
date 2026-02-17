import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { EditUserRegistrationComponent } from 'src/app/pages/edit-user-registration/edit-user-registration.component';
import { FileuploadService } from 'src/app/services/fileupload.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-id-proof',
  templateUrl: './id-proof.component.html',
  styleUrls: ['./id-proof.component.css']
})
export class IdProofComponent implements OnInit {
  myform: UntypedFormGroup;
  @Input() parent: EditUserRegistrationComponent;
  @Input() editData: any = {};
  file: File;
  fileName: string = null;
  fileName1: string = null;
  changed: boolean = false;
  aadhar: any;
  pannumber: any;
  RoleId = '';
  constructor(private fb: UntypedFormBuilder, private fileuploadService: FileuploadService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.myform = this.fb.group({
      AADHAR_NUMBER: ['', Validators.required],
      PAN_NUMBER: ['', Validators.required],
      UPLOAD_AADHAR_NUMBER: [''],
      UPLOAD_PAN_NUMBER: [''],
    })
    this.parent.childs['IdProof'] = this
    this.RoleId = sessionStorage.RoleId;
  }

  changeFile(event: any) {
    if (event.target.files.length > 0) {
      let file: File = event.target.files[0];
      let name = file.name;
      let filetype = name.split('.').pop();
      let types: Array<any> = ['png', 'jpg', 'PNG', 'jpeg', 'JPEG'];
      let check = types.includes(filetype);
      if (check) {
        this.file = file;
        this.upload();
      }
      else {
        this.toastr.warning('Please upload png, jpg, PNG, jpeg, JPEG formats only.');
        event.target.value = '';
      }
    }
  }

  upload() {
    const formData = new FormData();
    formData.append('file', this.file);
    formData.append('DIRECTORY_NAME', 'Attachments/AADHAR_NUMBER');
    this.fileuploadService.upload(formData, 'Courses/Upload_File').subscribe((res: any) => {
      try {
        this.fileName = res.path;
        if (this.fileName) {
          this.myform.controls['UPLOAD_AADHAR_NUMBER'].setValue(this.fileName)


        }
      } catch (e) { console.log(e); }

    }, err => { })
  }

  changeFile1(event: any) {
    if (event.target.files.length > 0) {
      let file: File = event.target.files[0];
      let name = file.name;
      let filetype = name.split('.').pop();
      let types: Array<any> = ['png', 'jpg', 'PNG', 'jpeg', 'JPEG'];
      let check = types.includes(filetype);
      if (check) {
        this.file = file;
        this.upload1();
      }
      else {
        this.toastr.warning('Please upload png, jpg, PNG, jpeg, JPEG formats only.');
        event.target.value = '';
      }
    }
  }

  upload1() {
    const formData = new FormData();
    formData.append('file', this.file);
    formData.append('DIRECTORY_NAME', 'Attachments/PAN_NUMBER');
    this.fileuploadService.upload(formData, 'Courses/Upload_File').subscribe((res: any) => {
      try {
        this.fileName1 = res.path;
        if (this.fileName1) {
          this.myform.controls['UPLOAD_PAN_NUMBER'].setValue(this.fileName1)


        }
      } catch (e) { console.log(e); }

    }, err => { })
  }

  ngOnChanges() {
    if (this.editData && Object.keys(this.editData).length && !this.changed) {
      this.changed = true;
      setTimeout(() => { this.dataTransform() }, 200);
    }
  }

  dataTransform() {
    let data: Array<any> = this.editData;
    //this.myform.markAllAsTouched;

    if (data.length > 0) {
      const IdProof = data[0];
      this.myform.patchValue({
        AADHAR_NUMBER: IdProof.AADHAR_NUMBER,
        PAN_NUMBER: IdProof.PAN_NUMBER,
        UPLOAD_AADHAR_NUMBER: IdProof.UPLOAD_AADHAR_NUMBER,
        UPLOAD_PAN_NUMBER: IdProof.UPLOAD_PAN_NUMBER,
      });
      this.fileName = IdProof.UPLOAD_AADHAR_NUMBER;
      this.fileName1 = IdProof.UPLOAD_PAN_NUMBER;
    }
  }
  aadharChange(event) {
    let val = event.target?.value;
    let exp = /^\d{12}$/
    if (new RegExp(exp).test(val)) {
      this.aadhar = val;
    } else {
      this.aadhar = null;
      this.toastr.warning('Please Enter Valid Aadhar Number');

    }
  }
  panChange(event: any) {
    let val = event.target.value;
    let exp = /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/;
    if (new RegExp(exp).test(val)) {
      this.pannumber = val;
    } else {
      this.pannumber = null;
      this.toastr.warning('Please Enter Valid Pan Number');

    }
  }
  save() {
    this.parent.save();
  }
  close() {
    this.parent.close();
  }

  getName(folderName: string, fileName: any) {
    return fileName?.substr(fileName?.indexOf(`${folderName}_`)).replace(`${folderName}_`, '').split(/_(.*)/s)[1];
  }


}