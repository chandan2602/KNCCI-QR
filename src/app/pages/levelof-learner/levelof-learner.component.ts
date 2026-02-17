import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../base.component';
import { CommonService } from 'src/app/services/common.service';
import { ToastrService } from 'ngx-toastr';
import { dataDictionary } from 'src/app/dataDictionary';

@Component({
  selector: 'app-levelof-learner',
  templateUrl: './levelof-learner.component.html',
  styleUrls: ['./levelof-learner.component.css']
})
export class LevelofLearnerComponent extends BaseComponent implements OnInit {

  @ViewChild(DataTableDirective, { static: false })
  public dtElement: DataTableDirective;
  labelOfLearner:Array<any>=[];
  constructor(CommonService: CommonService, toastr: ToastrService,) {
    super(CommonService, toastr);
    this.getLavelOfLearner();
  }

  ngOnInit(): void {
  }
  enableOrDisabledSpinner(flag: boolean = true) {
    flag ? this.CommonService.activateSpinner() : this.CommonService.deactivateSpinner();
  }

  getLavelOfLearner(){
    this.enableOrDisabledSpinner();
    this.CommonService.postCall('GetDictionaryByKey',{ DictionaryCode: dataDictionary.ProficiencyLevel }).subscribe((res: any) => {
      this.labelOfLearner=res;
      this.renderDataTable()
      this.enableOrDisabledSpinner(false);
    }, e => { this.enableOrDisabledSpinner(false); });
  }
  

}
