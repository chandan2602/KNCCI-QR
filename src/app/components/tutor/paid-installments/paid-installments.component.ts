import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-paid-installments',
  templateUrl: './paid-installments.component.html',
  styleUrls: ['./paid-installments.component.css']
})
export class PaidInstallmentsComponent implements OnInit {
  @Input() InstallmentList = [];
  @Output() modelCloseEvent = new EventEmitter<boolean>();
  constructor() { }

  ngOnInit(): void {
  }

  closeModel() {
    this.modelCloseEvent.emit(false);
  }

}
