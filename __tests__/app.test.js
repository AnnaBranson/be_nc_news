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
    // test("GET: 200 - response with an empty array when passed a article_id that is present in the database but has no associated articles", () => {
    //     return request(app)
    //     .get("/.api/article?_id=4")
    // })
   

})

describe("api/articles/:article_id ", () => {
    test("GET: 200 response with the requested article object", () => {
        return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body }) => {
           
           })
        })
    });




      




      



      




      