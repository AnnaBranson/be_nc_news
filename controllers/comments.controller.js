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
    console.log("controller")
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
    if (!author || !body){
        return response.status(400).send({msg: "Missing input"})
    }

    addComments(article_id, author, body)
     .then((comment) => {
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
        response.status(204).send()
    })
    .catch(next)
    
}
