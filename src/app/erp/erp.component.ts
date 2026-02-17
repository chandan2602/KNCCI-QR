import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IObject } from '../components/shared/models/course';

@Component({
  selector: 'app-erp',
  templateUrl: './erp.component.html',
  styleUrls: ['./erp.component.css']
})
export class ERPComponent implements OnInit {
  categoryList: Array<IObject> = [];
  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    window.scrollTo({ top: 0 });
    if (sessionStorage.categoryList) {
      this.categoryList = JSON.parse(sessionStorage.categoryList);
      sessionStorage.removeItem('categoryList');
    }
  }
  categoryChanged(categoryId: number) {
    
  }

}
