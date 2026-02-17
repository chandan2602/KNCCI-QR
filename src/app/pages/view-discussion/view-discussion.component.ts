import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, FormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { id } from 'date-fns/locale';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-view-discussion',
  templateUrl: './view-discussion.component.html',
  styleUrls: ['./view-discussion.component.css']
})
export class ViewDiscussionComponent implements OnInit {
  myForm: UntypedFormGroup;
  eventId: any;
  eventName: any;
  description: any;
  discussion = {};
  isDiscussion = false;
  isEvent = false;
  events = [];

  constructor(private fb: UntypedFormBuilder, active: ActivatedRoute, private CommonService: CommonService, private toastr: ToastrService) {
    active.queryParams.subscribe((res) => {
      if (res) {
        this.eventId = res.Id ? res.Id : '';
        console.log(res, this.eventId)
      }
    })
    this.loadDiscussion()
  }

  ngOnInit(): void {
    this.getDiscussion(this.eventId);
    $('#discussionModal').show();
  }

  onCloseModal() {
    $('#discussionModal').hide();
  }

  getDiscussion(ForumId) {
    this.discussion = {}
    let payload = {
      "ForumId": ForumId,
      "TenantCode": sessionStorage.getItem('TenantCode')
    }
    this.CommonService.postCall("Forums/Get", payload).subscribe((response: any) => {
      this.isDiscussion = true;
      this.discussion = response;
      console.log(response)
    })
  }

  loadDiscussion() {
    this.events = []
    let payload = {
      "TenantCode": sessionStorage.getItem('TenantCode'),
      "RoleId": sessionStorage.getItem('RoleId'),
    }
    this.CommonService.postCall("Forums/GetList", payload).subscribe((response: any) => {
      this.isEvent = true;
      this.events = response;
      console.log(response)
    })
  }

  close() {
    document.getElementById('close').click()
  }

}
