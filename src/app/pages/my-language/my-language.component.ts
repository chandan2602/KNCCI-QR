import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subscription } from 'rxjs';
import { BaseComponent } from '../base.component';
import { CommonService } from 'src/app/services/common.service';
import { ToastrService } from 'ngx-toastr';
import { dataDictionary } from 'src/app/dataDictionary';
@Component({
  selector: 'app-my-language',
  templateUrl: './my-language.component.html',
  styleUrls: ['./my-language.component.css']
})
export class MyLanguageComponent extends BaseComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  public dtElement: DataTableDirective;
  myLanguage: Array<any> = [];
  private readonly onDestroy = new Subscription();


  constructor(CommonService: CommonService, toastr: ToastrService,) {
    super(CommonService, toastr);
    this.getLanguage();
  }
 
  ngOnInit(): void {
  }
  enableOrDisabledSpinner(flag: boolean = true) {
    flag ? this.CommonService.activateSpinner() : this.CommonService.deactivateSpinner();
  }

  getLanguage(){
    this.enableOrDisabledSpinner();
    this.CommonService.postCall('GetDictionaryByKey',{ DictionaryCode: dataDictionary.Language }).subscribe((res: any) => {
      this.myLanguage=res;
      this.renderDataTable()
      this.enableOrDisabledSpinner(false);
    }, e => { this.enableOrDisabledSpinner(false); });
   // this.onDestroy.add(ob1$);
  }


  ngOnDestroy(): void {
    this.onDestroy.unsubscribe();
    this.dtTrigger.unsubscribe();
  }

}
