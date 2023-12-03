const { createProxyMiddleware } = require('http-proxy-middleware')
const express = require('express')
const request = require('request')

const app = express()

let mCreate = {}

let port = process.env.PORT

let startTime = new Date().toUTCString()


app.listen(port || 3000, ()=>{
    console.log('Listening on port '+port+'/3000')
})

app.use('/', (req, res, next) => {
    let url = req.url
    try {
        let http = 'http://'
        if (url.startsWith('http://')) {
            url = url.substring(7, url.length)
        } else if (url.startsWith('https://')) {
            http = 'https://'
            url = url.substring(8, url.length)
        }
        url = url.substring(0, url.indexOf('/'))

        if (url && url.length > 5) {
            url = http+url
        } else {
            url = null
        }
    } catch (error) {}

    if (url) {
        if (mCreate[url] == null) {
            mCreate[url] = 'x'
            app.use(createProxyMiddleware({ target: url, changeOrigin: true }))
        }
    }
    next()
})


app.get('/', async function (req, res) {
    res.end(startTime)
})

app.get('/ip', async function (req, res) {
    request({
        url: 'https://ifconfig.me/ip'
    }, function (error, response, body) {
        if (!error) {
            res.end(body)
        } else {
            res.end('Error')
        }
    })
})
