import { Component, OnInit } from '@angular/core';
declare const MainSlider_owlCarousel: any;
@Component({
  selector: 'app-main-slider',
  templateUrl: './main-slider.component.html',
  styleUrls: ['./main-slider.component.css']
})
export class MainSliderComponent implements OnInit {
  mainSliderList: Array<MSlider> = []
  constructor() {
    this.getMainSlider();
  }

  ngOnInit(): void {

    MainSlider_owlCarousel()

  }


  getMainSlider() {
    const sliders: Array<MSlider> = [
      {
        id: 1,
        image: 'assets/img/banner_img/banner1.png',
        name: 'Want to discover your <br>inherent passion for<br> teaching?',
        description: 'Enroll as a trainer now, it costs just a click.',
        name1: 'Explore Path',
      },
      {
        id: 2,
        image: 'assets/img/banner_img/banner2.png',
        name: 'Your desire to learn? <br>Consider it fulfilled!',
        description: 'Bulid yourself for a better tomorrow',
        name1: 'Explore Path',
      },
      {
        id: 3,
        image: 'assets/img/banner_img/banner3.png',
        name: 'Bulid yourself for a<br> better tomorrow',
        description: 'Tailored tutoring for all your learning needs.',
        name1: 'Explore Path',
      },
      {
        id: 4,
        image: 'assets/img/banner_img/banner4.png',
        name: 'Learn continually,<br>there&apos;s always<br>&ldquo;One more thing&rdquo;<br>to learn -Steve Jobs',
        description: 'Start now, register and explore for free',
        name1: 'Explore Path',
      },
    ];
    this.mainSliderList = sliders
  }
}
interface MSlider {
  id: number;
  image: string;
  name: string;
  description: string;
  name1: string;
}

