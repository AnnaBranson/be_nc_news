const express = require ("express")
const app = express()
const { getTopics } = require ("./controllers/topics.controller")
const endpoints = require ("./endpoints.json")
const { getArticlesById, getArticles } = require ("./controllers/articles.controller")
const { getAllComments, postComments } = require ("./controllers/comments.controller")

app.use(express.json())

app.get("/api", (request, response) => {
    response.status(200).send( {endpoints: endpoints})
})

app.get("/api/topics", getTopics)

app.get("/api/articles", getArticles)

app.get("/api/articles/:article_id", getArticlesById)

app.get("/api/articles/:article_id/comments", getAllComments)

app.post("/api/articles/:article_id/comments", postComments)

app.use((err, request, response, next) =>{
    if (err.code === "22P02") {
        response.status(400).send({msg: "Bad Request!"})
    } else next(err)
})
app.use((err,request, response, next) => {
    if (err.status && err.msg) {
        response.status(err.status).send({ msg: err.msg })
    } else next (err)
})

app.use('*', (request, response) => {
    response.status(404).send({ msg: 'URL NOT FOUND' });
  });

app.use((err, request, response, next) => {
response.status(500).send({msg : "500 server error"})
})

  module.exports = app
