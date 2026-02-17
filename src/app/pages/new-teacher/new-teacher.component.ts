import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UntypedFormBuilder } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from 'src/app/pages/base.component';
import { CommonService } from 'src/app/services/common.service';


@Component({
  selector: 'app-new-teacher',
  templateUrl: './new-teacher.component.html',
  styleUrls: ['./new-teacher.component.css']
})
export class NewTeacherComponent extends BaseComponent implements OnInit {
  

  constructor(private fb:UntypedFormBuilder, CommonService: CommonService,  toastr: ToastrService, private route: Router) {
    super(CommonService,toastr);
    this.load();
   

  }

  ngOnInit(): void {
    
  }




  load(){
    this.activeSpinner();
    let payLoad = {
      "TENANT_CODE": this.TenantCode ,
    
      "USER_ID": this.userId,
       
    }
    this.CommonService.postCall('TeacherRegistration/GetList', payLoad).subscribe((res: any) => {

     this.editData=res;

     console.log(res);
    this.deactivateSpinner();
     
    },e => { this.deactivateSpinner() })

  }

  

  add(){
    this.route.navigate(['/home/addNewTeacher'])
  }

  onEdit(teacherId){
    this.isEdit=true;
    this.route.navigate(['/home/addNewTeacher'],{ queryParams: { tId: teacherId} })

  }
  
}
