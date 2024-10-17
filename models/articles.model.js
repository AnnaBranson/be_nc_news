const db = require("../db/connection")
const format = require("pg-format")
const articles = require("../db/data/test-data/articles")


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
    const validSortBys = ["author", "title", "topic", "body", "created_at", "article_img_url" ]
    if(!validSortBys.includes(sort_by)){
        return Promise.reject({status:400, msg:"Bad Request"})
    }
    return db
    .query(`SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id)
        AS comment_count
        FROM articles
        LEFT JOIN comments ON articles.article_id = comments.article_id
        GROUP BY articles.article_id
        ORDER BY ${sort_by};
        `)
    .then((result) => {
       return result.rows
    })
  
}

exports.changeArticle = (article_id, inc_vote) => {
    return db.query(
        `UPDATE articles
        SET votes = votes + $1
        WHERE article_id = $2
        RETURNING *;`,
        [inc_vote, article_id]
    ).then(({ rows }) => {

       return rows[0]
    })

 }
