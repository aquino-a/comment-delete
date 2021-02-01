const https = require('https')
const express = require('express')
const app = express()
const port = 8080

app.get('/', (req, res) => {
    res.send(JSON.stringify({token: getToken(req.query.code)})); 
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})


async function getToken(code){
    const data = JSON.stringify({
        grant_type: 'code',
        code: code,
        redirect_uri: 'http://localhost:4200/login'
      });

    const options = {
        hostname: 'www.reddit.com',
        port: 443,
        path: '/api/v1/access_token',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': data.length,
            'Authorization': "Basic " + Buffer.from('').toString('base64')
        }
    };

    const tokenPromise = async () =>{
        return new Promise((resolve) =>{
            const req = https.request(options, async res => {
                console.log(`statusCode: ${res.statusCode}`)
                await res.on('data', d => {
                  process.stdout.write(d)
                  resolve(data);
                })
              });
            req.on('error', error => {
            console.error(error)
            })
            
            req.write(data)
            req.end()
        })
    }
    return await tokenPromise();
}




