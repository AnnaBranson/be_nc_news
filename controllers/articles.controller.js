const { selectArticlesById, selectArticles, changeArticle } = require("../models/articles.model")



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

exports.updateArticle = (request, response, next) => {
    const { article_id } = request.params
    const { inc_vote } = request.body
    
    changeArticle(article_id, inc_vote)
    .then((updatedArticle) => {
        console.log(updatedArticle)
        response.status(200).send({ article: updatedArticle} )
        
    })
    .catch(next)
    
}

