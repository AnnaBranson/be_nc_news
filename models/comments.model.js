const db = require("../db/connection")


exports.selectAllComments = (article_id) => {

   return db
   .query(`SELECT * FROM comments WHERE article_id = $1
    ORDER BY created_at DESC`, [article_id])
   .then(({rows}) => {
    return rows;
   })
    }

exports.addComments = (article_id, author, body) => {
   const query = 
   `INSERT INTO comments (article_id, author, body) 
   VALUES ($1, $2, $3)
   RETURNING *;`;
   
   
   return db.query(query, [article_id, author, body])
   .then((result) => {
      console.log(result.rows[0], "result in model .then block")
      return result.rows[0]
   })
 
}


    