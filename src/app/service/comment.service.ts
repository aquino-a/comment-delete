import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from './authentication.service';
import { last, map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  
  private redditUrl = 'https://oauth.reddit.com'
  private deleteUrl = '/api/del';
  private comments: Comment[] = [];
  private deletedComments: Comment[] = [];
  private subreddits: Set<string> = new Set<string>();
  private unselectedSubreddits: Set<string> = new Set<string>();

  private lastCount: number;
  public skippedCount: number = 0;
  public scoreLimit: number = Number.MAX_VALUE;

  constructor(private http: HttpClient, private auth: AuthenticationService) { }

  deleteComment(): Observable<Comment> {
    for(var c = this.comments.shift();
     this.unselectedSubreddits.has(c.subreddit)  || c.score >= this.scoreLimit; 
     this.skippedCount++, c = this.comments.shift()) {
        if(c == null || c == undefined){
          this.getComments();
          return;
        }
    }

    var ob = this.http.post(this.redditUrl + this.deleteUrl, null, {
      params: new HttpParams()
                .set('id', c.id)
    }).pipe(map(o => c));
    ob.subscribe(c => {
      c.isDeleted = true;
      this.deletedComments.unshift(c);
    }, error => {
      console.log(error);
      this.comments.unshift(c);
    });

    if(this.comments.length < this.lastCount / 2){
      this.getComments();
    }

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
        this.updateSubreddits();
        this.lastCount = this.comments.length;
      });
    }
    return this.comments;
  }


  getDeletedComments(): Comment[] {
    return this.deletedComments;
  }

  getSubreddits(): Set<string> {
    return this.subreddits;
  }

  updateSubreddits(){
    this.comments.map(c => c.subreddit).forEach(sr => this.subreddits.add(sr));
  }

  getunselectedSubreddits(): Set<string> {
    return this.unselectedSubreddits;
  }

  toggleSelection(subreddit: string){
    if(this.unselectedSubreddits.has(subreddit)){
      this.unselectedSubreddits.delete(subreddit);
    }
    else if(this.unselectedSubreddits.size + 1 < this.subreddits.size) {
      this.unselectedSubreddits.add(subreddit);
    }
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

export interface Subreddit {
  name: string;
  isSelected: boolean;
}




