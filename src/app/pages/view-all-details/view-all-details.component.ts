import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-view-all-details',
  templateUrl: './view-all-details.component.html',
  styleUrls: ['./view-all-details.component.css']
})
export class ViewAllDetailsComponent implements OnInit {
  @Input() achivementsList: Array<{ count: number, usertype: string }> = [];
  googleURL: SafeResourceUrl;
  constructor(private sanitizer: DomSanitizer) {
    // if (location.origin.includes("localhost"))
    //   this.googleURL = "https://shiksion.com/tutormaps/";
    // else
    //   this.googleURL = `${location.origin}/tutormaps/`;
  }

  ngOnInit(): void {
    let url: string = "";
    if (location.origin.includes("localhost"))
      url = "https://shiksion.com/tutormaps/";
    else
      url = `${location.origin}/tutormaps/`;
    this.googleURL = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  getCount(usertype: string): number {
    const count: number = this.achivementsList.find(e => e.usertype == usertype)?.count || 0;
    return count;
  }

}
