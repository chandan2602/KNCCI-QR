import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';
import { Router } from '@angular/router';
import { DashboardService } from 'src/app/services/dashboard.service';
@Component({
  selector: 'app-learning-resources',
  templateUrl: './learning-resources.component.html',
  styleUrls: ['./learning-resources.component.css']
})
export class LearningResourcesComponent implements OnInit {

  roleId = sessionStorage.RoleId;
  course: any = {
    isSessions: false,
    isClasses: true
  }
  data: any = {}

  constructor(private CommonService: CommonService, private toastr: ToastrService ,private route:Router, private DashboardService:DashboardService,) {
    if(this.roleId!=2){
      this.getCource();
    }
   }

  ngOnInit(): void {
  }

  getCource(){
    this.CommonService.activateSpinner()
  this.DashboardService.getCource().subscribe((data:any)=>{
    this.course={...this.course,...data}
    this.stopSpinner()
  },(e)=>{
   
    this.stopSpinner()
  })
}
toggleCource(key,collapse){
  this.course.isSessions=false;
  this.course.isClasses=false;
  this.course[key]=!collapse;
}
navigate(data,url){
  delete data.Name;
  this.route.navigate([url],{queryParams:data})
}

stopSpinner(){
  this.CommonService.deactivateSpinner()
}

}
