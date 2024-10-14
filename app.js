const express = require ("express")
const app = express()
const { getTopics } = require ("./controllers/topics.controller")

app.get("/api/topics", getTopics)


app.use('*', (request, response) => {
    response.status(404).send({ msg: 'URL NOT FOUND' });
  });

app.use((err, request, response, next) => {const unhandledError = err
console.log({ unhandledError})
response.status(500).send({msg : "500 server error"})
})


  module.exports = app
