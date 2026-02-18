import { Component } from '@angular/core';

@Component({
  selector: 'app-public-footer',
  templateUrl: './public-footer.component.html',
  styleUrls: ['./public-footer.component.css']
})
export class PublicFooterComponent {
  currentYear: number = new Date().getFullYear();
}
