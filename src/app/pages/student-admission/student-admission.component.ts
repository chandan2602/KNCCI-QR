import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';
import { BaseComponent } from '../base.component';

@Component({
  selector: 'app-student-admission',
  templateUrl: './student-admission.component.html',
  styleUrls: ['./student-admission.component.css']
})
export class StudentAdmissionComponent extends BaseComponent implements OnInit{
  studentAdmission :any = {};

  constructor(private fb: UntypedFormBuilder,  CommonService: CommonService,  toastr: ToastrService,private route:Router) { 
super(CommonService,toastr)
this.load();

  }
  ngOnInit(): void {
   
    
  }
  activeSpinner() {
    this.CommonService.activateSpinner();
  }
  deactivateSpinner() {
    this.CommonService.deactivateSpinner()
  }
  load(){
let payload = {
      "TENANT_CODE": 60268037
  }
  this.CommonService.getEditorData("StudentRegistration/GetList", payload).subscribe((response: any) => {
    this.editData = response;
  })
}

  
add(){
  this.route.navigate(['/home/addstudentAdmission'])
}

edit(student_regid) {
this.isEdit=true;
  this.route.navigate(['/home/addstudentAdmission'],{ queryParams: { sId :student_regid}})
}

    
   
 


    
//   }
  // this.route.navigate(['home/studentAdmissionsessions'], { queryParams: params })

// }


}
