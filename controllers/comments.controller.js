const { selectAllCommentsById, addComments, removeComment, selectEveryCommentInTable } = require("../models/comments.model");
const { selectArticlesById } = require("../models/articles.model");


exports.getAllCommentsById = (request, response, next) => { 
    const { article_id } = request.params;

    selectArticlesById(article_id)
        .then((article) => {
            if (!article) {
                
            return Promise.reject({ status: 404, msg: "Article Not Found!" });
            } 
            
            return selectAllCommentsById(article_id);
        })
        .then((comments) => {
            
            response.status(200).send({ comments });
        })
        .catch((err) => {
            next(err);  
        });
};

exports.getEveryCommentInTable = (request, response, next) =>{
    
    selectEveryCommentInTable()
        .then((comments) => {
            response.status(200).send({ comments })
        })
        .catch((err) => {
            next(err)
        })

}

exports.postComments = (request, response, next) => {
    
    const { author, body } = request.body
    const { article_id } = request.params

    
    

    const promises = [selectArticlesById(article_id), addComments(article_id, author, body)]

   Promise.all(promises)

     .then((result) => {
        const comment = result[1]
         response.status(201).send({ comment })
     })

    .catch((err) => {
    
        next(err)
     })

}

exports.deleteComment = (request, response, next) => {
    const { comment_id }= request.params
    
    removeComment(comment_id)
    .then(() => {
        response.status(200).send()
    })
    .catch(next)
    
}
