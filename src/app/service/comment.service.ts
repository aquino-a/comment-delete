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


  private newCommentSource = new BehaviorSubject<Comment>(null);
  newComment$ = this.newCommentSource.asObservable();
  

  constructor(private http: HttpClient, private auth: AuthenticationService) { }

  deleteAll(){
    // var comments = this.getComments(this.auth.currentUser.name);
    // comments.subscribe(cs =>{
    //   cs.forEach(c => {
    //     try {
    //       this.deleteComment(c);
    //     } catch (error) {
    //       console.log(error);
    //     }
    //   })
    // }) 
  }


  deleteComment(c: Comment): Observable<Comment> {
    var ob = this.http.post(this.redditUrl + this.deleteUrl, null, {
      params: new HttpParams()
                .set('id', c.id)
    }).pipe(map(o => c));
    ob.subscribe(c => console.log(o), error => console.log(error));
    return ob;
  }

  delete(count: number) {
    for (let i = 0; i < count; i++) {
      var shifted = this.comments.shift();
      this.deleteComment(shifted)
        .subscribe(c => {
          c.isDeleted = true;
          this.deletedComments.unshift(c);
        }, error => {
          this.comments.unshift(shifted);
          console.log(error);
        });
    }
    throw new Error('Method not implemented.');
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
          return { id: l.data.name, text: l.data.body, time: new Date(l.data.created_utc) }
        });
      })).subscribe(cs => {
        this.comments.push(...cs);
      });
    }
    return this.comments;
  }


  getDeletedComments(): Comment[] {
    throw new Error('Method not implemented.');
  }


}


export interface Comment {
  id: string;
  text: string;
  time: Date;
  isDeleted: boolean;
}




