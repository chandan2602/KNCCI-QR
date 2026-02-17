import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { dataDictionary } from 'src/app/dataDictionary';
import { CommonService } from 'src/app/services/common.service';
import { BaseComponent } from '../base.component';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.css']
})
export class LocationsComponent extends BaseComponent implements OnInit {
  countryId: string = '';
  stateId: string = '';
  countrys: [] = [];
  states: [] = [];
  cities: [] = [];

  constructor(CommonService: CommonService, toastr: ToastrService) {
    super(CommonService, toastr);
   
    this.loadGrid();
  this.loadCountry()
  }

  ngOnInit(): void {
    this.createForm();
  }
  createForm() {
    this.myForm = this.formBuilder.group({
      LOCATION_NAME: ['', Validators.required],
      LOCATION_ADDRESS1: ['', Validators.required],
      LOCATION_COUNTRY_ID: ['', Validators.required],
      LOCATION_PROVINCE_ID: ['', Validators.required],
      LOCATION_CITY: ['', Validators.required],
      LOCATION_ZIP: [{ value: '', }, [Validators.required]],
      LOCATION_CONTACT_PERSON: ['',],
      LOCATION_PHONE1: ['', [Validators.required,Validators.maxLength(12),Validators.minLength(10)]],
      LOCATION_PHONE2: [''],
      LOCATION_EMAILID: ['', Validators.required],
      LOCATION_STATUS: [true, Validators.required]
    })
  }

  loadGrid() {
    let fn = () => { }
    let payLoad = { TENANT_CODE: this.TenantCode, CREATEDBY: this.userId }
    this.getGridData('loadLocation', payLoad, fn);
  }
  add() {
    this.schedules = [];
  }
  close() {
    this.isEdit = false;
    this.myForm.reset();
    this.editData = {};
  }
  onSubmit(form: UntypedFormGroup) {
    let payload = form.getRawValue();
    payload.TENANT_CODE = this.TenantCode;
    this.activeSpinner();
    if (this.isEdit) {
      payload.LASTMDFBY = this.userId;
      payload.APPOINTMENT_ID = this.editData.APPOINTMENT_ID
      payload.LOCATION_ID=this.editData.LOCATION_ID;
      this.CommonService.postCall('UpdateLocation', payload).subscribe((res) => {
        this.deactivateSpinner();
        this.toastr.success(" Location  Updated Successfully");
        document.getElementById('md_close').click()
        this.loadGrid();
      }, err => { this.deactivateSpinner(); this.toastr.error(err.error ? err.error : "Location not updated ") })
    } else {
      payload.CREATEDBY = this.userId;
      // ContentType=100
      this.CommonService.postCall('CreateLocation', payload).subscribe((res) => {
        this.deactivateSpinner();
        this.toastr.success("Location Created Successfully");
        document.getElementById('md_close').click()
        this.loadGrid()
      }, err => { this.deactivateSpinner(); this.toastr.error(err.error ? err.error : "Location not created ") })
    }


  }
  edit(data) {
    this.editData.LOCATION_ID = data.LOCATION_ID;
    this.isEdit = true;
    this.CommonService.postCall('EditLocation', this.editData).subscribe((res) => {
      this.editData = res[0]||res;
      this.setData()
    })
  }
  setData() {
    let ctrls: any = this.myForm.controls;
    Object.keys(ctrls).map((key: string) => {
      let control: UntypedFormControl = ctrls[key];
      let value = this.editData[key];
      if (value != undefined) control.setValue(value);
    });

    ctrls['LOCATION_COUNTRY_ID'].setValue(this.editData['COUNTRY_ID'])
    ctrls['LOCATION_PROVINCE_ID'].setValue(this.editData['PROVINCE_ID'])
    ctrls['LOCATION_CITY'].setValue(this.editData['CITY_ID']);
    ctrls['LOCATION_STATUS'].setValue(this.editData['LOCATION_STATUS']?1:0)
    this.countryChange();
    this.stateChange();

    //format("HH:mm")

  }
  loadCountry() {
    this.activeSpinner();
    this.CommonService.postCall('GetDictionaryByKey', { DictionaryCode: dataDictionary.Country }).subscribe(
      (res) => {
        this.countrys = res;
        this.deactivateSpinner();
      }, err => {
           this.deactivateSpinner();
      }
    )
  }
  countryChange() {
    this.activeSpinner();
    this.CommonService.postCall('GetChildDictionary', { DictionaryID: this.countryId }).subscribe(
      (res) => {
        this.states = res;
        this.deactivateSpinner();
      }, err => {
           this.deactivateSpinner();
      }
    )
  }
  stateChange() {
    this.activeSpinner();
    this.CommonService.postCall('GetChildDictionary', { DictionaryID: this.stateId }).subscribe(
      (res) => {
        this.cities = res;
        this.deactivateSpinner();
      }, err => {
           this.deactivateSpinner();
      }
    )
   }
}
