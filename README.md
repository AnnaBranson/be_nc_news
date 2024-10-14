# Northcoders News API

Sensitive data is stored in .env files that are not included within this repository for security reasons. THis includes the name of the database with which this repo connects. 
In order to run this project locally, you will need to create two environment files:

1. `.env` for local development.
Create a .env file for your development environment:
In the root of your project, create a file named .env and add PGDATABASE=your_development_db_name
2. `.env.test` for running tests.
Additionally, create a .env.test file in the root directory to store environment variables specific to the testing and add PGDATABASE=your_test_db_name


--- 

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
