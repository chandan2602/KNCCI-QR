import { Component, Input, OnInit } from '@angular/core';
import { PaintService } from 'src/app/services/paint.service';
import { SocketioService } from 'src/app/services/socketio.service';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.css']
})
export class PageComponent implements OnInit {
  public penColor: string;
  public erase: boolean = false;
  public paintSvc: PaintService=new PaintService();
  @Input() index:number;
  
  constructor(public socketioService:SocketioService) {
    this.socketioService.ipad.push(this)
   }

  ngOnInit() {
    // this.paintSvc.index=this.index;
    this.penColor = '#000000';
  }

  public setColor(type: string, color: string) {
    switch (type) {
      case 'penColor':
        this.penColor = color;
        break;
      default:
        break;
    }
  }

  public eraseClick() {
    this.paintSvc.erasePaint();
  }

  public undoClick() {
    this.paintSvc.undoLast();
  }

  public redoClick() {
    this.paintSvc.redoLast();
  }

  public clearClick() {
    this.paintSvc.clear();
  }

  public downloadPDF() {
    this.paintSvc.downloadPDF();
  }


}
