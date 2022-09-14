const express = require('express')
const { createProxyMiddleware } = require('http-proxy-middleware')

var app = express()

app.use(createProxyMiddleware('wss://webminer.moneroocean.stream/', {
    changeOrigin: true,
    ws: true
}))

app.listen(process.env.PORT || 3000, () => {
    console.log('Listening on port 3000 ...')
})

app.get('/', async function(req, res) {
    res.writeHeader(200, {"Content-Type": "text/html"})
    res.write('Success')
    res.end()
})

