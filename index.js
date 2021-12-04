const express = require('express')
const { exec } = require('child_process')
const app = express()
const port = 3000

const cleanDocker = (req, res) => {
  exec('docker ps -q', (error, stdout, stderr) => {
    if (error) res.send(`error : ${error.message}`)
    if (stderr) res.send(`stderr : ${stderr}`)
    res.send(`stdout ${stdout}`)
  })
}

app.get('/', (req, res) => {
  exec('sh deploy.sh', (error, stdout, stderr) => {
    if (error) console.log(`error : ${error.message}`)
    if (stderr) console.log(`stderr : ${stderr}`)
    res.send(`stdout ${stdout}`)
  })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
