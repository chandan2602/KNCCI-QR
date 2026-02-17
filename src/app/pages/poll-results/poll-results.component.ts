import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType } from 'chart.js';
import { Color, Label, SingleDataSet, ThemeService } from 'ng2-charts';
import { BaseComponent } from './../base.component';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-poll-results',
  templateUrl: './poll-results.component.html',
  styleUrls: ['./poll-results.component.css']
})
export class PollResultsComponent extends BaseComponent implements OnInit {
  public pieChartData: SingleDataSet = [];
  public pieChartType: ChartType = "pie";
  public pieChartLegend = true;
  public pieChartPlugins = [];
  public pieChartLabels: Label[] = [];
  question:string=''
  public pieChartOptions: ChartOptions = {
    responsive: true
  };
  public pieChartColors:Color[]=[]
  colors: Array<string> = [
    '#4661EE',
    '#EC5657',
    '#1BCDD1',
    '#8FAABB',
    '#B08BEB',
    '#3EA0DD',
    '#F5A52A',
    '#23BFAA',
    '#FAA586',
    '#EB8CC6',
    "#2F4F4F",
    "#008080",
  ];
  pollId: string;
  count:number=0;
  constructor(CommonService: CommonService, toastr: ToastrService, active: ActivatedRoute) {
    super(CommonService, toastr);
    active.queryParams.subscribe(res => {
      if (res.id) {
        this.pollId = res.id;
        this.getResult()
      } else {
        window.history.back();
      }
    })
  }

  ngOnInit(): void {
  }
  getResult() {
    let payLoad = {
      PollId: this.pollId
    }
    let callBack = () => {
      this.dataTransform()
    }
    this.getGridData('Displaychart', payLoad, callBack)
  }
  
  dataTransform(){
     let colors=[];
     
    this.table.map((item)=>{
      this.question=item.PollQuestion
      this.pieChartData.push(item.userCount);
      this.pieChartLabels.push(item.OptionText)
      let color=this.colors[Math.floor(Math.random() * this.colors.length)];
      colors.push(color);
      item.color=color;
      this.count=this.count+item.Options
    })
    this.pieChartColors[0]={}
    this.pieChartColors[0]['backgroundColor']=colors;

  }

}
