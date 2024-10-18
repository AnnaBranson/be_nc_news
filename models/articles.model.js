const db = require("../db/connection")
const format = require("pg-format")
// const articles = require("../db/data/test-data/articles")
// const { getTopics } = require ("../controllers/topics.controller")


exports.selectArticlesById = (article_id) => {
    return db
    .query("SELECT * FROM articles WHERE article_id = $1", [article_id])
    .then((result) => {
        if(result.rowCount < 1){
            return Promise.reject({status: 404, msg: "Not Found!"})
        }
       return result.rows[0]
    })
      
}

exports.selectArticles = (sort_by = 'created_at', order = 'DESC', topic) => {
    const validSortBys = ["author", "title", "topic", "body", "created_at", "article_img_url" ]
    const validOrder = ["ASC", "DESC"]
    const validTopics = ["mitch", "cats", "paper"]
    if(!validSortBys.includes(sort_by) || !validOrder.includes(order)){
        return Promise.reject({status:400, msg:"Bad Request"})
    }
    if(topic && !validTopics.includes(topic)){
        return Promise.reject({ status: 400, msg: "Bad Request"})
    }
    
    
    let queryStr = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, articles.body, COUNT(comments.article_id)
        AS comment_count
        FROM articles
        LEFT JOIN comments ON articles.article_id = comments.article_id
        `
    let queryVals = []

    if (topic) {
        queryStr += ` WHERE articles.topic = $1`
        queryVals.push(topic)
    }

    queryStr += ` GROUP BY articles.article_id, articles.${sort_by} ORDER BY ${sort_by} ${order}`;
    return db
    .query(queryStr, queryVals)
    
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
