# Comment Delete
## _Delete your Reddit comments_

Comment Delete is a web tool for deleting your Reddit comments.
 It was made using [Angular 9](https://angular.io),
  [Node](https://nodejs.org), and
   [Express](https://expressjs.com).
    It interacts with Reddit's [API](https://www.reddit.com/dev/api/oauth)
     after authenticating via [OAuth](https://github.com/reddit-archive/reddit/wiki/OAuth2). 
   
## Features

- Deletes Reddit comments without using your password.
- Can filter comments to delete by subreddit, karma score, or by the date.
- Shows queued comments to be deleted and deleted comments.
- Shows the count of queued, deleted, and skipped comments.
- Amount of comments you can delete is not limited.

## Installation
#### Build

First, create `run.bat` / `run.sh` following `run.bat.sample` 
Fill in the correct data for the node server. This is the startup script that runs the node server.
It also has all of the required runtime arguments like redirect url and reddit application client id.

Second, create `environment.ts` following `environment.ts.sample`
Fill in the correct data for the angular app. This contains the reddit client id

Make sure to install the dependencies like so:
 ```sh
 npm i
 ```
Then you can build the project:
 ```sh
 ng build
 ```

#### Start

 ```sh
 npm start
 ```
This will run the bat file you created.

