import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base.component';
import { CommonService } from '../../services/common.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-hooland-code',
  templateUrl: './hooland-code.component.html',
  styleUrls: ['./hooland-code.component.css']
})
export class HoolandCodeComponent extends BaseComponent implements OnInit {

  constructor(CommonService: CommonService, toastr: ToastrService) {
    super(CommonService, toastr);
  }

  ngOnInit(): void {
  }

}
