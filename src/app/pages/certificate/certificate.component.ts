import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as moment from 'moment';
import jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-certificate',
  templateUrl: './certificate.component.html',
  styleUrls: ['./certificate.component.css']
})
export class CertificateComponent implements OnInit {
  @Output() closeCertificateEvent = new EventEmitter<any>();
  @Input() certificateInfo: any = { COURSE_NAME: '', COURSESHD_STARTDATE: '', COURSESHD_ENDDATE: '', DURATION: '', SIGNATURE: '', COURSESHD_ID: '' };

  SIGNATURE = "../../../assets/img/Shiksion Certificate-SIG.png";
  constructor() {
  }

  ngOnInit(): void {

    this.certificateInfo.DURATION = this.getDuration(this.certificateInfo.COURSESHD_STARTDATE, this.certificateInfo.COURSESHD_ENDDATE);
    this.certificateInfo.COURSE_NAME = this.certificateInfo.COURSE_NAME.toUpperCase();
    this.certificateInfo.COURSESHD_STARTDATE = this.getDate(this.certificateInfo.COURSESHD_STARTDATE);
    this.certificateInfo.COURSESHD_ENDDATE = this.getDate(this.certificateInfo.COURSESHD_ENDDATE);
    this.certificateInfo.SIGNATURE = this.certificateInfo.SIGNATURE || this.SIGNATURE;
    console.clear();
    console.log(this.certificateInfo);

    setTimeout(() => this.companyDetails(), 10);
  }

  getDuration(fromDate: string, toDate: string): string {
    return this.calcDate(this.changeDateTime(fromDate), this.changeDateTime(toDate)).result;
  }

  getDate(oldDate: string): string {
    return this.changeDateTime(oldDate, 'DD-MM-YYYY');
  }

  changeDateTime(propertyVal: string, dateFormat: string = 'MM-DD-YYYY'): string {
    let newDate: string = '';
    newDate = moment(propertyVal).format(dateFormat);
    return newDate;
  }

  calcDate(date1, date2) {
    /*
    * calcDate() : Calculates the difference between two dates
    * @date1 : "First Date in the format MM-DD-YYYY"
    * @date2 : "Second Date in the format MM-DD-YYYY"
    * return : Array
    */

    //new date instance
    const dt_date1 = new Date(date1);
    const dt_date2 = new Date(date2);

    //Get the Timestamp
    const date1_time_stamp = dt_date1.getTime();
    const date2_time_stamp = dt_date2.getTime();

    let calc;

    //Check which timestamp is greater
    if (date1_time_stamp > date2_time_stamp) {
      calc = new Date(date1_time_stamp - date2_time_stamp);
    } else {
      calc = new Date(date2_time_stamp - date1_time_stamp);
    }
    //Retrieve the date, month and year
    const calcFormatTmp = calc.getDate() + '-' + (calc.getMonth() + 1) + '-' + calc.getFullYear();
    //Convert to an array and store
    const calcFormat: any = calcFormatTmp.split("-");
    //Subtract each member of our array from the default date
    const days_passed = Number(Math.abs(calcFormat[0]) - 1);
    const months_passed = Number(Math.abs(calcFormat[1]) - 1);
    const years_passed = Number(Math.abs(calcFormat[2]) - 1970);

    //Set up custom text
    const yrsTxt = ["year", "years"];
    const mnthsTxt = ["month", "months"];
    const daysTxt = ["day", "days"];

    //Convert to days and sum together
    const total_days = (years_passed * 365) + (months_passed * 30.417) + days_passed;
    const total_secs = total_days * 24 * 60 * 60;
    const total_mins = total_days * 24 * 60;
    const total_hours = total_days * 24;
    const total_weeks = total_days / 7;

    //display result with custom text
    const result = ((years_passed == 1) ? years_passed + ' ' + yrsTxt[0] + ' ' : (years_passed > 1) ?
      years_passed + ' ' + yrsTxt[1] + ' ' : '') +
      ((months_passed == 1) ? months_passed + ' ' + mnthsTxt[0] : (months_passed > 1) ?
        months_passed + ' ' + mnthsTxt[1] + ' ' : '') +
      ((days_passed == 1) ? days_passed + ' ' + daysTxt[0] : (days_passed > 1) ?
        days_passed + ' ' + daysTxt[1] : '');

    //return the result
    return {
      "total_days": Math.round(total_days),
      "total_weeks": Math.round(total_weeks),
      "total_hours": Math.round(total_hours),
      "total_minutes": Math.round(total_mins),
      "total_seconds": Math.round(total_secs),
      "result": result.trim()
    }

  }

  convetToPDF() {
    var data: any = document.getElementById('cerficateimage_path');
    html2canvas(data).then((canvas: any) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jspdf({
        orientation: 'landscape',
      });
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${this.certificateInfo.COURSE_NAME}.pdf`);

    });

  }

  closeModel() {
    this.closeCertificateEvent.emit(true);
  }


  companyDetails() {
    const { fileUrl } = environment;
    if (sessionStorage.cerficateimage_path) {
      document.getElementById("cerficateimage_path")?.setAttribute("src", `${fileUrl}${sessionStorage.cerficateimage_path} `);

    }
  }

}
