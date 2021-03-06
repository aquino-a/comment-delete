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
  private commentIds: Set<string> = new Set<string>();
  private deletedCommentIds: Set<string> = new Set<string>();
  private subreddits: Set<string> = new Set<string>();
  private unselectedSubreddits: Set<string> = new Set<string>();

  private lastCount: number;
  private deleteTimer: any;
  private lastLast: string;
  private isFinished = false;

  public skippedCount = 0;
  public scoreLimit = 1;
  public useLimit = false;
  public earlierThan = new Date();
  public useEarlierThan = false;
  public laterThan = new Date();
  public useLaterThan = false;


  public isDeleting = false;


  constructor(private http: HttpClient, private auth: AuthenticationService) { }

  deleteComment = () : Observable<Comment> => {
    if(!this.auth.isAuthenticated()){
      this.toggleDeletion(false);
      return;
    }
    
    var c;
    while(true){
      if(this.comments.length == 0){
        this.getComments();
        return;
      }
      c = this.comments.shift();
      this.commentIds.delete(c.id);
      if(this.IsOkToDelete(c)) {
        break;
      }
      else {
        this.skippedCount++;
      }
    }

    var ob = this.http.post(this.redditUrl + this.deleteUrl, null, {
      params: new HttpParams()
                .set('id', c.id)
    }).pipe(map(o => c));
    ob.subscribe(c => {
      c.isDeleted = true;
      this.deletedComments.unshift(c);
      this.deletedCommentIds.add(c.id);
    }, error => {
      console.log(error);
      this.comments.unshift(c);
      this.commentIds.add(c.id);
    });

    if(this.comments.length < this.lastCount / 2){
      this.getComments();
    }

    return ob;
  }

  IsOkToDelete(c: Comment): boolean {
    if(this.unselectedSubreddits.has(c.subreddit)){
      return false;
    }

    if(this.useLimit && c.score >= this.scoreLimit){
      return false;
    }
    
    if(this.useEarlierThan &&  c.time >= this.earlierThan){
      return false;
    }

    if(this.useLaterThan &&  c.time <= this.laterThan){
      return false;
    }
    
    return true;
  }


  getComments(): Comment[] {

    if(this.auth.currentUser == null){
      return this.comments;
    }

    this.refreshComments();
    return this.comments;
  }


  refreshComments() {

    const username = this.auth.currentUser.name;
    const after = this.lastLast;

    this.http.get<any>(this.redditUrl + '/user/${username}/comments', {
      params: new HttpParams()
                  .set("context","2")
                  .set("show","given")
                  .set("sort","new")
                  .set("t","all")
                  .set("type", "comments")
                  .set("username", username)
                  .set("after", after)
    }).pipe(map(d =>{
      return d.data.children.map(l => {
        return { 
          id: l.data.name, 
          text: l.data.body, 
          score: Number(l.data.score),
          subreddit: l.data.subreddit,
          time: new Date(l.data.created_utc * 1000) 
        }
      });
    })).subscribe(cs => {
      if(cs.length > 0){
        this.lastLast = cs[cs.length - 1].id;

        const filteredComments = cs.filter(c => !this.commentIds.has(c.id) && !this.deletedCommentIds.has(c.id));
        this.comments.push(...filteredComments);
        this.updateSubreddits();
        this.lastCount = this.comments.length;
        filteredComments.forEach(c => this.commentIds.add(c.id));
      } 
      else {
        this.isFinished = true;
        this.toggleDeletion(false);
        this.lastLast = '';
      }
    }, error => {
      console.log(error);
    });
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

  toggleDeletion(isEnabled: boolean = false){
    if(isEnabled){
      this.isDeleting = true;
      this.deleteTimer = setInterval(this.deleteComment, 2000);
      if(this.isFinished){
        this.skippedCount = 0;
        this.isFinished = false;
      }
    }
    else {
      this.isDeleting = false;
      clearInterval(this.deleteTimer);
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




