import { Component, Input, OnInit } from '@angular/core';
import { EditUserRegistrationComponent } from 'src/app/pages/edit-user-registration/edit-user-registration.component';

@Component({
  selector: 'app-contact-details',
  templateUrl: './contact-details.component.html',
  styleUrls: ['./contact-details.component.css']
})
export class ContactDetailsComponent implements OnInit {
  @Input() editData: any = {}
  @Input() parent: EditUserRegistrationComponent;
  changed: boolean = false;
  personalData: Array<any> = [];
  table: Array<any> = []
  constructor() { }

  ngOnInit(): void {
    this.parent.childs['ContactDetailsList'] = this;
    console.clear();
    console.log("editData", this.editData)
  }
  ngOnChanges() {
    if (Object.keys(this.editData).length && !this.changed) {
      this.changed = true;
      this.personalData = this.editData['ContactDetails'].slice(0);
      this.dataTransform(this.editData['ContactDetails'].slice(0));
    }
  }
  dataTransform(data) {
    this.table = data
  }
  add() {
    if (this.table.length == 2) {
      this.parent.toastr.warning('Maximum only 2 communication should be added')
      return
    }
    this.table.map((data) => {
      data.isedit = false;
    })
    this.table.push({ isedit: true })
  }
  edit(item) {
    this.table.map((data) => {
      data.isedit = false;
    })
    item.isedit = true;

  }
  save(data, index) {
    let mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    let isMail = data['EMAILID'].match(mailformat)
    if (!isMail) { this.parent.toastr.warning('Please Enter Valid Mail Format'); return }
    if (!data.MOBILENO || data.MOBILENO.length < 10) {
      this.parent.toastr.warning('Please Enter Valid Mobile Number');
      document.getElementById('MOBILENO').focus();
      return;
    }
    if (!data.secondary_mobileno || data.secondary_mobileno.length < 10) { this.parent.toastr.warning('Please Enter Valid Mobile Number'); return; }
    if (this.personalData.length < 2 && !data.TYPE) {
      data['TYPE'] = 'insert';
      data.isedit = false;
      let n = Object.assign({}, data)
      this.personalData.push(n);
      this.parent.toastr.success('Added successfully')
    } else {
      data.isedit = false;
      if (data.TYPE == 'edit') {
        data.TYPE = 'update'
      }
      let n = Object.assign({}, data)
      this.personalData[index] = n;
      this.parent.toastr.success('Updated successfully')
    }
  }
  success(){
this.parent.save();
  }
  close(){

  }
 
}
///let t= /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
//value.match(mailformat)