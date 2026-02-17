import { Component, Input, OnInit } from '@angular/core';
import { ViewPostComponent } from 'src/app/pages/view-post/view-post.component';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit {
@Input() data:any;
@Input() comments:Array<any>
@Input() viewParent:ViewPostComponent;
currentComments:Array<any>
  constructor() { }

  ngOnInit(): void {
    this.currentComments=this.comments.filter((item)=>{if(item.ParentReplyId==this.data.ReplyId && !item.IsAdmin) return true}).sort(
      (a,b)=>{return b.ReplyId- a.ReplyId}
    )

  }
 
  replay(){
    this.viewParent.replayData=this.data;
  }
  delete(){
  let c=confirm('Are you sure you want to delete the record?');
  if(c){
    this.viewParent.deleteComments(this.data)
  }
  }
}
