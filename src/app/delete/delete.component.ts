import { Component, Input, OnInit } from '@angular/core';
import { CommentService, Comment } from '../service/comment.service';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.css']
})
export class DeleteComponent implements OnInit {

  comments: Comment[];
  deletedComments: Comment[] = [ {id:"asdsd", isDeleted: true, time: new Date(), text: "HEYEYEYEY"} ];

  constructor(private comment: CommentService) { 
    this.getComments();
  }

  ngOnInit(): void {
  }

  delete(count: number): void{
    count = Number(count);
    for (let i = 0; i < count; i++) {
      var shifted = this.comments.shift();
      this.comment.deleteComment(shifted)
        .subscribe(c => {
          c.isDeleted = true;
          this.deletedComments.unshift(c);
        }, error => {
          this.comments.unshift(shifted);
          console.log(error);
        });
    }
  }

  getComments(){
    this.comment.getComments().subscribe(cs => {
      if(this.comments == null){
        this.comments = cs;
      }
      else {
        this.comments.concat(cs);
      }
    });
  }
}


@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./delete.component.css']
})
export class CommentComponent {
  @Input() comment: Comment;
}
