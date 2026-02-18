import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing-contact',
  templateUrl: './landing-contact.component.html',
  styleUrls: ['./landing-contact.component.css']
})

export class LandingContactComponent {

  constructor(public rtr: Router) { }

  isShw(): boolean {
    return !location.href.includes('/default');
  }

  isSS(t: string): boolean {
    return ((t == 'd') ? location.href.includes('/default') : ((t == 'a') ? location.href.includes('/about') : ((t == 'j') ? location.href.includes('/job') : ((t == 'i') ? location.href.includes('/internship') : ((t == 'c') ? location.href.includes('/corporate') : ((t == 'p') ? location.href.includes('/contacts') : false))))));
  }

}