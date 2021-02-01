import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  private redditUrl = 'https://reddit.com'
  private deleteUrl = '/api/del';


  constructor(private http: HttpClient, private auth: AuthenticationService) { }

  deleteAll(){
    var comments = this.getComments(this.auth.currentUser.username);
    comments.forEach(c => {
      try {
        this.deleteComment(c);
      } catch (error) {
        console.log(error);
      }
    })

  }
  deleteComment(c: Comment) {
    this.http.post(this.redditUrl + this.deleteUrl, null, {
      params: new HttpParams()
                .set('id', c.id)
    })
    .subscribe(o => console.log(o), error => console.log(error));
  }

  getComments(username: string): Comment[] {
    this.http.get<Comment>(this.redditUrl + '/user/${username}/comments', {
      params: new HttpParams()
                  .set("dsd","asdsd")
    });
    throw new Error('Method not implemented.');
  }
}

export interface Comment {
  id: string;
}
