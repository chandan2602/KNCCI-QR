import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';
import { BaseComponent } from '../base.component';

@Component({
  selector: 'app-content-repo',
  templateUrl: './content-repo.component.html',
  styleUrls: ['./content-repo.component.css']
})
export class ContentRepoComponent extends BaseComponent implements OnInit {

  constructor(private fb: UntypedFormBuilder,  CommonService: CommonService, toastr: ToastrService,private route:Router) {
    super(CommonService,toastr);
    this.loadTable();
  }

  ngOnInit(): void {
  }
 
  loadTable(){
    let c=()=>{this.renderDataTable()}
    this.getGridData('ContentRepository/getlist',{CNTREPO_CREATED_BY:this.userId})
   
  }
  edit(item){
   this.route.navigate(['HOME/contentRepository/edit'],{queryParams:{id:item.CNTREPO_ID}});
  }
  add(){
    this.route.navigate(['HOME/contentRepository/add']);
  }
}
