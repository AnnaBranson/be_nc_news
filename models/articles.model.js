const db = require("../db/connection")


exports.selectArticlesById = (article_id) => {
    return db
    .query("SELECT * FROM articles WHERE article_id = $1", [article_id])
    .then((result) => {
        if(result.rowCount < 1){
            return Promise.reject({status: 404, msg: "Not Found!"})
        }
       return result.rows[0]
    })
    .catch((err)=> {
        //console.error(err)
        throw err
    })
    
}
exports.selectArticles = (sort_by = 'created_at', order = 'DESC') => {
    return db
    .query(`SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id)
        AS comment_count
        FROM articles
        LEFT JOIN comments ON articles.article_id = comments.article_id
        GROUP BY articles.article_id
        ORDER BY created_at;
        `)
    .then((result) => {
       return result.rows
    })
  
}
