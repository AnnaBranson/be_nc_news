const { selectAllComments } = require("../models/comments.model");
const { selectArticlesById } = require("../models/articles.model");

exports.getAllComments = (request, response, next) => { 
    const { article_id } = request.params;

    selectArticlesById(article_id)
        .then((article) => {
            if (!article) {
                
                return Promise.reject({ status: 404, msg: "Article Not Found!" });
            } 
            
            return selectAllComments(article_id);
        })
        .then((comments) => {
            
            response.status(200).send({ comments });
        })
        .catch((err) => {
            next(err);  
        });
};
