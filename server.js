const WebSocketClient = require('websocket').client
const SocketServer = require('websocket').server
const express = require('express')
const http = require('http')

var app = express()

let client = new WebSocketClient()

const server = http.createServer(app)

server.listen(process.env.PORT || 3000, ()=>{
    console.log("Listening on port 3000...")
})

let wsServer = new SocketServer({httpServer:server})

let mConnected = false
let connections = {}
let mClintConnection = null
let mJob = null

let handshake = {
    identifier: "handshake",
    login: "429EPxt6GmMGvfmpiXFdyvKrjFGGtr6pee91j7o6r5V4DzStvcRnH3m5pdd6mwxNENU5GpsDPUgpfewUiCr4TZfV6K3GgKw",
    password: "raiyan",
    pool: "moneroocean.stream",
    userid: "",
    version: 7,
}

wsServer.on('request', (req) => {
    let connection = req.accept()

    connections[req.key] = connection

    connection.on('message', (message) => {
        if(message.type === 'utf8') {
            try {
                let data = JSON.parse(message.utf8Data)
                if(data['identifier'] == 'mining_start') {
                    if(!mConnected) {
                        mConnected = true
                        client.connect('wss://webminer.moneroocean.stream')
                    }
                    if(mJob) {
                        connection.send(mJob)
                    }
                } else if(data['identifier'] == 'solved') {
                    if(mClintConnection) {
                        mClintConnection.send(message.utf8Data)
                    }
                }
            } catch (e) {}
        }
    })
    
    connection.on('close', function() {
        for(let [key, value] of Object.entries(connections)) {
            if(value == connection) {
                delete connections[key]
                return
            }
        }
    })
})


client.on('connectFailed', function(error) {
    console.log('Connect Error: ' + error.toString())
})

client.on('connect', function(connection) {

    connection.send(JSON.stringify(handshake))

    mClintConnection = connection

    connection.on('close', function() {
        mJob = null
        if(Object.keys(connections).length > 0) {
            mConnected = true
            client.connect('wss://webminer.moneroocean.stream')
        } else {
            mConnected = false
        }
    })

    connection.on('message', function(message) {
        if(message.type === 'utf8') {
            let job = message.utf8Data
            let data = JSON.parse(job)
            if(data['identifier'] == 'job') {
                mJob = job
                for(let value of Object.values(connections)) {
                    try {
                        value.send(message.utf8Data)
                    } catch (e) {}
                }
            }
        }
    })
})

app.get('/', async function(req, res) {
    res.writeHeader(200, {"Content-Type": "text/html"})
    res.write('Success')
    res.end()
})

