import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
@Injectable({
  providedIn: 'root'
})
export class PaintService {

  private canvas: HTMLCanvasElement = null
  private ctx: CanvasRenderingContext2D;
  private undo_array = [];
  private undo_index = -1;
  private redo_array = [];
  private redo_index = -1;
  index: number;

  initialize(mountPoint: HTMLElement) {
    this.canvas = mountPoint.querySelector('canvas');
    console.log(mountPoint.offsetWidth, mountPoint.offsetHeight)
    this.ctx = this.canvas.getContext('2d');
    this.ctx.strokeStyle = '#FFCA28';
    this.canvas.width = 600   //mountPoint.offsetWidth;
    this.canvas.height =800// mountPoint.offsetHeight;

  }

  paint({ prevX, prevY, clientX, clientY, mouseEvent, color }) {



    this.ctx.lineJoin = 'round';
    this.ctx.lineCap = 'round';
    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = color;
   

    this.ctx.moveTo(clientX, clientY);
    this.ctx.lineTo(clientX, clientY);
    this.ctx.stroke();


  }

  erasePaint() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.undo_array = [];
    this.undo_index = -1;
  }

  undoLast() {
    console.log('undo index =', this.undo_index);
    if (this.undo_index <= 0) {
      this.erasePaint();
    }
    else {
      this.undo_index -= 1;

      this.redo_array.push(this.undo_array.pop());
      this.redo_index += 1;

      this.ctx.putImageData(this.undo_array[this.undo_index], 0, 0);
    }
  }

  redoLast() {
    console.log('redo index =', this.redo_index);

    if (this.redo_index >= 0) {
      if (this.redo_index != 0) {
        this.redo_index -= 1;

        this.undo_array.push(this.redo_array.pop());
        this.undo_index += 1;

        this.ctx.putImageData(this.redo_array[this.redo_index], 0, 0);
      }
      else if (this.redo_index == 0) {
        this.ctx.putImageData(this.redo_array[this.redo_index], 0, 0);

        this.undo_array.push(this.redo_array[this.redo_index]);
        this.undo_index += 1;

        this.redo_array = [];
        this.redo_index = -1
      }




    }

  }

  clear() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.undo_array = [];
    this.undo_index = -1;
    this.redo_array = [];
    this.redo_index = -1;

  }

  public downloadPDF(): void {
    let DATA = document.getElementById(this.index.toString());
    //let tempEle = document.getElementById('canvas') as HTMLCanvasElement

    html2canvas(DATA).then(canvas => {

      let fileWidth = 208;
      let fileHeight = canvas.height * fileWidth / canvas.width;

      const FILEURI = canvas.toDataURL('image/png')
      let PDF = new jsPDF('p', 'mm', 'a4');
      let position = 0;
      PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight)

      PDF.save('BuoyantWroxs-angular.pdf');
    });
  }

}
