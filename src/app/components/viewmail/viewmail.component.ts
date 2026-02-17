import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { MailBoxComponent } from 'src/app/pges/mail-box/mail-box.component';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-viewmail',
  templateUrl: './viewmail.component.html',
  styleUrls: ['./viewmail.component.css']
})
export class ViewmailComponent implements OnInit {
  @Input() parent: MailBoxComponent;
  table: Array<any> = [];
  constructor(private CommonService: CommonService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.getMail();
  }
  getMail() {
    let payload = {
      MAILID: this.parent['selectedMail']['MAILID'],
      MAILTYPE: this.parent['selectedMail']['MAILTYPE']
    }
    this.parent.activeSpinner();
    this.CommonService.postCall('MailBox/ViewSelectedMail', payload).subscribe(
      (res) => {
        this.parent.deactivateSpinner();
        this.table = res;
      }, err => {
        this.parent.deactivateSpinner();
      }
    )
  }
  close(){
    this.parent.closeall()
  }
}
