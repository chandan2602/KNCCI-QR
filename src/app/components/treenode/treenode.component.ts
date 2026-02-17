// import { stringify } from '@angular/compiler/src/util';
import { Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Guid } from 'guid-typescript';
import { trim } from 'jquery';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';
import { FileuploadService } from 'src/app/services/fileupload.service';
@Component({
  selector: 'app-treenode',
  templateUrl: './treenode.component.html',
  styleUrls: ['./treenode.component.css']
})
export class TreenodeComponent implements OnInit {
  @Input() data: any;
  public isEnable: boolean = false;
  public isAction: boolean = false;
  public name!: string;
  public isAdd: boolean = false;
  public editName: string = '';
  isEdit: boolean = false;
  id: any;
  @ViewChild('toggleButton') toggleButton!: ElementRef;
  file: File;

  constructor(private renderer: Renderer2, private commonservice: CommonService, private FileuploadService: FileuploadService, private toastr: ToastrService) {
    // this.id ="md"+stringify( Guid.create());

    this.renderer.listen('window', 'click', (e: Event) => {
      //  this.isAction=false;

    })
  }

  get isEnabled(): boolean {
    if (this.data.Value && parseInt(this.data.Value) > -1) {
      return true;
    }
    return false
  }
  ngOnInit(): void {
  }
  activeSpinner() {
    this.commonservice.activateSpinner();
  }

  deactivateSpinner() {
    this.commonservice.deactivateSpinner()
  }
  toggeleClick() {
    this.isEnable = !this.isEnable;
    // if(!this.isEnable){
    this.isAdd = false;
    // }
    this.getFiles();
  }
  rightClick() {
    this.isAction = true;

    return false;
  }
  mouseout() {
    // this.isAction=false
  }
  add(event: Event, check: boolean) {
    event.preventDefault();
    this.isAction = false
    this.isAdd = true;
    if (check) {
      if (!this.isEnabled) return this.isAdd = false;
      this.isEdit = true;
      this.editName = this.data.Text;
    } else {
      this.isEdit = false;
    }
    // event.stopPropagation();
  }

  addNode() {
    if (!this.name || !trim(this.name)) return
    this.activeSpinner();
    let payload = {
      "CREATEDBY": sessionStorage.UserId,
      "TNT_CODE": sessionStorage.TenantCode,
      "FOLDERNAME": this.name,
      "PARENTID": parseInt(this.data.Value)
    }
    this.commonservice.postCall('FolderManagement/create', payload).subscribe((res: any) => {
      this.deactivateSpinner();
      let id = res[0]['FOLDERID'];
      c(id);
    }, e => {
      this.deactivateSpinner();
    })
    let c = (id) => {
      let obj = {
        Text: this.name,
        Value: id
      }
      if (!this.data.Childnode) {
        this.data.Childnode = []
      }
      this.data.Childnode.push(obj);
      this.name = ''
      this.isAdd = false;
    }

  }
  mouseleave() {
    this.isAction = false;
  }
  Update() {
    this.activeSpinner();
    let payload = {

      "FOLDERNAME": this.editName,
      FOLDERID: parseInt(this.data.Value)
    }
    this.commonservice.postCall('FolderManagement/Update', payload).subscribe((res: any) => {
      this.deactivateSpinner();

      c();
    }, e => {
      this.deactivateSpinner();
    })
    let c = () => {
      this.data.Text = this.editName;
      this.isAdd = false;
    }
  }
  addfile() {
    if (!this.isEnabled) return
    this.isAction = false;
    document.getElementById('true' + this.id)?.click();

  }


  getId(a?) {
    if (a) {
      return a + this.id
    }
    return "#" + this.id
  }
  change(event) {
    if (event.target.files.length > 0) {
      let file: File = event.target.files[0];
      let name = file.name;
      let filetype = name.split('.').pop()
      let types: Array<any> = ['doc', 'docx', 'pdf']
      let check = types.includes(filetype);
      // if (check) {
      this.file = file;
      // }
      // else {
      // alert(' Please upload pdf and doc file formats only.')
      // this.toastr.warning(' Please upload pdf and doc file formats only')
      // event.target.value = ''
      // }
    }
  }
  save() {
    const formData = new FormData();
    formData.append('file', this.file);
    formData.append('FOLDERID', this.data.Value);

    this.FileuploadService.upload(formData, 'FolderManagement/Fileupload').subscribe((res: any) => {
      if (res && res.message == 'Information Saved Successfully') {
        this.toastr.success(res.message);
        document.getElementById(this.getCloseId()).click();
        this.getFiles();
        this.file = null;
      } else {

      }

    }, err => { })
  }
  getCloseId() {
    return 'md_close' + this.id;
  }
  getFiles() {
    let value = parseInt(this.data.Value)
    if (value > -1) {
      this.commonservice.postCall('FolderManagement/GetFiles', { FOLDERID: value }).subscribe((res: any) => {
        this.commonservice.fileObs.next(res || []);
      })
    }
    else {
      this.commonservice.fileObs.next([]);
    }
  }
}
