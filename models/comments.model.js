const db = require("../db/connection")


exports.selectAllComments = (article_id) => {

   return db
   .query(`SELECT * FROM comments WHERE article_id = $1
    ORDER BY created_at DESC`, [article_id])
   .then(({rows}) => {
    return rows;
   })
    }

exports.createComments = () => {
   console.log("hello from model")
}

    