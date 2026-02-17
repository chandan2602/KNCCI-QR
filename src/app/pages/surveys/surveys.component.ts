import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PolsService } from 'src/app/services/pols.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-surveys',
  templateUrl: './surveys.component.html',
  styleUrls: ['./surveys.component.css']
})
export class SurveysComponent implements OnInit {
   surveys:[]=[]
  constructor(private pollService:PolsService,private route:Router,private CommonService: CommonService) {
    this.getSurveys()
   }

  ngOnInit(): void {
  }
   
  getSurveys(){
    this.CommonService.activateSpinner();
    this.pollService.getSurveys().subscribe((res:any)=>{
      this.CommonService.deactivateSpinner();
      this.surveys=res;
      
    },(err)=>{this.CommonService.deactivateSpinner();})
  }

  takeSurvey(id){
    let params={id:id}
    this.route.navigate(['home/takesurvey'],{queryParams:params})
  }

}
