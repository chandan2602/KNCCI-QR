import { Component, Input, OnInit } from '@angular/core';
import { EditUserRegistrationComponent } from 'src/app/pages/edit-user-registration/edit-user-registration.component';
import { FileuploadService } from 'src/app/services/fileupload.service';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service'
import { BaseComponent } from 'src/app/pages/base.component';
@Component({
  selector: 'app-about-me',
  templateUrl: './about-me.component.html',
  styleUrls: ['./about-me.component.css']
})
export class AboutMeComponent extends BaseComponent implements OnInit {
  @Input() parent: EditUserRegistrationComponent;
  @Input() editData: any = {};
  changed: boolean = false;
  file: File
  fileName: any;
  fileName1: string;
  signatureImagePath: string = '';
  imageName: string;
  personalData: any = {};
  // userId: number;
  constructor(private FileuploadService: FileuploadService, CommonService: CommonService, toastr: ToastrService) {
    super(CommonService, toastr);
  }

  ngOnInit(): void {
    this.parent.childs['aboutMe'] = this
  }

  ngOnChanges() {
    if (Object.keys(this.editData).length && !this.changed) {
      this.changed = true;
      this.personalData = this.editData['Personal'].length && this.editData['Personal'][0];
      this.fileName = this.editData['UserImage']?.userfrimages || '';
      this.fileName1 = this.editData['UserImage']?.SIGNATURE;
      this.signatureImagePath = this.editData['UserImage']?.SIGNATURE;
      this.userId = this.personalData['UserId'];
    }
  }

  changeFile(event) {
    if (event.target.files.length > 0) {
      let file: File = event.target.files[0];
      let name = file.name;
      let filetype = name.split('.').pop();
      let types: Array<any> = ['png', 'jpg', 'PNG', 'jpeg', 'gif', "JPEG"];
      let check = types.includes(filetype);
      if (check) {
        this.file = file;
      }
      else {
        // alert(' Please upload pdf and doc file formats only.')
        this.parent.toastr.warning('Please upload image file formats only.')
        event.target.value = ''
      }
    }
  }

  upload() {

    if (!this.file) return;
    // let base64String: any;
    // var reader = new FileReader();
    // console.log("next");
    // let self = this;
    // reader.onload = function () {
    //   base64String = reader.result;
    //   self.fileName = base64String;

    //   self.saveImageFile();
    // }
    // reader.readAsDataURL(this.file);
    // this.saveImageFile();
    this.uploadImage(this.file);
  }

  saveImageFile() {
    let payLoad = {
      "tenantcode": sessionStorage.getItem('TenantCode'),
      "userfrimages": this.fileName,
      "USERID": this.userId,
    };
    console.log(payLoad)
    if (!payLoad.userfrimages) return;
    this.CommonService.postCall('Registration/InsertUserImage', payLoad).subscribe((res: any) => {
      this.toastr.success("Image Saved Successfully");
    }, err => {
      this.toastr.error(err.error ? err.error : 'Image Not Updated')
    })
  }

  getImage() {
    if (!this.fileName) return '';
    return this.setServerPath(this.fileName);
  }

  CaptureVideo() {

    const constraints = { video: true, };
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(this.handleSuccess)
      .catch(this.handleError);
  }

  handleSuccess(stream) {
    const video = document.querySelector("video");
    video.style.display = 'initial';
    // screenshotButton.disabled = false;
    video.srcObject = stream;
    console.log('handleSuccess', stream)
    // setTimeout(() => screenshotButton.onclick(), 100);

  }

  handleError(error) {
    console.error("Error: ", error);
  }

  screenshotButton() {
    const video = document.querySelector("video");
    const canvas = document.createElement("canvas");
    const img: any = document.getElementById('screenshot-img');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    // Other browsers will fall back to image/png
    const imageData = canvas.toDataURL();
    img.src = imageData;
    // img.src = canvas.toDataURL("image/webp");
    // this.fileName = imageData;
    this.fileName = this.generateFile(imageData, `${this.userId}.png`);
    console.log(img.src);
    this.uploadImage(this.fileName);

    setTimeout(() => {
      const mediaStream: any = video.srcObject;

      // Through the MediaStream, you can get the MediaStreamTracks with getTracks():
      const tracks = mediaStream.getTracks();

      // Tracks are returned as an array, so if you know you only have one, you can stop it with: 
      tracks[0].stop();

      // Or stop all like so:
      tracks.forEach(track => track.stop());
      video.src = '';
      video.style.display = 'none';
    }, 100)
  }

  getSignatureOld() {
    if (!this.fileName1) return '';
    if (this.fileName1.includes('data:image')) {
      return this.fileName1;
    } else {
      return 'data:image/png;base64,' + this.fileName1;
    }
  }
  uploadSignatureOld() {

    if (!this.file) return;
    let base64String: any;
    var reader = new FileReader();
    console.log("next");
    let self = this;
    reader.onload = function () {
      base64String = reader.result;
      self.fileName1 = base64String;
      //self.saveSignature(base64String);
    }
    reader.readAsDataURL(this.file);
  }
  changeFile1(event) {
    if (event.target.files.length > 0) {
      let file: File = event.target.files[0];
      let name = file.name;
      let filetype = name.split('.').pop();
      let types: Array<any> = ['png', 'jpg', 'PNG', 'jpeg', "JPEG"];
      let check = types.includes(filetype);
      if (check) {
        this.file = file;
      }
      else {
        this.parent.toastr.warning('Please upload digital signature only.')
        event.target.value = ''
      }
    }
  }

  // saveSignature(signature: string = '') {
  //   // let payLoad = {
  //   //   "SIGNATURE": signature,
  //   //   "USERID": this.userId,
  //   // }
  //   let payLoad = {
  //     "SIGNATURE": this.signatureImagePath,
  //     "USERID": this.userId,
  //   }
  //   console.log(payLoad)
  //   this.CommonService.postCall('Registration/InsertOrUpdateUserSignature', payLoad).subscribe((res: any) => {
  //     this.toastr.success("Signature Saved Succuessfully");
  //   }, err => {
  //     this.toastr.error(err.error ? err.error : 'Signature Not Updated')
  //   })
  // }

  getSignature(): string {
    return `${this.CommonService.fileUrl}${this.signatureImagePath}`;
  }

  uploadSignature(path: string = 'Attachments/Signature') {
    const formData = new FormData();
    formData.append('file', this.file);
    formData.append('DIRECTORY_NAME', path);
    this.FileuploadService.upload(formData, 'Courses/Upload_File').subscribe((res: any) => {
      try {
        this.signatureImagePath = res.path;

      } catch (e) { console.log(e); }

    }, err => { })
  }


  uploadImage(ProfileImage: any, path: string = 'Attachments/ProfileImage') {
    const formData = new FormData();
    formData.append('file', ProfileImage);
    formData.append('DIRECTORY_NAME', path);
    this.FileuploadService.upload(formData, 'Courses/Upload_File').subscribe((res: any) => {
      try {
        this.fileName = res.path;
        this.saveImageFile();

      } catch (e) { console.log(e); }

    }, err => { })
  }
  success(){
  this.parent.save(); 
  }
  close1(){

  }

}