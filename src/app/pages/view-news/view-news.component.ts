
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, FormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { id } from 'date-fns/locale';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-view-news',
  templateUrl: './view-news.component.html',
  styleUrls: ['./view-news.component.css']
})
export class ViewNewsComponent implements OnInit {
  myForm: UntypedFormGroup;
  eventId: any;
  eventName: any;
  description: any;
  newsList = [];
  news = {};
  isNews = false;
  isEvent = false;
  events = [];


  constructor(private fb: UntypedFormBuilder, active: ActivatedRoute, private CommonService: CommonService, private toastr: ToastrService) {
    active.queryParams.subscribe((res) => {
      if (res) {

        this.eventId = res.Id ? res.Id : '';
        console.log(res, this.eventId)
      }

    })

    this.getNewsList()
    this.loadEvents()
  }

  ngOnInit(): void {
    this.getNews(this.eventId);
    $('#newsModal').show();

  }

  onCloseModal() {
    $('#newsModal').hide();
  }

  getNewsList() {
    this.newsList = []
    let payload = {
      "TNT_CODE": sessionStorage.getItem('TenantCode')
    }

    this.CommonService.postCall("News/GetNewsList", payload).subscribe((response: any) => {
      this.newsList = response;
      console.log(response)
    })
  }


  getNews(EVENT_ID) {
    this.news = {}
    let payload = {
      "EVENT_ID": EVENT_ID
    }
    this.CommonService.postCall("News/Get", payload).subscribe((response: any) => {
      this.isNews = true;
      this.news = response;
      console.log(response)
    })
  }




  loadEvents() {
    this.events = []
    let payload = {
      "TNT_CODE": sessionStorage.getItem('TenantCode')
    }

    this.CommonService.postCall("News/LoadEvents", payload).subscribe((response: any) => {
      this.isEvent = true;
      this.events = response;

      console.log(response)

    })

  }




  close() {
    document.getElementById('close').click()
  }


}
