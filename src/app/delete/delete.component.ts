import { Component, Input, OnInit } from '@angular/core';
import { CommentService, Comment } from '../service/comment.service';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.css']
})
export class DeleteComponent implements OnInit {

  comments: Comment[];

  constructor(comment: CommentService) { 
    comment.getComments().subscribe(cs => this.comments = cs);
  }

  ngOnInit(): void {
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
