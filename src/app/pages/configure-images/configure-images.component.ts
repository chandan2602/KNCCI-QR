import { Component, OnInit } from '@angular/core';
import { FileuploadService } from '../../services/fileupload.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';
import { CommonService } from '../../../app/services/common.service';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { BaseComponent } from '../base.component';

@Component({
  selector: 'app-configure-images',
  templateUrl: './configure-images.component.html',
  styleUrls: ['./configure-images.component.css']
})
export class ConfigureImagesComponent extends BaseComponent implements OnInit {

  fileList: Array<any> = [];

  fileName: any = null;
  fileName1: any = null;
  fileName2: any = null;
  fileName3: any = null;

  file: any = File;
  imageURL: any;
  imageURL1: any;
  imageURL2: any;
  imageURL3: any;
  serverPath: string;
  myForm: any = UntypedFormGroup;
  TenantCode = sessionStorage.TenantCode;
  submitted = false;

  constructor(private fileuploadService: FileuploadService, toastr: ToastrService, CommonService: CommonService, private fb: UntypedFormBuilder,) {
    super(CommonService, toastr);
    this.serverPath = environment.fileUrl;
  }

  ngOnInit(): void {

    this.myForm = this.fb.group({
      config_id: [0],
      tnt_code: [+sessionStorage.TenantCode],
      favicon_path: [''],
      homePageImage_path: [''],
      landingPageImage_path: [''],
      cerficateImage_path: [''],
      created_by: [+sessionStorage.UserId],
      modified_by: [+sessionStorage.UserId],

    });
    this.getImage();

  }

  changeFile(event: any) {
    if (event.target.files.length > 0) {
      let file: File = event.target.files[0];
      let name = file.name;
      let filetype = name.split('.').pop();
      let types: Array<any> = ['ico'];
      let check = types.includes(filetype);
      if (check) {
        this.file = file;
        var reader = new FileReader();
        reader.readAsDataURL(file);

        // reader.onload = (_event) => {
        //   this.imageURL = reader.result;
        // }
        this.uploadImage();
        return;
      }
      else
        this.toastr.warning(' Please upload ico formats only');
      event.target.value = '';
    }
  }

  uploadImage() {
    const formData = new FormData();
    formData.append('file', this.file);
    formData.append('DIRECTORY_NAME', 'Attachments/Fevicon');
    this.fileuploadService.upload(formData, 'Courses/Upload_File').subscribe((res: any) => {
      try {
        if (res.path) {
          this.fileName = res.path;
          this.imageURL = `${this.serverPath}${this.fileName}`;
        }

      } catch (e) {
      }

    }, err => { })

  }

  changeFile1(event: any) {
    if (event.target.files.length > 0) {
      let file: File = event.target.files[0];
      let name = file.name;
      let filetype = name.split('.').pop();
      let types: Array<any> = ['png', 'jpg', 'PNG', 'jpeg', 'gif', 'JPEG', 'JPG', 'image'];
      let check = types.includes(filetype);
      if (check) {
        this.file = file;
        var reader = new FileReader();
        reader.readAsDataURL(file);

        // reader.onload = (_event) => {
        //   this.imageURL1 = reader.result;
        // }
        this.uploadImage1();
        return;
      }
      else
        this.toastr.warning(' Please upload png ,jpg ,PNG ,jpeg ,gif,JPG image formats only');
      event.target.value = '';
    }
  }

  uploadImage1() {
    const formData = new FormData();
    formData.append('file', this.file);
    formData.append('DIRECTORY_NAME', 'Attachments/HomePageImage');
    this.fileuploadService.upload(formData, 'Courses/Upload_File').subscribe((res: any) => {
      try {
        if (res.path) {
          this.fileName1 = res.path;
          this.imageURL1 = `${this.serverPath}${this.fileName1}`;
        }

      } catch (e) {
      }

    }, err => { })

  }

  changeFile2(event: any) {
    if (event.target.files.length > 0) {
      let file: File = event.target.files[0];
      let name = file.name;
      let filetype = name.split('.').pop();
      let types: Array<any> = ['png', 'jpg', 'PNG', 'jpeg', 'gif', 'JPG', 'image'];
      let check = types.includes(filetype);
      if (check) {
        this.file = file;
        var reader = new FileReader();
        reader.readAsDataURL(file);

        // reader.onload = (_event) => {
        //   this.imageURL2 = reader.result;
        // }
        this.uploadImage2();
        return;
      }
      else
        this.toastr.warning(' Please upload png ,jpg ,PNG ,jpeg ,gif, JPG, image formats only');
      event.target.value = '';
    }
  }

  uploadImage2() {
    const formData = new FormData();
    formData.append('file', this.file);
    formData.append('DIRECTORY_NAME', 'Attachments/LandingPageImage');
    this.fileuploadService.upload(formData, 'Courses/Upload_File').subscribe((res: any) => {
      try {
        if (res.path) {
          this.fileName2 = res.path;
          this.imageURL2 = `${this.serverPath}${this.fileName2}`;
        }

      } catch (e) {
      }

    }, err => { })

  }

  changeFile3(event: any) {
    if (event.target.files.length > 0) {
      let file: File = event.target.files[0];
      let name = file.name;
      let filetype = name.split('.').pop();
      let types: Array<any> = ['png', 'jpg', 'PNG', 'jpeg', 'gif', 'JPEG', 'JPG', 'image'];
      let check = types.includes(filetype);
      if (check) {
        this.file = file;
        var reader = new FileReader();
        reader.readAsDataURL(file);

        // reader.onload = (_event) => {
        //   this.imageURL3 = reader.result;
        // }
        this.uploadImage3();
        return;
      }
      else
        this.toastr.warning(' Please upload png ,jpg ,PNG ,jpeg ,gif, JPEG,JPG , image formats only');
      event.target.value = '';
    }
  }

  uploadImage3() {
    const formData = new FormData();
    formData.append('file', this.file);
    formData.append('DIRECTORY_NAME', 'Attachments/CerficateImage');
    this.fileuploadService.upload(formData, 'Courses/Upload_File').subscribe((res: any) => {
      try {
        if (res.path) {
          this.fileName3 = res.path;
          this.imageURL3 = `${this.serverPath}${this.fileName3}`;
        }

      } catch (e) {
      }

    }, err => { })

  }





  getName(folderName: string, fileName: any) {
    return fileName?.substr(fileName?.indexOf(`${folderName}_`)).replace(`${folderName}_`, '').split(/_(.*)/s)[1];
  }

  get f() { return this.myForm.controls; }

  onSubmit(form: UntypedFormGroup) {
    this.submitted = true;
    this.getFormValidationErrors(this.myForm);
    let payLoad = this.myForm.getRawValue();

    if (form.invalid) {
      this.toastr.warning('Please Enter All Mandatory Fields');
      return;
    }

    payLoad.favicon_path = this.fileName;
    payLoad.homePageImage_path = this.fileName1;
    payLoad.landingPageImage_path = this.fileName2;
    payLoad.cerficateImage_path = this.fileName3;

    payLoad = {
      ...payLoad
    }

    this.CommonService.postCall('account/SaveOrUpdateConfiguration', payLoad).subscribe((res: any) => {

      this.toastr.success('Configuration save successfully.');

    })
  }


  getImage() {
    this.CommonService.getCall('Account/GetConfiguration/', `${this.TenantCode}`).subscribe((res: any) => {
      const result: any = res.data[0];
      this.myForm.patchValue({ config_id: result.config_id });
      this.fileName = result.favicon_path;
      this.fileName1 = result.homePageImage_path;
      this.fileName2 = result.landingPageImage_path;
      this.fileName3 = result.cerficateImage_path;

      this.imageURL = `${this.serverPath}${result.favicon_path}`;
      this.imageURL1 = `${this.serverPath}${result.homePageImage_path}`;
      this.imageURL2 = `${this.serverPath}${result.landingPageImage_path}`;
      this.imageURL3 = `${this.serverPath}${result.cerficateImage_path}`;


    });

  }




}

interface IFileType {
  name: string;
  fileName: string;
  imageURL: string;
}
