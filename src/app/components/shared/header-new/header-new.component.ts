import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { environment } from '../../../../environments/environment';

declare const $: any;

@Component({
  selector: 'app-header-new',
  templateUrl: './header-new.component.html',
  styleUrls: ['./header-new.component.css']
})
export class HeaderNewComponent implements OnInit {
  @Input() categoryList: Array<{ id: number, name: string }> = [];
  @Output() categoryEvent = new EventEmitter<number>();

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private scroller: ViewportScroller
  ) { }

  ngOnInit(): void {

    this.activatedRoute.fragment.subscribe(fragment => {
      if (fragment) {
        setTimeout(() => {
          this.scroller.scrollToAnchor(fragment);
        }, 100);
      }
    });


    this.SearchModel();
    setTimeout(() => this.companyDetails(), 10);
  }


  SearchModel() {
    $(document).ready(function () {
      $('#close-btn').click(function () {
        $('#search-overlay').fadeOut();
        $('#search-btn').show();
      });
      $('#search-btn').click(function () {
        $(this).hide();
        $('#search-overlay').fadeIn();
      });
    });
  }


  onCategoryChanged(categoryId: number) {
    this.categoryEvent.emit(categoryId);
    this.gotoSection();
  }


  gotoSection() {
    $(document).scrollTop(1100);
  }


  companyDetails() {
    const { fileUrl } = environment;
    const path = sessionStorage.landingpageimage_path;

    if (path) {
      document.getElementById("landingpageimage_path")
        ?.setAttribute("src", `${fileUrl}${path}`);
    }
  }


  NavigateTo() {
    const URL = "/signup";
    this.router.navigate([URL]);
  }

  signUPLogin(evnt: any) {
   if(evnt == 3) {
      this.router.navigate(['startsUpReg']);
      $('#cls').click();
    } else if(evnt == 4) {
      this.router.navigate(['incubatorReg']);
      $('#cls').click();
    } else if(evnt == 5) {
      this.router.navigate(['investorReg']);
      $('#cls').click();
    }else {
      // if(evnt == 1 || evnt == 2) {
        this.NavigateTo();
        $('#cls').click();
      // } else 
    }
  }

  NavigateToSection() {
    this.router.navigate(['/home'], { fragment: 'about' });
  }
}
