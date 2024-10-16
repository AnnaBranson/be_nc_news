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
});

describe("/api/articles", () => {
    test("GET: 200 sends an array of objects with the correct properties", () => {
        return request(app)
        .get("/api/articles")
        .expect(200)
        .then((response) => {
            const { articles } = response.body; 
            expect(Array.isArray(articles)).toBe(true)
                articles.forEach((article) => {
                    expect(article).toEqual({
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
            expect(body.articles).toBeSortedBy("created_at")
        ))
    })
  })

describe("api/articles/:article_id ", () => {
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
    test("GET: 400 ", () => {
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

        test("POST: 200 adds comment to comment table with correct keys of body and username", () => {
            const newComment = {
                author: "butter_bridge",
                body: "This is a test comment."
            }
            return request(app)
            .post("/api/articles/1/comments")
            .send(newComment)
            .expect(200)
            .then(({ body }) => {
                expect(body.comment).toHaveProperty("author"),
                expect(body.comment).toHaveProperty("body"),
                expect(body.comment).toHaveProperty("article_id"),
                expect(body.comment).toMatchObject({
                    author: expect.any(String),
                    body: expect.any(String),
                    article_id: expect.any(Number)
                })
              
            })
        // add comment to comment array
        // comment is an object that has key of username and body (both strings)
        // responds with the posted comment
        // Error - no body or no username 
        // Error body/user name but in the wrong format. 
        //6 tests- successful 200, 
        //test - 201 - ignors unnecessary info 
        //400 invalid id
        //404 non existant bu t vaild id
        //400 missing required fields
        //404 username does not exist. Just another PSQL error 30P2?? run the test with a user that doesn't exist and see what PSQL error occurs. 
        })
   })
 })





    
                   

  

    





      




      



      




      