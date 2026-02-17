import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent implements OnInit {
  type!: string;
  id: any;
  paymentData: any = {};
  invoiceList: Array<any> = [];
  num1: any = this.paymentData.course_fees * 18 / 100 + this.paymentData.course_fees;
  num: any;
  word: any;
  words: any;
  date: any = new Date();
  roleId: any;
  userid: any;
  isPrint: boolean = false;

  constructor(private route: Router, private CommonService: CommonService, private activatedRoute: ActivatedRoute, private toastr: ToastrService) {

    activatedRoute.queryParams.subscribe((res) => {
      if (res) {
        console.log(res.invoiceId);
        this.getInvoiceDetails(atob(res.invoiceId));
      }
    });
  }

  ngOnInit(): void {

  }

  // send() {
  //   this.route.navigate(['invoice/' + this.type ?? 'single'], { queryParams: { ID: this.id } })

  // }


  numberToWords(num: any) {

    let a = ['', 'ONE ', 'TWO ', 'THREE ', 'FOUR ', 'FIVE ', 'SIX ', 'SEVEN ', 'EIGHT ', 'NINE ', 'TEN ', 'ELEVEN ', 'TWELVE ', 'THIRTEEN ', 'FOURTEEN ', 'FIFTEEN ', 'SIXTEEN ', 'SEVENTEEN ', 'EIGHTEEN ', 'NINETEEN '];
    let b = ['', '', 'TWENTY', 'THIRTY', 'FORTY', 'FIFTY', 'SIXTY', 'SEVENTY', 'EIGHTY', 'NINETY'];

    if ((num = num?.toString())?.length > 9)
      return 'overflow';
    let n: any = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return '';
    let str = '';

    str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'CRORE ' : '';
    str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'LAKH ' : '';
    str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'THOUSAND ' : '';
    str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'HUNDRED ' : '';
    str += (n[5] != 0) ? ((str != '') ? 'AND ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + 'RUPEES ONLY ' : '';
    return str;

  }

  print() {
    var printContents: any = document.getElementById("print")?.innerHTML;
    var originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  }

  getInvoiceDetails(params: string) {
    this.CommonService.getCall(`CourseSchedule/Invoice/${params}`).subscribe((res: any) => {
      this.invoiceList = res.data;
      const amt = (this.invoiceList[0].courseshd_amount) * 18 / 100 + this.invoiceList[0].courseshd_amount;
      this.words = this.numberToWords(parseInt(amt));
      console.log(this.words);
    });
  }

}
