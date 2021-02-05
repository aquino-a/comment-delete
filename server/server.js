const https = require('https')
const express = require('express')
const minimist = require('minimist')
const compression = require('compression')
const app = express()

const args = minimist(process.argv.slice(2))
const port = args['port'];
const _app_folder = '../dist/comment-delete'


app.use(compression());

app.get('/api/token', (req, res) => {
    const t = getToken(req.query.code);
    t.then(t =>{
        res.header('Access-Control-Allow-Origin', args['origin'])
        res.status(200).send(t); 
    }).catch(error => {
        res.status(500).send(null);
    });
})

app.get('*.*', express.static(_app_folder, {maxAge: '1y'}));

// ---- SERVE APLICATION PATHS ---- //
app.all('*', function (req, res) {
    res.status(200).sendFile(`/`, {root: _app_folder});
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})


async function getToken(code){
    const data = `grant_type=authorization_code&code=${code}&redirect_uri=${args['redirect']}`

    const options = {
        hostname: 'www.reddit.com',
        port: 443,
        path: '/api/v1/access_token',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': data.length,
            'Authorization': "Basic " + Buffer.from(args['clientId'] + ':' + args['clientSecret']).toString('base64')
        }
    };

    const tokenPromise = () =>{
        return new Promise((resolve) =>{
            const req = https.request(options, res => {
                console.log(`statusCode: ${res.statusCode}`)
                res.on('data', d => {
                  resolve(d);
                })
              });
            req.on('error', error => {
                console.error(error)
            })
            
            req.write(data)
            req.end()
        })
    }
    return tokenPromise();
}




