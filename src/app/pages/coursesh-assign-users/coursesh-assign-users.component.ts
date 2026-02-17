import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-coursesh-assign-users',
  templateUrl: './coursesh-assign-users.component.html',
  styleUrls: ['./coursesh-assign-users.component.css']
})
export class CourseshAssignUsersComponent implements OnInit {
  table: Array<any> = [];
  constructor( private CommonService: CommonService,active:ActivatedRoute) {
    active.queryParams.subscribe((res:any)=>{
      if(res.csId){
        this.loadUsers(res.csId)
      }
    })
  }

  ngOnInit(): void {
    // this.loadUsers();
  }


  activeSpinner(){
    this.CommonService.activateSpinner();
  }

  deactivateSpinner(){
    this.CommonService.deactivateSpinner()
  }
 

  loadUsers(id){
     this.activeSpinner();
     this.CommonService.postCall('LoadUsersByCourseScheduleId',{STUDENT_PAYMENT_COURSESHD_ID:id}).subscribe(
       (res:any)=>{
         this.table=res;
         this.deactivateSpinner()
       },err=>{this.deactivateSpinner()})
  }
  


}
