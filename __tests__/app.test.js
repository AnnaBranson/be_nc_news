const db = require ("../db/connection")
const seed = require ("../db/seeds/seed")
const data = require ("../db/data/test-data")
const request = require ("supertest")
const app = require("../app")
const endpoints = require("../endpoints.json")

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
      
    });
   

})


      