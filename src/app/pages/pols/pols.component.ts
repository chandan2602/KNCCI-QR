import { Component, OnInit } from '@angular/core';
import {PolsService} from './../../services/pols.service';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-pols',
  templateUrl: './pols.component.html',
  styleUrls: ['./pols.component.css']
})
export class PolsComponent implements OnInit {
  polls:[]=[]
  constructor(private pollService:PolsService,private route:Router,private CommonService:CommonService) {
    this.getPolls()
   }

  ngOnInit(): void {
  }

  getPolls(){
    
    this.CommonService.activateSpinner();
    this.pollService.getPolls().subscribe((res:any)=>{
      this.CommonService.deactivateSpinner()
     this.polls=res
    },(err)=>{
      this.CommonService.deactivateSpinner()
    })
  }

  takePoll(data){
    this.route.navigate(['HOME/takepoll'],{queryParams:data})
  }

}
