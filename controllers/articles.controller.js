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
        console.log(err)
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
    
    if (isNaN(Number(inc_vote)) || !inc_vote){
        return next({status: 400, msg: "Invalid Input!"})
    }
    changeArticle(article_id, inc_vote)
    .then((updatedArticle) => {
        if (!updatedArticle)
            return next({status: 404, msg: "Not Found!"})
        response.status(200).send({ article: updatedArticle} )
        
    })
    .catch((err) => {
      next(err)
    })
    
}

