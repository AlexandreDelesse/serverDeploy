const express = require('express')
const { exec } = require('child_process')
const app = express()
const port = 3000

const killContainer = (req, res, next) => {
  exec('docker ps -q', (error, stdout, stderr) => {
    if (error) console.log(`error : ${error.message}`)
    if (stderr) console.log(`stderr : ${stderr}`)
    if (stdout) {
      exec('docker kill $(docker ps -q)', (error, stdout, stderr) => {
        if (error) console.log(`error : ${error.message}`)
        if (stderr) console.log(`stderr : ${stderr}`)
        if (stdout) next()
      })
    } else {
      next()
    }
  })
}

const removeContainer = (req, res, next) => {
  exec('docker ps -a -q', (error, stdout, stderr) => {
    if (error) console.log(`error : ${error.message}`)
    if (stderr) console.log(`stderr : ${stderr}`)
    if (stdout) {
      exec('docker rm $(docker ps -a -q)', (error, stdout, stderr) => {
        if (error) console.log(`error : ${error.message}`)
        if (stderr) console.log(`stderr : ${stderr}`)
        if (stdout) next()
      })
    } else {
      next()
    }
  })
}

const removeImage = (req, res, next) => {
  exec('docker images -q', (error, stdout, stderr) => {
    if (error) console.log(`error : ${error.message}`)
    if (stderr) console.log(`stderr : ${stderr}`)
    if (stdout) {
      exec('docker rmi $(docker images -q)', (error, stdout, stderr) => {
        if (error) console.log(`error : ${error.message}`)
        if (stderr) console.log(`stderr : ${stderr}`)
        if (stdout) next()
      })
    } else {
      next()
    }
  })
}

const deploy = (req, res, next) => {
  exec(
    'docker run -p 5001:5001 168078252309.dkr.ecr.eu-west-3.amazonaws.com/hakuna-api:latest',
    (error, stdout, stderr) => {
      if (error) console.log(`error : ${error.message}`)
      if (stderr) console.log(`stderr : ${stderr}`)
      if (stdout) next()
    },
  )
}

app.get('/', (req, res) => {
  killContainer(req, res, () => {
    console.log('docker kill ok !')
    removeContainer(req, res, () => {
      console.log('docker remove ok !')
      removeImage(req, res, () => {
        console.log('docker remove images ok !')
        deploy(req, res, () => {
          console.log('docker deploy ok !')
        })
      })
    })
  })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
