import { Component, Input, OnInit } from '@angular/core';
import { CommentService, Comment } from '../service/comment.service';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.css']
})
export class DeleteComponent implements OnInit {

  comments: Comment[];
  deletedComments: Comment[];
  subreddits: Set<string>;

  constructor(private comment: CommentService) {
    this.getComments();
  }

  ngOnInit(): void {
  }

  delete(count: number): void{
    count = Number(count);
    for (let i = 0; i < count; i++) {
      this.comment.deleteComment();
    }
  }

  getComments(){
    this.comments = this.comment.getComments();
    this.deletedComments = this.comment.getDeletedComments();
    this.subreddits = this.comment.getSubreddits();
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
