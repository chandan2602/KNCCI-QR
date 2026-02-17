import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-assignments',
  templateUrl: './assignments.component.html',
  styleUrls: ['./assignments.component.css']
})
export class AssignmentsComponent implements OnInit {
  assignments:Array<any>=[];

  constructor(private route:Router,private CommonService: CommonService) { 
    this.getLoadAssignments()
  }

  ngOnInit(): void {
  }
  activeSpinner(){
    this.CommonService.activateSpinner();
  }

  deactivateSpinner(){
    this.CommonService.deactivateSpinner()
  }


  add(){
    this.route.navigate(['HOME/addAssignments'])
  }
  getLoadAssignments(){
    this.activeSpinner();
    this.CommonService.loadAssignments().subscribe((res:any)=>{
       this.deactivateSpinner();
      this.assignments=res;
    },(err)=>{ this.deactivateSpinner();})
  }
 
  edit(data){
    let params={
      id:data.ASSIGNMENT_ID
    }
    this.route.navigate(['HOME/addAssignments'],{queryParams:params})
  }
}
