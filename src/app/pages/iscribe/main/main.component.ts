import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PaintService } from 'src/app/services/paint.service';
import { SocketioService } from 'src/app/services/socketio.service';
import { PageComponent } from '../page/page.component';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

 
  public penColor: string;
  public erase: boolean = false;
  public paintSvc: PaintService = new PaintService();
  public ipad: Array<PageComponent> = [];
  public index = 0;
  pages: Array<number> = [...Array(3).keys()];
  get isPrev(): boolean {
    if (this.index) return true
    return false
  }
  get isNext(): boolean {
    if (this.pages.length - 1 == this.index) return false
    return true;
  }
  constructor(public socketioService: SocketioService,active:ActivatedRoute) {
    socketioService.paintSvc = this.paintSvc;
    socketioService.ipad=[];
    active.queryParams.subscribe((res)=>{
      if(Object.keys(res).length>0){
        socketioService.ASSIGNMENT_ID=res.id;
        socketioService.courseId=res.cId;
      }
    })
  }

 
  ngOnInit() {
    this.penColor = '#000000';
    this.socketioService.setupSocketConnection()
  
  }

  next(){
    window.scroll(0,0);
    this.index++;
    this.socketioService.currentIndex=this.index;
  }
  prev(){
    window.scroll(0,0);
    this.index--;
    this.socketioService.currentIndex=this.index;
  }
  public downloadPDF() {
    // this.paintSvc.downloadPDF();
    let f=(msg)=>{
      alert(msg)
    }
    this.socketioService.download(f);
  }
}
