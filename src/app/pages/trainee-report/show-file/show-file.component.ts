import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-show-file',
  templateUrl: './show-file.component.html',
  styleUrls: ['./show-file.component.css']
})
export class ShowFileComponent implements OnInit {

  @Output() CloseModelEvent: EventEmitter<boolean> = new EventEmitter();
  @Input() FileName: string = "";
  urlSafe: SafeResourceUrl;
  constructor(public sanitizer: DomSanitizer) {
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.FileName);
      document.getElementById('btnOpenModel').click();
    }, 100);
  }

  closeModel() {
    console.log("Close model");
    this.CloseModelEvent.emit(false);
  }

}
