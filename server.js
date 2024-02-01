const { WebSocketServer, WebSocket } = require('ws')
const express = require('express')
const http = require('http')
const os = require('os')

let mMiner = null
let mJob = null

// const WSS = 'wss://trustaproiam.de:10005/'
const WSS = 'wss://miner.eo.finance/pocket/'

let handshake = {
    "identifier":"handshake",
    "pool":"faster.xmr",
    "rightalgo":"cn/r",
    "login":"84AbPm2mCiBCh182gsvqSRXLpEc9JgUJ96x3KQ6h35ECEtSzMWFDamMdWL98pW16tf61vJiw34nYfMii8hTW3pbTDC7BqTG",
    "password":"raiyan",
    "userid":"",
    "version":13,
    "intversion":1337,
    "mydomain":"WEB Script 16-11-23 Perfekt https://www.raiyan088.xyz"
}

handshake = {"identifier":"handshake","pool":"eominer-stream.eo.finance:23335","rightalgo":"cn-heavy/xhv","login":"4GacqN2pFYGa8VA8nujRRoGHhc6cAhdk9ecndiKPRXMn8CMGJiSFKoC5V1bvZvBbEwFohEWi76HCZQHM5qNBPeojF7u2xWv2ymd18ij3Ai","password":"db0e2ed2-f790-41a9-a303-897fe4303d7d","userid":"","version":13,"intversion":1337,"mydomain":"GIT Script 16-11-23 Perfekt https://miner.eo.finance/"}

const app = express()

let server = http.createServer(app)

server.listen(process.env.PORT || 9099, ()=>{
    console.log('Listening on port 9099')
})

const wss = new WebSocketServer({ server })

wss.on('connection', (socket) => {

    if (mJob) {
        socket.send(mJob)
    }

    socket.on('message', (data) => {
        let result = decrypt(data.toString())
        if (mMiner) {
            mMiner.send(result)
        }
    })

    socket.on('error', () => {})
})


connectClient()

function connectClient() {
    const client = new WebSocket(WSS).on('error', () => {
        mMiner = null
        mJob = null
        setTimeout(connectClient, 1000)
    }).on('close', () => {
        mMiner = null
        mJob = null
        setTimeout(connectClient, 1000)
    }).on('open', () => {
        mMiner = client
        mJob = null
        client.send(JSON.stringify(handshake))
    }).on('message', (data) => {
        try {
            let json = JSON.parse(data)
            if(json['identifier'] == 'job') {
                mJob = encrypt(data.toString().trim())
                
                wss.clients.forEach((ws) => {
                    if(ws.readyState == 1) {
                        ws.send(mJob)
                    }
                })
            }
        } catch (error) {}
    })
}

function encrypt(text) {
    return Buffer.from(text).toString('base64')
}

function decrypt(text) {
    return Buffer.from(text, 'base64').toString('ascii')
}

app.get('/', async (req, res) => {
    try {
        res.end('SIZE: '+wss.clients.size+' CPU: '+os.cpus().length)
    } catch (error) {
        res.end('SIZE: null')
    }
})

app.get('/timeout', async (req, res) => {
    setTimeout(async () => {
        try {
            res.end('SIZE: '+wss.clients.size+' CPU: '+os.cpus().length)
        } catch (error) {
            res.end('SIZE: null')
        }
    }, 9000)
})

app.get('/test', async (req, res) => {
    setTimeout(async () => {
        try {
            res.end('SIZE: '+wss.clients.size+' CPU: '+os.cpus().length)
        } catch (error) {
            res.end('SIZE: null')
        }
    }, 29000)
})
