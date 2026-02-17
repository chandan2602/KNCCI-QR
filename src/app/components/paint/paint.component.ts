import { Component, ElementRef, Input, OnInit } from '@angular/core';
import {  PaintService} from "../../services/paint.service";
import { SocketioService } from "../../services/socketio.service";
// import * as io from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { io } from 'socket.io-client';
@Component({
  selector: 'app-paint',
  templateUrl: './paint.component.html',
  styleUrls: ['./paint.component.css']
})
export class PaintComponent implements OnInit {

  socket;
  @Input() color: string;
  @Input() paintSvc:PaintService
  @Input() id:number;
  //  paintSvc=  new PaintService();
  constructor( private elRef: ElementRef, private socketService: SocketioService) { }

  ngOnInit() {

  
    this.paintSvc.initialize(this.elRef.nativeElement);
   this.paintSvc.index=this.id;

  }
  ngAfterViewInit() {

  }

  ngOnChanges() {
    // this.startPainting();
  }

  private startPainting() {
    const { nativeElement } = this.elRef;
    const canvas = nativeElement.querySelector('canvas') as HTMLCanvasElement

    this.socket = io(environment.SOCKET_ENDPOINT);

    //receving messages
    this.socket.on('my broadcast', (data: string) => {
      let arr = data.split('|');

      const prevX = arr[0];
      const prevY = arr[1];
      const clientX = arr[2];
      const clientY = arr[3];
      const mouseEvent = arr[4];
      const color = this.color;

      this.paintSvc.paint({ prevX, prevY, clientX, clientY, mouseEvent, color });

    });

  }


  erasePaint() {
    this.paintSvc.erasePaint();
  }

 

}
