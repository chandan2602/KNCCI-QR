import { Component, OnInit } from '@angular/core';
declare const TestMonials_owlCarousel: any;
@Component({
  selector: 'app-test-monials',
  templateUrl: './test-monials.component.html',
  styleUrls: ['./test-monials.component.css']
})
export class TestMonialsComponent implements OnInit {
  testMonialsList: Array<TMonials> = [];
  constructor() {
    this.getTestMonials();
  }

  ngOnInit(): void {
    TestMonials_owlCarousel();
  }

  getTestMonials() {
    const monials: Array<TMonials> = [
      {
        id: 1,
        name: 'What did they say',
        image: '../../../../assets/img/aboutus-img.png',
        description: 'Higher education in the era of the industrial revolution 4.0 requires break through learning using digital platforms that answer the challenges of millennial students to study anywhere, anytime and with leading-edge ICT technology. From student recruitment to teaching and learning administration processes,',
        name1: 'Brain Patton',
        designation: '',
      },
      {
        id: 2,
        name: 'What did they say',
        image: '../../../../assets/img/about-img.png',
        description: 'Learning is all about how far your imagination can go and that can only happen when there is variety in learning. OUK helps in providing learning in all domains for students, teachers and professionals for self growth and development',
        name1: 'Aravind Manjrekar',
        designation: 'Designer at Saleforce',
      },
      // {
      //   id: 3,
      //   name: 'What did they say',
      //   image: '../../../../assets/img/aboutus-img.png',
      //   description: 'Higher education in the era of the industrial revolution 4.0 requires break through learning using digital platforms that answer the challenges of millennial students to study anywhere, anytime and with leading-edge ICT technology. From student recruitment to teaching and learning administration processes,',
      //   name1: 'Brain Patton',
      // },
      // {
      //   id: 4,
      //   name: 'What did they say',
      //   image: '../../../../assets/img/about-img.png',
      //   description: 'Higher education in the era of the industrial revolution 4.0 requires break through learning using digital platforms that answer the challenges of millennial students to study anywhere, anytime and with leading-edge ICT technology. From student recruitment to teaching and learning administration processes,',
      //   name1: 'Brain Patton',
      // },
    ];
    this.testMonialsList = monials;
  }
}
interface TMonials {
  id: number;
  name: string;
  image: string;
  description: string;
  name1: string;
  designation: string;
}