const db = require("../db/connection")


exports.selectAllCommentsById = (article_id) => {

   return db
   .query(`SELECT * FROM comments WHERE article_id = $1
    ORDER BY created_at DESC`, [article_id])
   .then(({rows}) => {
    return rows;
   })
}

exports.selectEveryCommentInTable = () => {
   return db 
   .query(`SELECT * FROM comments`)
   .then(({rows})=>{
      return rows
   })
}

exports.addComments = (article_id, author, body) => {
  
   const query = 
   `INSERT INTO comments (article_id, author, body) 
   VALUES ($1, $2, $3)
   RETURNING *;`;
      
   return db.query(query, [article_id, author, body])
   .then((result) => {
      return result.rows[0]
   })
   .catch((err)=> {
      throw err
  })
 
}

exports.removeComment = (comment_id) =>{
   return db.query(
      `DELETE FROM comments 
       WHERE comment_id = $1 
       RETURNING*;`,
       [comment_id]
   ).then((result) =>{
      if (result.rowCount === 0) {
         return Promise.reject({ status: 404, msg: "Not Found!"})
      }
      return result
   })
}
