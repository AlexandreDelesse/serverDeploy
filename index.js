const express = require('express')
const { exec } = require('child_process')
const { start } = require('repl')
const app = express()
const port = 3000

const startTime = new Date.now()

const awsLogin = (req, res, next) => {
  exec(
    'aws ecr get-login-password --region eu-west-3 | docker login --username AWS --password-stdin 168078252309.dkr.ecr.eu-west-3.amazonaws.com',
    (error, stdout, stderr) => {
      if (error) console.log(`error : ${error.message}`)
      if (stderr) console.log(`stderr : ${stderr}`)
      if (stdout) {
        next()
      } else {
        next()
      }
    },
  )
}

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
    'docker run -d -p 5001:5001 168078252309.dkr.ecr.eu-west-3.amazonaws.com/hakuna-api:latest',
    (error, stdout, stderr) => {
      if (error) console.log(`error : ${error.message}`)
      if (stderr) console.log(`stderr : ${stderr}`)
      if (stdout) next()
    },
  )
}

app.get('/', (req, res) => {
  const now = new Date.now()
  const startSince = new Date(now - startTime).getTime()
  res.send(
    `<h3>server is up since ${startSince} ! Use path /reloadServerWithLastVersion to update server</h3>`,
  )
})

app.get('/reloadServerWithLastVersion', (req, res) => {
  awsLogin(req, res, () => {
    console.log('docker deploy ok !')
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
  res.send('server reloaded successfully :)')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
