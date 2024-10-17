const express = require ("express")
const app = express()
const { getTopics } = require ("./controllers/topics.controller")
const endpoints = require ("./endpoints.json")
const { getArticlesById, getArticles, updateArticle } = require ("./controllers/articles.controller")
const { getAllComments, postComments } = require ("./controllers/comments.controller")

app.use(express.json())

app.get("/api", (request, response) => {
    response.status(200).send( {endpoints: endpoints})
})

app.get("/api/topics", getTopics)

app.get("/api/articles", getArticles)

app.get("/api/articles/:article_id", getArticlesById)

app.patch("/api/articles/:article_id", updateArticle)

app.get("/api/articles/:article_id/comments", getAllComments)

app.post("/api/articles/:article_id/comments", postComments)

app.use((err, request, response, next) =>{
    if (err.code === "22P02"){
        response.status(400).send({msg: "Bad Request!"})
    }
    if (err.code === '23503'){
        response.status(404).send({msg: "Invalid Username"})
    }
    if (err.code === '23502'){
        response.status(404).send({msg: "Invalid Input"})
    }
    
    else next(err)
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
