import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {PolsService} from './../../services/pols.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-takepols',
  templateUrl: './takepols.component.html',
  styleUrls: ['./takepols.component.css']
})
export class TakepolsComponent implements OnInit {
   pollData:any={};
   pollQuestions:any=[]
   pollId:any;
   result:any=[];
  constructor(private active:ActivatedRoute,private pollService:PolsService,private route:Router,private CommonService: CommonService) {
    active.queryParams.subscribe((res)=>{
      this.pollData=res;
      this.getPollQuestions(res.PollId)
    })
   }

  ngOnInit(): void {
  }
  getPollQuestions(id){
    this.CommonService.activateSpinner();
    this.pollService.getPollQuestions(id).subscribe((res)=>{
      this.CommonService.deactivateSpinner();
      this.pollQuestions=res;
      this.pollData=res[0]
    },(err)=>{
      this.CommonService.deactivateSpinner();
    
    })
  }

  save(){
    if(this.pollId){
      let data={
        answer:this.pollId,
        PollId:this.pollData.PollId
      }
      this.pollService.savePolls(data).subscribe((res:any)=>{
        res[1].class="first";
       if(res.length>2) res[2].class="secound";
        if(res.length>3){
          res[3].class="three";
        }
        if(res.length>4){
          res[3].class="four";
        }
        this.result=res;
        // this.route.navigate(['home/poll'])
      },(err)=>{
      })
    }
  }
  getWidth(width){
    return width?width+'%':'2%'
  }
}
