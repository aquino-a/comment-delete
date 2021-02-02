import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from './authentication.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  private redditUrl = 'https://oauth.reddit.com'
  private deleteUrl = '/api/del';


  constructor(private http: HttpClient, private auth: AuthenticationService) { }

  deleteAll(){
    var comments = this.getComments(this.auth.currentUser.name);
    comments.subscribe(cs =>{
      cs.forEach(c => {
        try {
          this.deleteComment(c);
        } catch (error) {
          console.log(error);
        }
      })
    }) 
  }


  deleteComment(c: Comment): Observable<Comment> {
    var ob = this.http.post(this.redditUrl + this.deleteUrl, null, {
      params: new HttpParams()
                .set('id', c.id)
    }).pipe(map(o => c));
    ob.subscribe(o => console.log(o), error => console.log(error));
    return ob;
  }


  getComments(username = this.auth.currentUser.name, after = ""): Observable<Comment[]> {
    return this.http.get<any>(this.redditUrl + '/user/${username}/comments', {
      params: new HttpParams()
                  .set("context","2")
                  .set("show","given")
                  .set("sort","new")
                  .set("t","all")
                  .set("type", "comments")
                  .set("username", username)
                  .set("after", after)
    }).pipe(map(d =>{
      var comments =d.data.children.map(l => {
        return { id: l.data.name, text: l.data.body, time: new Date(l.data.created_utc) }
      });
      return comments;
    }));
  }

}


export interface Comment {
  id: string;
  text: string;
  time: Date;
  isDeleted: boolean;
}




