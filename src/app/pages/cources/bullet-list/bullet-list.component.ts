import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-bullet-list',
  templateUrl: './bullet-list.component.html',
  styleUrls: ['./bullet-list.component.css']
})
export class BulletListComponent implements OnInit {

  @Input() OptionsList: Array<string> = [];
  @Output() optionListEvent = new EventEmitter<{ isCancel: boolean, option: Array<string> }>();

  content: string = '';
  bulletpoint: any = '';
  btnTitle: string = 'Add';
  index: number;
  bulletEdit: Boolean = false;
  constructor(private toastr: ToastrService) { }

  ngOnInit(): void {
    setTimeout(() => document.getElementById("btnShowBulletListModel").click(), 10);
  }

  addPoints() {
    if (this.bulletpoint == '') {
      this.toastr.warning('Please Enter Atleast One Bullet Point');
      return;
    }

    if (this.bulletEdit)
      this.OptionsList[this.index] = this.bulletpoint;
    else
      this.OptionsList.push(this.bulletpoint);

    this.clearData();
  }

  clearData() {
    this.bulletpoint = '';
    this.btnTitle = 'Add';
    this.bulletEdit = false;
    this.index = -1;
  }

  editBullet(i: number) {
    this.bulletEdit = true;
    this.index = i;
    this.btnTitle = 'Update';
    this.bulletpoint = this.OptionsList[this.index];
  }

  closeBulet(isCancel: boolean = true) {
    this.optionListEvent.emit({ isCancel: isCancel, option: this.OptionsList });
    this.bulletpoint = '';
    this.OptionsList = [];
    this.btnTitle = 'Add';
    this.bulletEdit = false;
  }

  updatePoints() {
    if (this.OptionsList.length == 0) {
      this.toastr.warning('Please Enter Atleast One Bullet Point');
      return;
    }
    this.closeBulet(false);
    document.getElementById("btn_close").click();
  }

}
