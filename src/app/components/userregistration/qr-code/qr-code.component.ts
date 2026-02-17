import { Component, Input, OnInit } from '@angular/core';
import { EditUserRegistrationComponent } from 'src/app/pages/edit-user-registration/edit-user-registration.component';
@Component({
  selector: 'app-qr-code',
  templateUrl: './qr-code.component.html',
  styleUrls: ['./qr-code.component.css']
})
export class QrCodeComponent implements OnInit {
  @Input() width: any = 330;
  @Input() studentId: number = 0;
  @Input() COURSESHD_ID: number = 0;
  @Input() FullName: string = '';
  @Input() parent: EditUserRegistrationComponent;
  id: string = '';
  RoleId = '';
  constructor() { }

  ngOnInit(): void {
    const base64Str = btoa(`${this.studentId}&FullName=${this.FullName}&COURSESHD_ID=${this.COURSESHD_ID}`);
    this.id = `${window.location.origin}/view-qrcode?id=${base64Str}`;
    this.RoleId = sessionStorage.RoleId;
  }

  save() {
    this.parent.save();
  }

  close() {
  }

}
