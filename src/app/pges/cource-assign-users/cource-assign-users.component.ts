import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-cource-assign-users',
  templateUrl: './cource-assign-users.component.html',
  styleUrls: ['./cource-assign-users.component.css']
})
export class CourceAssignUsersComponent implements OnInit {

  table: Array<any> = [];
  isEdit: boolean = false;
  editData: any;
  constructor( private CommonService: CommonService, private toastr: ToastrService) {
    this.load();
  }

  ngOnInit(): void {

  }


  activeSpinner(){
    this.CommonService.activateSpinner();
  }

  deactivateSpinner(){
    this.CommonService.deactivateSpinner()
  }
 

  load(){
    
  }
  
  add() {
    this.editData = {};
    this.isEdit = false;
  }
  close() {
   
  }
  onSubmit() {}
}

