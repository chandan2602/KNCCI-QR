import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { CommonService } from 'src/app/services/common.service';


@Component({
  selector: 'app-timetracker',
  templateUrl: './timetracker.component.html',
  styleUrls: ['./timetracker.component.css']
})
export class TimetrackerComponent implements OnInit {

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
     this.CommonService.getTimeTracker().subscribe((res:any)=>{
       this.results=res;
       this.CommonService.deactivateSpinner()
     },e=>{this.CommonService.deactivateSpinner()})
   }

}
