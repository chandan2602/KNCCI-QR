import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { BaseComponent } from "./../pages/base.component";
import { CommonService } from "./../services/common.service";
import { ToastrService } from "ngx-toastr";
import { environment } from "./../../environments/environment";
import { AbstractControl, UntypedFormBuilder, FormGroup, Validators } from "@angular/forms";
import { FileuploadService } from "./../services/fileupload.service";

@Component({
  selector: 'app-view-ads',
  templateUrl: './view-ads.component.html',
  styleUrls: ['./view-ads.component.css']
})
export class ViewAdsComponent extends BaseComponent implements OnInit {
  serverPath: any = "";
  showAdPopup = false;
  adsList: any[] = [];
  advertisements: any[] = [];
  @Output() adEvent = new EventEmitter<any>();
  constructor(private fileuploadService: FileuploadService, CommonService: CommonService, toastr: ToastrService, private fb: UntypedFormBuilder) {
    super(CommonService, toastr);
    this.serverPath = environment.urlFiles;
    console.log(this.adsList);

  }


  ngOnInit(): void {
    this.fetchAds();
  }

  fetchAds() {
    this.CommonService.activateSpinner();
    this.advertisements = [];
    this.CommonService.getCall(`Advertisement/GetTrendingAdvertisements/${+sessionStorage.company_id}/${+sessionStorage.UserId}`).subscribe(
      (res: any) => {
        this.advertisements = res.data
        // this.advertisements = this.advertisements.map(e => ({ ...e, fullImgUrl: `${this.serverPath}${e.add_logo}` }));
        this.advertisements = (this.advertisements ?? []).map(e => ({
          ...e,
          fullImgUrl: `${this.serverPath}${e.add_logo}`
        }));

        this.CommonService.deactivateSpinner();
      },
      (e) => {
        this.CommonService.deactivateSpinner();
      });
  }

  onClickImg(item: any) {
    this.CommonService.activateSpinner();
    this.advertisements = [];
    let payload = {
      advertisement_detailid: item.advertisement_detailid,
      add_advertisement_id: item.advertisement_id,
      add_created_by: +sessionStorage.UserId,
      add_tnt_code: +sessionStorage.TenantCode,
      add_modified_by: +sessionStorage.UserId,
      add_clicked_userids: + sessionStorage.UserId
    }
    this.CommonService.postCall(`Advertisement/AdvertisementClicksDetails`, payload).subscribe(
      (res: any) => {
        if (res.status) {
          window.open(item.add_website);
          this.adEvent.emit(false);
        } else {
          this.toastr.warning(res.message);
        }
        this.CommonService.deactivateSpinner();
      },
      (e) => {
        this.CommonService.deactivateSpinner();
      }
    );

  }


}
