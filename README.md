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
#### Image Build

First, create a `./set-secrets.sh` script based on `./set-secrets.sh.sample`.

Second, create `environment.ts` following `environment.ts.sample`.

Change the base href in the `package.json` `build` script if needed.

Run `./build-image.sh` to build an image based on ubi8/nodejs-minimal.


#### Start

Create a container using the built image.

