import { Component } from '@angular/core';

@Component({
  selector: 'app-landing-contact',
  templateUrl: './landing-contact.component.html',
  styleUrls: ['./landing-contact.component.css']
})

export class LandingContactComponent {

  isShw(): boolean {
    return !location.href.includes('/default');
  }

}