const db = require ("../db/connection")
const seed = require ("../db/seeds/seed")
const data = require ("../db/data/test-data")
const request = require ("supertest")
const app = require("../app")
const endpoints = require("../endpoints.json")
require("jest-sorted")

beforeEach(() => {
    return seed(data)
})

afterAll (()=> {
    return db.end()
})

describe("all bad URLs",()=>{
    describe("/api/all-bad-urls",()=>{
        test("404 NOT FOUND", () => {
        return request(app)
        .get("/api/any-bad-url")
        .expect(404)
        .then(({ body }) => {
        expect(body.msg).toBe("URL NOT FOUND")
        }) 
     })
    })
})

describe("/api",()=>{
        test("GET: 200 - response with an object detailing all available endpoints", () => {
        return request(app)
        .get("/api")
        .expect(200)
        .then(({ body }) => {
        expect(body.endpoints).toEqual(endpoints)
        }) 
     })
    
})

describe("api/users ", () => {
    test("GET: 200 sends an array of user objects", () => {
        return request(app)
        .get("/api/users")
        .expect(200)
        .then(({body: { users }}) => {
            expect(users).toHaveLength(4)
            users.forEach((user) => {
                expect(user).toEqual({
                    username: expect.any(String),
                    name: expect.any(String),
                    avatar_url: expect.any(String)
                })
            })
        })
    })
})

describe("api/topics ", () => {
    test("GET: 200 sends an array of objects", () => {
        return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({body: { topics }}) => {
            expect(topics).toHaveLength(3)
            topics.forEach((topic) => {
                expect(topic).toEqual({
                    description: expect.any(String),
                    slug: expect.any(String)
                })
            })
        })
      
    })
})

describe("/api/articles", () => {
    test("GET: 200 sends an array of objects with the correct properties", () => {
        return request(app)
        .get("/api/articles")
        .expect(200)
        .then((response) => {
            const { articles } = response.body; 
            expect(Array.isArray(articles)).toBe(true)
                articles.forEach((article) => {
                    expect(article).toMatchObject({
                        author: expect.any(String),
                        title: expect.any(String),
                        article_id: expect.any(Number),
                        topic: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number),
                        article_img_url: expect.any(String),
                        comment_count: expect.any(String)
                })
            })
        })
      
    });
    test("GET: 200 - articles are ordered by date by default", () => {
        return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({body})=>(
            expect(body.articles).toBeSortedBy("created_at", {descending:true})
        ))
    })
    test("GET: 200 - articles are in DESC order by default", () => {
        return request(app)
        .get("/api/articles?sort_by=author")
        .expect(200)
        .then(({body})=>(
            expect(body.articles).toBeSortedBy("author", {descending: true})
        ))
    })
    test("GET: 200 - take a sort_by query and respond with articles sorted by given column name", () => {
        return request(app)
        .get("/api/articles?sort_by=author")
        .expect(200)
        .then(({body})=>(
            expect(body.articles).toBeSortedBy("author", {descending: true})
        ))
    })
    test("GET: 200 - take a order query and respond with articles sorted in given order", () => {
        return request(app)
        .get("/api/articles?order=ASC")
        .expect(200)
        .then(({body})=>(
            expect(body.articles).toBeSortedBy("created_at", {ascending: true})
        ))
    })
    test("GET: 400 - returns an error when given a non-valid sort_by and/or order", () => {
        return request(app)
        .get("/api/articles?sort_by=invalidColumn&&order=invalidOrder")
        .expect(400)
        .then(({ body: { msg } }) => {
            expect(msg).toBe("Bad Request")          
        })
    })
    test("GET: 400 - returns an error when given a non-valid order query", () => {
        return request(app)
        .get("/api/articles?sort_by=author&order=invalidOrder")
        .expect(400)
        .then(({ body: { msg } }) => {
            expect(msg).toBe("Bad Request")          
        })
    })

    test("GET: 200 - returns article filtered by a given topic", () => {
    return request(app)
    .get("/api/articles?topic=mitch")
    .expect(200)
    .then(({body}) => {
        expect(body.articles.length).toBe(12)
        body.articles.forEach((article) =>{
            expect(article.topic).toBe("mitch")
        })
    })
})
    test("GET: 200 - returns all articles when no filter topic is provided", () => {
    return request(app)
    .get("/api/articles?sort_by=body&order=ASC")
    .expect(200)
    .then(({body}) => {
        expect(body.articles.length).toBe(13)
    })
})
    test("GET: 400 - returns an error message when passed an unavailable topic", () => {
         return request(app)
            .get("/api/articles?topic=not-a-topic")
            .expect(400)
            .then(({body: {msg}}) => {
                expect(msg).toBe("Bad Request")
                 })
})
})

describe("api/articles/:article_id", () => {
  describe("GET: api/articles/:article_id", () =>{
    test("GET: 200 response with the requested article object", () => {
        return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body }) => {
           expect(body.article).toMatchObject({
            author: "butter_bridge",
            title: "Living in the shadow of a great man",
            article_id: 1,
            body: "I find this existence challenging",
            topic: "mitch",
            created_at: expect.any(String),
            votes: 100,
            article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
           })
        })
    });
    test("GET: 400 response with error message when passed an invalid article ID)", () => {
        return request(app)
        .get("/api/articles/not-a-number")
        .expect(400)
        .then(({ body: { msg } }) => {
            expect(msg).toBe("Bad Request!")          
        })
    })
    test("GET: 404 response with an error message if passed a valid article_id that does not exist in the database ", () => {
        return request(app)
        .get("/api/articles/9999")
        .expect(404)
        .then(({ body: { msg } }) => {
            expect(msg).toBe("Not Found!")          
        })
    })
}),

  describe("PATCH api/articles/:article_id", () =>{
    test("PATCH: 200 returns updated article with correct properties ", () => {
        const articleUpdate = {inc_vote: 1}
            return request(app)
            .patch("/api/articles/1")
            .send(articleUpdate)
            .expect(200)
            .then(({ body }) => {
                const { article } = body
                   expect(article.title).toEqual("Living in the shadow of a great man"),
                   expect(article.topic).toEqual("mitch"),
                   expect(article.author).toEqual("butter_bridge"),
                   expect(article.body).toEqual("I find this existence challenging"),
                   expect(article.votes).toEqual(101),
                   expect(article.article_img_url).toEqual(
                      "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700")
                  
            })
        })
    test("PATCH: 400 response with error message when passed an invalid article ID)", () => {
            const articleUpdate = {inc_vote: 1}
            return request(app)
            .patch("/api/articles/not-a-number")
            .send(articleUpdate)
            .expect(400)
            .then(({ body: { msg } }) => {
                expect(msg).toBe("Bad Request!")          
            })
        })
    test("PATCH: 404 response with an error message if passed a valid article_id that does not exist in the database ", () => {
            const articleUpdate = {inc_vote: 1}
            return request(app)
            .patch("/api/articles/9999")
            .send(articleUpdate)
            .expect(404)
            .then(({ body: { msg } }) => {
                expect(msg).toBe("Not Found!")          
            })
        })
    test("PATCH: 400 response with an error message if passed an invalid data type for updating article.", () => {
            const articleUpdate = {inc_vote: "not_a_number"}
            return request(app)
            .patch("/api/articles/1")
            .send(articleUpdate)
            .expect(400)
            .then(({ body: { msg } }) => {
                expect(msg).toBe("Invalid Input!")          
            })
        })
  
    test("PATCH: 200 ignores addition information added and updates article as requested.", () => {
            const articleUpdate = {inc_vote: 1, extraKey: "extra info"}
            return request(app)
            .patch("/api/articles/1")
            .send(articleUpdate)
            .expect(200)
            .then(({ body }) => {
                const { article } = body
                   expect(article.title).toEqual("Living in the shadow of a great man"),
                   expect(article.topic).toEqual("mitch"),
                   expect(article.author).toEqual("butter_bridge"),
                   expect(article.body).toEqual("I find this existence challenging"),
                   expect(article.votes).toEqual(101),
                   expect(article.article_img_url).toEqual(
                      "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700")
                  
            })
        })
    test("PATCH: 400 returns error when passed an input with no inc_vote", () => {
            const articleUpdate = {}
            return request(app)
            .patch("/api/articles/1")
            .send(articleUpdate)
            .expect(400)
            .then(({ body: { msg } }) => {
                expect(msg).toBe("Invalid Input!") 
        })
       })
    })
})

describe("api/articles/:article_id/comments ", () => {
    describe("GET/api/articles/:article_id/comments ",()=>{
        
        test("GET: 200 response with an array of comments from an article with a given article ID", () => {
        return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body }) => {
            expect(body.comments).toHaveLength(11)
            body.comments.forEach(comment => {
                expect(comment).toMatchObject({
                    comment_id: expect.any(Number),
                    votes: expect.any(Number),
                    created_at: expect.any(String),
                    author: expect.any(String),
                    body: expect.any(String),
                    article_id: expect.any(Number)
                })
            })
        })
                    })
        test("GET: 200 response with an array of comments from an article with a given article ID ordered by data created with the most recent first by default", () => {
                    return request(app)
                    .get("/api/articles/1/comments")
                    .expect(200)
                    .then(({ body }) => {
                        expect(body.comments).toBeSortedBy("created_at", {descending: true})
                        })
                        
                    })
        test("GET: 400 response when passed an article_id that is not a number", () => {
                    return request(app)
                        .get("/api/articles/not-a-number/comments")
                        .expect(400)
                        .then(({ body }) => {
                            expect(body.msg).toBe("Bad Request!")
                                })
                                
                    })
        test("GET: 404 response when passed a number that does not exist on our table", () => {
                    return request(app)
                        .get("/api/articles/999/comments")
                        .expect(404)
                        .then(({ body }) => {
                            expect(body.msg).toBe("Not Found!")
                              })
                                                
                    })
        test("GET: 200 response with an empty array if the article_id is valid but there are no comments on that article", () => {
                    return request(app)
                    .get("/api/articles/2/comments")
                    .expect(200)
                    .then(({ body }) => {
                    expect(Array.isArray(body.comments)).toBe(true)
                    expect(body.comments).toHaveLength(0)
                                })
                                
                    })
            })
         
    describe("POST/api/articles/:article_id/comments ",()=>{

        test("POST: 201 adds comment to comment table with correct keys of body and username", () => {
            const newComment = {
                author: "butter_bridge",
                body: "This is a test comment."
            }
            return request(app)
            .post("/api/articles/1/comments")
            .send(newComment)
            .expect(201)
            .then(({ body }) => {
                expect(body.comment).toMatchObject({
                    author: "butter_bridge",
                    body: "This is a test comment.",
                    article_id: 1
                })
              
            })
   
        })
        test("POST: 201 ignors unneccessary information ", () => {
            const newComment = {
                author: "butter_bridge",
                body: "This is a test comment.",
                UnnecessryInfo: "unnecessary string"
            }
            return request(app)
            .post("/api/articles/1/comments")
            .send(newComment)
            .expect(201)
            .then(({ body }) => {
                expect(body.comment).toMatchObject({
                    author: "butter_bridge",
                    body: "This is a test comment.",
                    article_id: 1
                })
              
            })
        })
        test("POST: 400 response with an error message when receives invalid article_id ", () => {
            const newComment = {
              author: "butter_bridge",
                body: "This is a test comment.",
            }
            return request(app)
            .post("/api/articles/not-a-number/comments")
            .send(newComment)
            .expect(400)
            .then(({ body: { msg } }) => {
                expect(msg).toBe("Bad Request!")          
            })
        })
        test("POST: 404 response with an error message if passed a valid article_id that does not exist in the database ", () => {
            const newComment = {
                author: "butter_bridge",
                  body: "This is a test comment.",
              }
            return request(app)
            .get("/api/articles/9999/comments")
            .send(newComment)
            .expect(404)
            .then(({ body: { msg } }) => {
                expect(msg).toBe("Not Found!")          
            })
    })
        test("POST: 400 response with an error message if required fields are not present ", () => {
        const newComment = {
            author: "butter_bridge"
          }
        return request(app)
        .post("/api/articles/1/comments")
        .send(newComment)
        .expect(400)
        .then(({ body: { msg } }) => {
            expect(msg).toBe("Missing input")          
        })
})
        test("POST: 404 responds with an error message when given a username that does not exist ", () => {
        const newComment = {
            author: "Non-existant Username",
            body: "This is a test comment.",
                }
            return request(app)
            .post("/api/articles/1/comments")
            .send(newComment)
            .expect(404)
            .then(({ body: { msg } }) => {
                expect(msg).toBe("Invalid Username")          
    })
        })      
 })
})

describe("api/comments/:comment_id ", () => {
    test("DELETE: 200 with no content", () => {
        return request(app)
        .get("/api/comments")
        .then(({body}) => {
            const initialCommentCount = body.comments.length;
            return request(app)
            .delete("/api/comments/1")
            .expect(200)
            .then(() => {
                return request(app)
                .get("/api/comments")
                .then(({body}) => {
                    const finalCommentCount = body.comments.length;
                expect(finalCommentCount).toBe(initialCommentCount -1)})
                })

        })
        
        
        })
    test("DELETE: 400 returns error message when passed an invalid comment_id", () => {
            return request(app)
            .delete("/api/comments/invalid-comment-id")
            .expect(400)
            .then(({ body: { msg } }) => {
                    expect(msg).toBe("Bad Request!")          
                })
        })
    test("DELETE: 404 returns error message when passed a valid comment_id but there is not comment to delete ", () => {
            return request(app)
            .delete("/api/comments/9999")
            .expect(404)
            .then(({ body: { msg } }) => {
                    expect(msg).toBe("Not Found!")          
                })
        })
        
})

describe("api/users ", () => {
    test("GET: 200 sends an array of user objects", () => {
        return request(app)
        .get("/api/users")
        .expect(200)
        .then(({body: { users }}) => {
            expect(users).toHaveLength(4)
            users.forEach((user) => {
                expect(user).toEqual({
                    username: expect.any(String),
                    name: expect.any(String),
                    avatar_url: expect.any(String)
                })
            })
        })
      
    })
})
   








  
      
      
             
