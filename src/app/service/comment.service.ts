import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from './authentication.service';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
 
  private redditUrl = 'https://oauth.reddit.com'
  private deleteUrl = '/api/del';
  private comments: Comment[] = [];
  private deletedComments: Comment[] = [];


  constructor(private http: HttpClient, private auth: AuthenticationService) { }

  deleteComment(c: Comment = this.comments.shift()): Observable<Comment> {
    var ob = this.http.post(this.redditUrl + this.deleteUrl, null, {
      params: new HttpParams()
                .set('id', c.id)
    }).pipe(map(o => c));
    ob.subscribe(c => {
      c.isDeleted = true;
      this.deletedComments.unshift(c);
    }, error => console.log(error));
    return ob;
  }


  getComments(username = this.auth.currentUser.name): Comment[] {
    if(this.comments.length == 0){
      this.http.get<any>(this.redditUrl + '/user/${username}/comments', {
        params: new HttpParams()
                    .set("context","2")
                    .set("show","given")
                    .set("sort","new")
                    .set("t","all")
                    .set("type", "comments")
                    .set("username", username)
                    .set("after", this.comments.length > 0 ? this.comments[this.comments.length - 1].id : "")
      }).pipe(map(d =>{
        return d.data.children.map(l => {
          return { 
            id: l.data.name, 
            text: l.data.body, 
            score: Number(l.data.score),
            subreddit: l.data.subreddit,
            time: new Date(l.data.created_utc) 
          }
        });
      })).subscribe(cs => {
        this.comments.push(...cs);
      });
    }
    return this.comments;
  }


  getDeletedComments(): Comment[] {
    return this.deletedComments;
  }


}


export interface Comment {
  id: string;
  text: string;
  time: Date;
  score: Number;
  subreddit: string;
  isDeleted: boolean;
}




