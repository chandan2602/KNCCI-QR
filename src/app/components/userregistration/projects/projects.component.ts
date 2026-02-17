import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { forkJoin } from 'rxjs';
import { dataDictionary } from 'src/app/dataDictionary';
import { EditUserRegistrationComponent } from 'src/app/pages/edit-user-registration/edit-user-registration.component';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {
  @Input() parent: EditUserRegistrationComponent;
  @Input() editData: any = {};
  changed: boolean = false;
  table: Array<any> = [];
  myForm: UntypedFormGroup;
  isEdit: boolean = false;
  index: number;
  locationTypes: Array<any> = [];
  locations: Array<any> = [];
  empTypes: Array<any> = [];
  projectData: Array<any> = [];
  teamSize:Array<number>=Array(30).fill(0).map((x,i)=>i+1);
  constructor(private fb: UntypedFormBuilder) { }

  ngOnInit(): void {
    this.myForm = this.fb.group({
      ClientName: ['', Validators.required],
      ProjectTitle: ['', Validators.required],
      DurationFrom: ['', Validators.required],
      DurationTo: ['', Validators.required],
      ProjectLocationType: ['', Validators.required],
      ProjectLocation: ['', Validators.required],
      EmploymentType: ['', Validators.required],
      ProjectDetails: [''],
      Role: [''],
      RoleDesciption: [''],
      TeamSize: [''],
      SkillsUsed: [''],
    });
    this.getAll();
    this.parent.childs['ProjectsList'] = this
  }
  ngOnChanges() {
    if (Object.keys(this.editData).length && !this.changed) {
      this.changed = true;
      this.dataTransform(this.editData['Projects'].slice(0));
      this.addIds();
    }
  }
  dataTransform(data: Array<any>) {
    // this.table = data
    data.map((item) => {
      let obj = {
        ProjectID: item['<ProjectID>k__BackingField'],
        type: item['<type>k__BackingField'],
        ClientName: item['<ClientName>k__BackingField'],
        ProjectTitle: item['<ProjectTitle>k__BackingField'],
        DurationFrom: item['<DurationFrom>k__BackingField'] ? moment(item['<DurationFrom>k__BackingField']).format('yyyy-MM-DD') : '',
        DurationTo: item['<DurationTo>k__BackingField'] ? moment(item['<DurationTo>k__BackingField']).format('yyyy-MM-DD') : '',
        ProjectLocationType: '',
        ProjectLocationTypeName: item['<ProjectLocationType>k__BackingField'],
        ProjectLocationName: item['<ProjectLocation>k__BackingField'],
        ProjectLocation: '',
        EmploymentTypeName: item['<EmploymentType>k__BackingField'],
        EmploymentType: '',
        ProjectDetails: item['<ProjectDetails>k__BackingField'],
        Role: item['<Role>k__BackingField'],
        RoleDesciption: item['<RoleDesciption>k__BackingField'],
        TeamSize: item['<TeamSize>k__BackingField'],
      }
      this.table.push(obj)
    })


  }
  getAll() {
    let locationType = this.parent.CommonService.postCall('GetDictionaryByKey', {DictionaryCode:dataDictionary.ProjectLocationType});//GetProjectLocationType
    let location = this.parent.CommonService.postCall('GetDictionaryByKey', {DictionaryCode:dataDictionary.ProjectLocation});//GetProjectLocation
    let empType = this.parent.CommonService.postCall('GetDictionaryByKey', {DictionaryCode:dataDictionary.EmployementType});//GetEmployementType
    forkJoin([locationType, location, empType]).subscribe((res) => {
      [this.locationTypes, this.locations, this.empTypes] = [...res];
      this.addIds();
    })
  }

  add() {
    this.isEdit = false;
    this.setDefaults()
  }
  setDefaults() {
    let ctrls = this.myForm.controls;
    ctrls['ProjectLocationType'].setValue('');
    ctrls['ProjectLocation'].setValue('')
    ctrls['EmploymentType'].setValue('')
  }
  edit(data, i) {
    this.index = i;
    this.isEdit = true;
    this.editData = data;
    this.assignDataForm(i);
  }
  close() {
    this.myForm.reset()
  }
  onSubmit(form: UntypedFormGroup) {
    let value = form.value;
    if (this.isEdit) {
      if (this.editData.type == 'edit') {
        value.type = 'update'
      } else {
        value.type = 'insert'
      }
      value['ProjectID'] = this.editData['ProjectID']
      let data = Object.assign({}, value);
      this.createAndUpdate(data, false)
    } else {
      value.type = 'insert'
      let data = Object.assign({}, value);
      this.createAndUpdate(data, true)
    }
    document.getElementById('md_close_project').click();
  }

  addIds() {
    this.table.map((item) => {
      let lTypeIndex = this.locationTypes.findIndex(x => x.DICTIONARYNAME == item.ProjectLocationTypeName);
      if (lTypeIndex > -1) {
        item.ProjectLocationType = this.locationTypes[lTypeIndex]['DICTIONARYID']
      }
      let locationIndex = this.locations.findIndex(x => x.DICTIONARYNAME == item.ProjectLocationName);
      if (locationIndex > -1) {
        item.ProjectLocation = this.locations[locationIndex]['DICTIONARYID']
      }
      let empIndex = this.empTypes.findIndex(x => x.DICTIONARYNAME == item.EmploymentTypeName);
      if (empIndex > -1) {
        item.EmploymentType = this.empTypes[empIndex]['DICTIONARYID']
      }
    })

    this.projectData = this.table.slice(0)
  }

  assignDataForm(i) {
    let data = this.projectData[i];
    let ctrls = this.myForm.controls;
    Object.keys(ctrls).map((formControlName: string) => {
      let control: AbstractControl = ctrls[formControlName];
      control.setValue(data[formControlName]);
    })
  }
  check(item) {
    if (item.type == 'delete') {
      return true
    }
    else {
      return false
    }
  }

  createAndUpdate(data, type) {
    let i = this.index;
    let lTypeIndex = this.locationTypes.findIndex(x => x.DICTIONARYID == data.ProjectLocationType);
    if (lTypeIndex > -1) {
      data.ProjectLocationTypeName = this.locationTypes[lTypeIndex]['DICTIONARYNAME']
    }
    let locationIndex = this.locations.findIndex(x => x.DICTIONARYID == data.ProjectLocation);
    if (locationIndex > -1) {
      data.ProjectLocationName = this.locations[locationIndex]['DICTIONARYNAME']
    }
    let empIndex = this.empTypes.findIndex(x => x.DICTIONARYID == data.EmploymentType);
    if (empIndex > -1) {
      data.EmploymentTypeName = this.empTypes[empIndex]['DICTIONARYNAME']
    }
    if (type) {
      this.table.push(data);
      let obj = Object.assign({}, data);
      this.projectData.push(obj);
      this.parent.toastr.success('Added successfully')
    } else {
      this.table[i] = data;
      let obj = Object.assign({}, data);
      this.projectData[i] = obj
      this.parent.toastr.success('Updated successfully')
    }
  }
}
