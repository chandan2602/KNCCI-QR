import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import { forkJoin, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { CommonService } from '../services/common.service';


@Injectable()
export class CoursesResolver implements Resolve<any> {
  courseData: any;
  constructor(private CommonService: CommonService) {
    // this.getCompanyDetails();
    console.log("constructor");
  }

  resolve() {
    // const { company_id = 0 } = sessionStorage;
    // const GetAllCategories = this.CommonService.getCall('GetAllCategories');
    // const GetAllCoursesByTrending = this.CommonService.getCall('GetAllCoursesByTrending', `/true/${+company_id}`);
    // const GetAllCoursesByCategoryId = this.CommonService.getCall('GetAllCoursesByCategoryId', `/0/${+company_id}`);
    // this.courseData = forkJoin([GetAllCategories, GetAllCoursesByTrending, GetAllCoursesByCategoryId]);

    const { company_id = 0 } = sessionStorage;
    const GetAllCategories = this.CommonService.getCall('Registration/GetCompanyList');
    // const GetAllCategories = this.CommonService.getCall('GetAllCategories');
    this.courseData = forkJoin([GetAllCategories]);
    console.log("resolve");

    return this.courseData;
  }

  getCompanyDetails() {
    sessionStorage.isDomain = false;
    const { fileUrl } = environment;
    let { hostname } = location;
    if (["localhost", "shiksion.com"].includes(hostname))
      return;

    this.CommonService.getCall(`account/IsSubDomainExists/${hostname}`).subscribe((res: any) => {
      if (res.data == true) {
        this.CommonService.getCall(`account/GetCompanyDetails/${hostname}`).subscribe((res: any) => {
          if (res.data.length > 0) {
            sessionStorage.isDomain = true;
            sessionStorage.company_id = res.data[0].company_id;
            if (res.data[0].cerficateimage_path)
              sessionStorage.cerficateimage_path = res.data[0].cerficateimage_path;
            if (res.data[0].favicon_path)
              sessionStorage.favicon_path = res.data[0].favicon_path;
            if (res.data[0].homepageimage_path)
              sessionStorage.homepageimage_path = res.data[0].homepageimage_path;
            if (res.data[0].landingpageimage_path)
              sessionStorage.landingpageimage_path = res.data[0].landingpageimage_path;
            if (sessionStorage.favicon_path) {
              document.getElementById("appFavcon")?.setAttribute("href", `${fileUrl}${res.data[0].favicon_path}`);
            }
            // document.getElementById("homepageimage_path")
            console.log("constructor");

          }
        });
      }

    });



  }
}


// If error occurs, this resolve error method won't redirect user to component

// resolve() {
//    return this.usersListService.getUsers().pipe(
//       catchError((error) => {
//          return empty();
//       })
//    )
// }