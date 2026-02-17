import { Component, OnInit } from '@angular/core';
declare const Partners_owlCarousel:any;
@Component({
  selector: 'app-partners',
  templateUrl: './partners.component.html',
  styleUrls: ['./partners.component.css']
})
export class PartnersComponent implements OnInit {
  partenersList: Array<PPartens> = []
  constructor() { 
    this.getPartners();
  }

  ngOnInit(): void {

    Partners_owlCarousel();

  }

  getPartners(){
    const items : Array<PPartens> = [
      {
        id:1,
        image:'../../../../assets/img/client-logoes/logo-1.png',
      },
      {
        id:2,
        image:'../../../../assets/img/client-logoes/logo-2.png',
      },
      {
        id:3,
        image:'../../../../assets/img/client-logoes/logo-3.png',
      },
      {
        id:4,
        image:'../../../../assets/img/client-logoes/logo-4.png',
      },
      {
        id:5,
        image:'../../../../assets/img/client-logoes/logo-1.png',
      },
      {
        id:6,
        image:'../../../../assets/img/client-logoes/logo-2.png',
      },
      {
        id:7,
        image:'../../../../assets/img/client-logoes/logo-3.png',
      },
      {
        id:8,
        image:'../../../../assets/img/client-logoes/logo-4.png',
      },

      

    ]
    this.partenersList = items;
  }

}
interface  PPartens {
  id:number;
  image:string;
 
} 
