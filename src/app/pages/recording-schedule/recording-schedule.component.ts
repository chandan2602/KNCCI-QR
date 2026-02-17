import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
@Component({
  selector: 'app-recording-schedule',
  templateUrl: './recording-schedule.component.html',
  styleUrls: ['./recording-schedule.component.css']
})
export class RecordingScheduleComponent implements OnInit {
  @Input() RecordingList = [];
  @Input() recordingList = [];
  @Output() closeModelEvent: EventEmitter<boolean> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
    document.getElementById('btnOpenModel').click();
  }


  close() {
    this.closeModelEvent.emit(false);
  }

}
