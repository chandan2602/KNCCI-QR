import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-myresults',
  templateUrl: './myresults.component.html',
  styleUrls: ['./myresults.component.css']
})
export class MyresultsComponent implements OnInit {
  dtOptions: any = {};
  dtTrigger2: Subject<any> = new Subject();
  results:Array<any>=[]
  constructor(private CommonService:CommonService) { 
    this.getResults()
  }

  ngOnInit(): void {
    this.dtOptions = {dom: 'Bfrtip', buttons: [{extend: 'excel', text: 'Export Excel', title: 'Patient Gender Details'}, ]};
  }
 
   getResults(){
    this.CommonService.activateSpinner();
     this.CommonService.getResults().subscribe((res:any)=>{
      this.CommonService.deactivateSpinner()
       this.results=res;
       setTimeout(() => this.dtTrigger2.next(), 500);
     },e=>{this.CommonService.deactivateSpinner()})
   }

}
