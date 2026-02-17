import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonService } from '../../services/common.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.component.html',
  styleUrls: ['./folder.component.css']
})
export class FolderComponent implements OnInit {

  fileUrl: string;
  treeArray: Array<{ name: string, id: string, childs: Array<any>, parent: string }> = [
    {
      name: 'satya',
      id: 'abc',
      childs: [
        {
          name: 'test1',
          id: 'abc1',
          childs: []
        },
        {
          name: 'Test2',
          id: 'abc1',
          childs: []
        }
      ],
      parent: ''
    },
    {
      name: 'Sheshu',
      id: 'abc1',
      childs: [],
      parent: ''
    },
    {
      name: 'Srikanth',
      id: 'abc1',
      childs: [],
      parent: ''
    }
  ]
  personalTree: Array<any> = [];
  sharedTree: Array<any> = [];
  files: Array<any> = [];
  public fileCall: boolean = false;
  count: number = 0;
  constructor(private commonservice: CommonService, private http: HttpClient) {
    this.GetData();
  }

  ngOnInit(): void {

    this.commonservice.fileObs.subscribe((res: any) => {
      this.count++
      if (this.count > 1) this.fileCall = true;

      this.files = res;
    })
  }
  activeSpinner() {
    this.commonservice.activateSpinner();
  }

  deactivateSpinner() {
    this.commonservice.deactivateSpinner()
  }
  GetData() {
    this.activeSpinner();
    this.commonservice.postCall('FolderManagement/GetList', { "CREATEDBY": sessionStorage.UserId }).subscribe((res: any) => {
      this.deactivateSpinner();
      let data = {
        Text: 'Personal Folders',
        Value: "-1",
        Childnode: res.personal
      }
      this.personalTree.push(data);
    }, err => {
      this.deactivateSpinner();
      console.log(err)
    })
  }


  ViewFile(item: any) {

    window.open(`${environment.fileUrl}/FolderManagement/Getfilename/${item.FILEID}`, 'name', 'height=250,width=550,toolbar=0,menubar=0,location=0');

  }





  //   console.log(res);
  //   const blob = new Blob([res.body], { type: 'application/json' });
  //   const fileURL = URL.createObjectURL(blob);

  // });
  // this.fileUrl=`http://10.10.10.227:81/api/FolderManagement/Getfilename/${item.FILEID}`;
  //


  // window.open(`${environment.serviceUrl}FolderManagement/Getfilename/${item.FILEID}`, 'name','height=250,width=550,toolbar=0,menubar=0,location=0');
  // this.http.get(`${environment.serviceUrl}FolderManagement/Getfilename/${item.FILEID}`).subscribe(
  //   (res:any) => {
  //     const blob = new Blob([res.body], { type: 'application/pdf' });
  //     const fileURL = URL.createObjectURL(blob);
  //     window.open(fileURL, '_blank');
  //   },
  //   () => { },
  //   () => { }
  // );
  // window.open(url);


  close() { }
}
