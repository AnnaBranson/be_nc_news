const db = require("../db/connection")

exports.selectUsers = () => {
    return db.query(
        `SELECT * FROM USERS`)
        .then((result) => {
            return result.rows
        })
        
    
}