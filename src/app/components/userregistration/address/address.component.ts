import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { async } from 'rxjs/internal/scheduler/async';
import { dataDictionary } from 'src/app/dataDictionary';
import { EditUserRegistrationComponent } from 'src/app/pages/edit-user-registration/edit-user-registration.component';
import { CommonService } from 'src/app/services/common.service';
@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css']
})

export class AddressComponent implements OnInit {
  @Input() parent: EditUserRegistrationComponent;
  @Input() editData: any = {};
  changed: boolean = false;
  table: Array<any> = [];
  myForm: UntypedFormGroup;
  isEdit: boolean = false;
  index: number;
  addrTypes: Array<any> = [];
  addressCountry: Array<any> = [];
  addressStates: Array<any> = [];
  addressCity: Array<any> = [];
  Address: Array<any> = [];
  constructor(public CommonService: CommonService, private fb: UntypedFormBuilder) {
    console.log('addressState', this.addressStates)
    console.log('addressCity', this.addressCity)
  }

  ngOnInit(): void {
    this.formInit();
    this.getAll();
    //this.parent.childs['AddressList'] = this;
    this.parent.childs['AddressData'] = this;
  }

  formInit() {
    this.myForm = this.fb.group({
      AddressType: ['', Validators.required],
      AddressId: [0],
      Country: ['', Validators.required],
      State: ['', Validators.required],
      City: ['', Validators.required],
      Pincode: [''],
      AddressDetails: ['', Validators.required],
      temp_address: ['']
    });
  }

  ngOnChanges() {
    if (Object.keys(this.editData).length && !this.changed) {
      this.changed = true;
      this.dataTransform(this.editData['Address'].slice(0));
    }
  }

  dataTransform(data: Array<any>) {
    // this.table = data
    if (data.length > 0) {
      const item = data[0];
      let obj = {
        TYPE: item['TYPE'],
        AddressId: item['ADDRESSID'],
        AddressType: item['ADDRESSTYPE'],
        Country: item['COUNTRY'],
        State: item['STATE'],
        City: item['CITY'],
        Pincode: item['PINCODE'],
        AddressDetails: item['ADDRESSDETAILS'],
        temp_address: item['TEMP_ADDRESS']
      }
      this.close();
      // this.myForm.patchValue(obj);
      if (obj.Country) {
        Promise.all([this.onChangeCountry(obj.Country),
        setTimeout(() => {
          this.onChangeState(obj.State)
        }, 200)]).then(() => {
          this.myForm.patchValue(obj);
          // this.assignDataForm(data);
        });
      }
      this.table.push(obj);
      // console.log('address', obj);
    };
    this.Address = this.table.slice(0);
  }

  getAll() {
    let types = this.CommonService.postCall('GetDictionaryByKey', { DictionaryCode: dataDictionary.AddressType });//GetAddressType
    let country = this.CommonService.postCall('GetDictionaryByKey', { DictionaryCode: dataDictionary.Country });
    forkJoin([types, country,]).subscribe((res) => {
      [this.addrTypes, this.addressCountry,] = [...res]
    })

  }

  async onChangeCountry(value) {

    await this.CommonService.postCall('GetChildDictionary', { DictionaryID: this.addressCountry?.find(m => m.DICTIONARYNAME == value).DICTIONARYID }).subscribe({
      next: (res: any) => {
        this.addressStates = res;
      },
      error: (err) => {
        console.log('addressStates error', err);
      },
      complete: () => { }
    }
    )
  }

  async onChangeState(value) {
    await this.CommonService.postCall('GetChildDictionary', { DictionaryID: this.addressStates?.find(m => m.DICTIONARYNAME == value).DICTIONARYID }).subscribe({
      next: (res: any) => {
        this.addressCity = res;
      },
      error: (err) => {
        console.log('addressCity error', err);
      },
      complete: () => { }
    }
    )
  }

  add() {
    this.isEdit = false;
    this.setDefaults()
  }

  setDefaults() {
    let keys = ['AddressType', 'Country', 'State', 'City'];
    let ctrls = this.myForm.controls;
    keys.map((key) => {
      let ctrl = ctrls[key];
      ctrl.setValue('')
    })
  }

  editAddress(data, i) {
    this.close();
    this.index = i;
    this.isEdit = true;
    this.editData = data;
    Promise.all([this.onChangeCountry(this.editData.Country),
    setTimeout(() => {
      this.onChangeState(this.editData.State)
    }, 200)]).then(() => {
      this.myForm.patchValue(data);
      // this.assignDataForm(data);
    });
  }

  close() {
    this.formInit();
    //this.myForm.reset();
    this.addressStates = [];
    this.addressCity = [];
  }

  onSubmit(form: UntypedFormGroup) {
    if (form.invalid) {
      this.parent.toastr.warning('Please Enter All Mandatory Fields');
      return;
    }
    let value = form.value;
    // let value= this.myForm.getRawValue();
    let data = Object.assign({}, value);
    if (this.isEdit) {
      data.TYPE = ['edit', 'update'].includes(this.editData.TYPE) ? 'update' : 'insert';
      // if (['edit', 'update'].includes(this.editData.TYPE)) {
      //   value.TYPE = 'update'
      // } else {
      //   value.TYPE = 'insert'
      // }
      // let data = Object.assign({}, value);
      this.table[this.index] = data;
      // this.Address.push(data);
      this.Address[this.index] = data;
    } else {
      //value.TYPE = 'insert'
      data.TYPE = 'insert'
      // let data = Object.assign({}, value);
      this.table.push(data);
      console.log(this.table);
      this.Address.push(data);
    }
    [this.isEdit, this.index] = [false, -1];
    this.close();
    // $('.close').click();
    this.parent.toastr.success('Updated successfully')
  }

  assignDataForm(data: any) {
    let ctrls = this.myForm.controls;
    Object.keys(ctrls).map((formControlName: string) => {
      let control: AbstractControl = ctrls[formControlName];
      console.log(`${formControlName}=${data[formControlName]}`);
      control.setValue(data[formControlName]);
    })
  }
}
