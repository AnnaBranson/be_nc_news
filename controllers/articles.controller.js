const { selectArticlesById } = require("../models/articles.model")
const { selectArticles } = require("../models/articles.model")
const { selectAllComments } = require("../models/articles.model")

exports.getArticlesById = (request, response, next) => {

   const { article_id } = request.params

    selectArticlesById(article_id)
    .then((article) => {
        if (!article)
            return next({status: 404, msg: "Article not found"})
        response.status(200).send({ article })
    })
    .catch((err) => {
        next(err)
    })
   
}

exports.getArticles = (request, response, next) => {
    const { sort_by } = request.query;
    selectArticles(sort_by)
     .then((articles) => {
              response.status(200).send({ articles })
     })
     .catch((err) => {
         next(err)
     })
    
 }

