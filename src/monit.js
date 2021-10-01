const path = require('path')
const fs = require('fs')
const {
    datapath
} = require('../config/config')
const moment = require('moment')
const tz = require('moment-timezone')

var dropdownList = ''
for (let i = 0; i < datapath.length; i++) {
    dropdownList = dropdownList + `<li><a class="dropdown-item" href="#">${datapath[i].label}</a></li>`
}

module.exports = {
    viewpage: (req, res) => {
        res.render('monit', {
            page: 'monit',
            menuId: 'monit',
            dropdownList: dropdownList,
            dropdownListLength: datapath.length
        })
    },
    logfiles: (req, res) => {
        const pathIndex = req.query.index
        if (pathIndex === undefined) {
            res.status(200).json([])
        } else {
            const logPath = datapath[pathIndex].path
            var retval = []
            fs.readdir(logPath, (err, files) => {
                if (err) {
                    res.status(200).json([])
                } else {
                    // filter ekstensi log
                    let logFiles = files.filter(el => path.extname(el) === '.log')
                    logFiles.forEach(file => {
                        let stats = getStat(logPath + '/' + file)
                            // console.log(stats)
                        if (stats !== undefined) {
                            let size = (stats.size / 1024).toFixed(3)
                            let datemod = moment(stats.mtime).tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm')
                            let birthTime = stats.birthtimeMs
                            let now = new Date().valueOf()
                                // console.log(now - birthTime)
                            retval.push({
                                name: file,
                                size: size.toString() + ' KB',
                                age: msToTime(now - birthTime),
                                datemod: datemod
                            })
                        }
                    })
                    res.status(200).json(retval)
                }
            })
        }
    },
    downloadFile: (req, res) => {
        const name = req.query.name
        const pathIndex = req.query.index
        if (pathIndex === undefined) {
            res.status(404).send('File not found.')
        } else {
            let logPath = datapath[pathIndex].path
            let file = `${logPath}/${name}`
            res.status(200).download(file)
        }
    },
    readFile: (req, res) => {
        const name = req.query.name
        const pathIndex = req.query.index
        if (pathIndex === undefined) {
            res.status(404).send('File not found.')
        } else {
            let logPath = datapath[pathIndex].path
            let file = `${logPath}/${name}`
            fs.readFile(file, 'utf8', (err, data) => {
                if (err) {
                    res.status(500).send(err.message)
                }
                res.status(200).send(data)
            })
        }
    }
}

function getStat(filename) {
    try {
        return fs.statSync(filename)
    } catch (err) {
        console.log(err)
        return undefined
    }
}

function msToTime(ms) {
    let seconds = (ms / 1000).toFixed(1);
    let minutes = (ms / (1000 * 60)).toFixed(1);
    let hours = (ms / (1000 * 60 * 60)).toFixed(1);
    let days = (ms / (1000 * 60 * 60 * 24)).toFixed(1);
    if (seconds < 60) return seconds + " Sec";
    else if (minutes < 60) return minutes + " Min";
    else if (hours < 24) return hours + " Hrs";
    else return days + " Days"
}