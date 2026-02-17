import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from 'src/app/pages/base.component';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-mail-box',
  templateUrl: './mail-box.component.html',
  styleUrls: ['./mail-box.component.css']
})
export class MailBoxComponent extends BaseComponent implements OnInit {
  stats: any = {};
  show: boolean = true;
  view: boolean = false;
  compose: boolean = false;
  showGrid: boolean = true;
  MailTypes: any = {
    Inbox: {
      loadUrl: 'MailBox/InboxMails',
      deleteUrl: 'MailBox/MoveToTrashMail',
      readurl: 'MailBox/MarkAsReadMails'
    },
    Sent: {
      loadUrl: 'MailBox/SentMails',
      deleteUrl: 'MailBox/MoveToTrashMail',
      readurl: 'MailBox/MarkAsReadMails',
    },
    Trash: {
      loadUrl: 'MailBox/TrashMails',
      deleteUrl: 'MailBox/DeleteMails',
      readurl: 'MailBox/MarkAsReadMails'
    }
  }
  read: boolean = null;
  selectedMail: any = {
    "MAILID": 90860,
    "MAILTYPE": "SentMail"
  }
  type: string;
  action: string = 'Inbox';
  isshow: boolean = true;
  constructor(CommonService: CommonService, toastr: ToastrService) {
    super(CommonService, toastr);
    this.loadInbox('MailBox/InboxMails');
    this.getStats();
  }

  ngOnInit(): void {
    
  }
  loadInbox(url, action: string = 'Inbox') {
    this.action = action;
    if (action == 'Sent') {
      this.showGrid = false
    } else {
      this.showGrid = true;
    }
    let c = () => {
      // this.renderDataTable();
    };
    let payLoad = {
      USERID: this.userId,
      NOOFMAILS: 2000
    }
    this.getGridData(url, payLoad, c);
  }

  getStats() {
    this.activeSpinner();
    this.CommonService.getCall('MailBox/GetMailsStatistics/' + this.userId).subscribe(
      (res: any) => {
        this.deactivateSpinner();
        if (res.length) {
          this.stats = res[0];
        }
      }, err => {
        this.deactivateSpinner();
      }
    )
  }
  composMail() {
    this.show = false;
    this.compose = true
    this.view = false;
    this.selectedMail = {};
    this.type = "New"
  }
  closeall() {
    this.show = true;
    this.compose = false;
    this.view = false;
    this.type = "New"
  }
  viewMail(item) {
    this.show = false;
    this.compose = false
    this.view = true;
    this.selectedMail = item;
  }
  CheckBox(event: Event) {
    //  event.preventDefault();//DeleteMail
  }
  check() { alert('k') }

  get tableData(): Array<any> {
    if (this.table.length) {
      if (this.read) {
        return this.table.filter(x => x.ISREAD == true)
      }
      if (this.read == false) {
        return this.table.filter(x => x.ISREAD == false)
      }
      return this.table;
    } else {
      return []
    }

  }
  checkAll() {
    let checked = this.table.filter(x => x.checked);
    let check = true;
    if (checked.length == this.table.length) {
      check = false
    }

    this.table.map(item => { item.checked = check; })

  }
  checkRead() {
    this.unchechAll();
    this.table.map(item => {
      if (item.ISREAD) {
        item.checked = true;
      }
    })
  }
  checkUnRead() {
    this.unchechAll();
    this.table.map(item => {
      if (!item.ISREAD) {
        item.checked = true;
      }
    })
  }
  unchechAll() {
    this.table.map(item => { item.checked = false; })
  }
  delete() {
    let curentType = this.MailTypes[this.action]
    let checked = this.table.filter(x => x.checked);

    console.log(checked)
    if (checked.length) {
      let touser = checked.filter((x) => { return x.MAILTYPE == 'ToUserMail' });
      let ccuser = checked.filter((x) => { return x.MAILTYPE == 'CcUserMail' });
      let sent = checked.filter((x) => { return x.MAILTYPE == 'SentMail' })
      console.log(sent)
      let id = checked.map(x => x.MAILID).join(',');
      let payload = {
        TOUSERS: touser.length ? touser.map(x => x.MAILID).join(',') : '',
        CCUSERS: ccuser.length ? ccuser.map(x => x.MAILID).join(',') : '',
        SENTIDS: sent.length ? sent.map(x => x.MAILID).join(',') : '',
        MAILTYPE: checked[0].MAILTYPE,
        mailids: checked.length ? checked.map(x => x.MAILID).join(',') : '',

      }
      console.log(payload);
      this.activeSpinner();//SENTIDS SentMail
      this.CommonService.postCall(curentType.deleteUrl, payload).subscribe(res => {
        this.deactivateSpinner();
        this.loadInbox(curentType.loadUrl, this.action);
      }, err => {
        this.deactivateSpinner();
      })
    } else {
      this.toastr.warning("Please Select Mail")
    }
  }
  readMail() {
    let curentType = this.MailTypes[this.action]
    let checked = this.table.filter(x => x.checked);//ToUserMail  CcUserMail 
    let id;
    if (checked.length) {
      let touser = checked.filter((x) => { return x.MAILTYPE == 'ToUserMail' });
      let ccuser = checked.filter((x) => { return x.MAILTYPE == 'CcUserMail' })
      id = checked.map(x => x.MAILID).join(',');
      let payload = {
        TOUSERS: touser.length ? touser.map(x => x.MAILID).join(',') : '',
        CCUSERS: ccuser.length ? ccuser.map(x => x.MAILID).join(',') : '',
      }
      this.activeSpinner();
      this.CommonService.postCall(curentType.readurl, payload).subscribe(res => {
        this.deactivateSpinner();
        this.loadInbox(curentType.loadUrl, this.action);
      }, err => {
        this.deactivateSpinner();
      })


    } else {
      this.toastr.warning("Please Select Mail")
    }
  }
  selectType(s) {
    this.isshow = false;
    this.read = s;
    setTimeout(() => { this.isshow = true }, 1)
  }
  refresh() {

  }
}
