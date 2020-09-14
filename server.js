const http = require('http')
const fs = require('fs')
const qs = require('querystring')
const path = require('path')

let customPlaylist = []

const readFiles = (action, albumNumber) => {
    return new Promise((resolve, reject) => {
        fs.readdir(__dirname + "/static/mp3", (err, files) => {
            if (err) reject()
            let dirs = []
            let filesArray = []
            files.forEach(fileName => dirs.push(fileName))
            if (action === "FIRST") {
                if (dirs.length == 0) resolve({ "dirs": [], "files": [] })
                else {
                    fs.readdir(__dirname + "/static/mp3/" + dirs[0], (err, files) => {
                        files.forEach(fileName => filesArray.push({ "name": fileName, "size": fs.statSync(__dirname + "/static/mp3/" + dirs[0] + "/" + fileName).size }))
                        resolve({ "dirs": dirs, "files": filesArray })
                    })
                }
            }
            else if (action === "NEXT") {
                if (dirs.length <= albumNumber) resolve({ "dirs": [], "files": [] })
                else {
                    fs.readdir(__dirname + "/static/mp3/" + dirs[albumNumber], (err, files) => {
                        files.forEach(fileName => filesArray.push({ "name": fileName, "size": fs.statSync(__dirname + "/static/mp3/" + dirs[albumNumber] + "/" + fileName).size }))
                        resolve({ "files": filesArray })
                    })
                }
            }
        })
    })
}

const servResponse = (req, res) => {
    let body = ""
    req.on('data', data => {
        body += data
    })
    req.on('end', data => {
        let parsedBody = qs.parse(body)
        switch (parsedBody.action) {
            case "FIRST":
            case "NEXT":
                readFiles(parsedBody.action, parsedBody.albumNumber).then(
                    result => {
                        console.log(result)
                        res.writeHead(200, { 'Content-Type': 'application/json' })
                        res.end(JSON.stringify(result))
                    }) //error => console.error(error))
                break
            case "SAVE":
                customPlaylist.push(JSON.parse(parsedBody.file))
                console.log(customPlaylist)
                res.writeHead(200, { 'Content-Type': 'text/plain' })
                res.end()
                break
            case "LOAD":
                res.writeHead(200, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify(customPlaylist))
                break
            default:
                res.end()
        }
    })
}

const server = http.createServer((req, res) => {
    switch (req.method) {
        case "GET":
            const filePath = '.' + decodeURI(req.url)
            const fileExt = String(path.extname(filePath)).toLowerCase()
            if (req.url === "/") {
                fs.readFile("./static/index.html", (error, data) => {
                    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
                    res.end(data)
                })
            }
            else if (fileExt === ".js") {
                fs.readFile(filePath, (error, data) => {
                    res.writeHead(200, { 'Content-Type': 'application/javascript' })
                    res.end(data)
                })
            }
            else if (fileExt === ".css") {
                fs.readFile(filePath, (error, data) => {
                    res.writeHead(200, { 'Content-Type': 'text/css' })
                    res.end(data)
                })
            }
            else if (fileExt === ".jpg") {
                fs.readFile(filePath, (error, data) => {
                    res.writeHead(200, { 'Content-Type': 'image/jpeg' })
                    res.end(data)
                })
            }
            else if (fileExt === ".mp3") {
                fs.readFile(filePath, (error, data) => {
                    res.writeHead(200, { "Content-type": "audio/mp3" })
                    res.end(data)
                })
            }
            else if (fileExt === ".png") {
                fs.readFile(filePath, (error, data) => {
                    res.writeHead(200, { 'Content-Type': 'image/png' })
                    res.end(data)
                })
            }
            break
        case "POST":
            servResponse(req, res)
            break
    }
})
server.listen(3000)
