# Blogging Platform RESTful API

This is a RESTful API for a blogging platform that allows users to create, read, update, and delete blog posts. The API supports user authentication and authorization, allowing users to create and manage their own posts.

## Features

- User registration: Users can create an account by providing a unique username and password.
- User login: Users can log in with their credentials and receive a JWT token for authentication.
- Create blog posts: Authenticated users can create new blog posts by providing a title and content.
- Read blog posts: Users can retrieve a list of all blog posts or view a specific post by its ID.
- Update blog posts: Users can update their own blog posts by providing a new title and content.
- Delete blog posts: Users can delete their own blog posts.

## Technologies

The API is built using the following technologies:

- Node.js: A JavaScript runtime environment for server-side development.
- Express.js: A web application framework for building APIs with Node.js.
- MongoDB: A NoSQL database for storing and retrieving blog post data.
- Mongoose: An object data modeling (ODM) library for MongoDB and Node.js.
- JWT: JSON Web Tokens for user authentication and authorization.
- Bcrypt: A library for hashing and comparing passwords securely.
- Helmet: A middleware provides protection by setting appropriate headers.
- Cors: A mechanism that enables Cross-Origin Resource Sharing

## Setup

1. Clone the repository:
   git clone: https://github.com/obinnafranklinduru/nodejs-projects/tree/main/blogging-platform-api

---

2. Install the dependencies:

cd blogging-platform-api
npm install

3. Configure the environment variables:

- Create a `.env` file in the root directory.
- Define the following variables in the `.env` file:
  - `PORT`: The port number for the server (e.g., `3000`).
  - `MONGODB_URI`: The connection string for your MongoDB database.
  - `JWT_SECRET`: A secret key for signing JWT tokens.

4. Start the server:

npm run start

5. Testing the API

You can test the API using a tool like [Postman](https://www.postman.com/) or cURL. The API endpoints are as follows:

- User Registration:

  - URL: `POST /api/v1/auth/register`
  - Request Body:

  ```
  {
     "username": "your-username",
     "password": "your-password",
     "email": "your-email"
  }
  ```

- User Login:

  - URL: `POST /api/v1/login`
  - Request Body:

  ```
  {
      "email": "your-email",
      "password": "your-password"
  }
  ```

  ```
  {
      "username": "your-username",
      "password": "your-password"
  }
  ```

  - Response Body: `{ "token": "your-jwt-token" }`

- User Logout:

  - URL: `POST /api/v1/logout`
  - Response Body: `{ "message": "Logout successful" }`

  - Create Blog Post:

    - URL: `POST /api/v1/posts`
    - Request Body: `{ "title": "Your Post Title", "content": "Your Post Content" }`
    - Headers: `{ "Authorization": "Bearer your-jwt-token" }`

  - Read All Blog Posts:

    - URL: `GET /api/v1/posts`

  - Read a Specific Blog Post:

    - URL: `GET /api/v1/posts/:id` (replace `:id` with the ID of the post)

  - Update Blog Post:

    - URL: `PUT /api/v1/posts/:id` (replace `:id` with the ID of the post)
    - Request Body: `{ "title": "Updated Post Title", "content": "Updated Post Content" }`
    - Headers: `{ "Authorization": "Bearer your-jwt-token" }`

  - Delete Blog Post:
    - URL: `DELETE /api/v1/posts/:id` (replace `:id` with the ID of the post)
    - Headers: `{ "Authorization": "Bearer your-jwt-token" }`

6. Error Handling

   The API handles errors by returning appropriate HTTP status codes and error messages. Common error scenarios include invalid requests, unauthorized access, and internal server errors. Error messages are returned in JSON format for easy consumption by clients.

7. Security Considerations

   This API uses JWT tokens for authentication and authorization. It is important to secure the secret key used for signing the tokens. In addition, you should consider implementing other security measures, such as input validation, rate limiting, and data encryption, to protect against common security threats.

8. Deployment

   To deploy the API to a production environment, you can use platforms like Heroku, AWS, or Azure. Make sure to configure the necessary environment variables and adjust any security settings as needed.

9. Contributing

   Contributions to the project are welcome! If you find any issues or would like to suggest improvements, please open an issue or submit a pull request.

10. License

    This project is licensed under the [MIT License](LICENSE)
