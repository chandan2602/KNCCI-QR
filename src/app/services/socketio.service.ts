import { Injectable } from '@angular/core';

import jsPDF from 'jspdf';
import { PaintService } from './paint.service';
// import * as io from 'socket.io-client';
import { PageComponent } from '../pages/iscribe/page/page.component';
import { environment } from 'src/environments/environment';
import { FileuploadService } from './fileupload.service';
import { io } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketioService {

  socket;
  public paintSvc: PaintService
  color: string;
  public ipad: Array<PageComponent> = [];
  public currentIndex: number = 0;
  isLoaded: boolean = false;
  ASSIGNMENT_ID: string ;
  courseId: string ;
  constructor(private FileuploadService: FileuploadService) {
   
  }

  setupSocketConnection() {
    if (this.isLoaded) return
    this.socket = io(environment.SOCKET_ENDPOINT);

    //send message to server
    //this.socket.emit('my message', 'Hello there from Angular client');

    //receving messages
    this.socket.on('my broadcast', (data: string) => {
      const currentPad = this.ipad[this.currentIndex].paintSvc
      let arr = data.split('|');

      const prevX = arr[0];
      const prevY = arr[1];
      const clientX = arr[2];
      const clientY = arr[3];
      const mouseEvent = arr[4];
      const color = this.color;
      //console.log(data);
      //console.log(color);

      // this.paintSvc.paint({ prevX, prevY, clientX, clientY, mouseEvent, color });
      currentPad.paint({ prevX, prevY, clientX, clientY, mouseEvent, color })
    });
    this.isLoaded = true;
  }
  download(callback?:Function) {
    let canvas = document.getElementById('0').children[0] as HTMLCanvasElement;
    let fileWidth = 208;
    let fileHeight = canvas.height * fileWidth / canvas.width;

    // var imgData1 = c1.toDataURL('image/png');
    let PDF = new jsPDF('p', 'mm', 'a4');
    let position = 0;
    this.ipad.map((pad: PageComponent, index) => {
      let canvasElement = document.getElementById(index.toString()).children[0] as HTMLCanvasElement
      var imgData = canvasElement.toDataURL('image/png');
      PDF.addImage(imgData, 'PNG', 0, position, fileWidth, fileHeight)
      if (index < this.ipad.length - 1) {
        PDF.addPage();
      }
    })

    const blob = PDF.output('blob')
     this.upload(blob,callback);
    // PDF.save('exam.pdf')
  }
  upload(blob: Blob,callback?:Function) {
    var formData = new FormData();
    formData.append('file', blob);
    formData.append('AssignmentId',this.ASSIGNMENT_ID);
    formData.append('UserId',sessionStorage.getItem('UserId'));
    formData.append('ClientDocs','ClientDocs');
    formData.append('Course',this.courseId)
    this.FileuploadService.upload(formData,'Assignments/ExamSubmit').subscribe((res: any) => {
      if( res.message =='Information Saved Successfully'){
         if(callback){
           callback(res.message);
         }
        // document.getElementById('md_close').click()
      }else{
        
      }
      
    }, err => {})  }
}
