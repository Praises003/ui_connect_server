ui-connect-api: 1.0.0
info:
  title: UI Connect API
  description: Backend API for UI Connect Social Platform
  version: 1.0.0

servers:
  - url: https://ui-connect-server.onrender.com
    description: Production Server

tags:
  - name: Auth
  - name: Users
  - name: Posts

components:
  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

  schemas:

    User:
      type: object
      properties:
        id:
          type: string
        email:
          type: string
        fullName:
          type: string
        bio:
          type: string
          nullable: true
        avatarUrl:
          type: string
          nullable: true
        role:
          type: string
        createdAt:
          type: string
          format: date-time
        updatedAt:
          type: string
          format: date-time

    Post:
      type: object
      properties:
        id:
          type: string
        content:
          type: string
        imageUrl:
          type: string
          nullable: true
        author:
          $ref: '#/components/schemas/User'
        createdAt:
          type: string
          format: date-time
        updatedAt:
          type: string
          format: date-time

    RegisterRequest:
      type: object
      required: [email, password, fullName]
      properties:
        email:
          type: string
        password:
          type: string
        fullName:
          type: string

    LoginRequest:
      type: object
      required: [email, password]
      properties:
        email:
          type: string
        password:
          type: string

    RefreshRequest:
      type: object
      required: [refreshToken]
      properties:
        refreshToken:
          type: string

    CreatePostRequest:
      type: object
      required: [content]
      properties:
        content:
          type: string
        imageUrl:
          type: string

paths:

  /api/auth/register:
    post:
      tags: [Auth]
      summary: Register a new user
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/RegisterRequest'
      responses:
        200:
          description: Successful registration

  /api/auth/login:
    post:
      tags: [Auth]
      summary: Login user
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/LoginRequest'
      responses:
        200:
          description: Successful login

  /api/auth/refresh:
    post:
      tags: [Auth]
      summary: Refresh access token
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/RefreshRequest'
      responses:
        200:
          description: New access token returned

  /api/users/me:
    get:
      tags: [Users]
      summary: Get current user profile
      security:
        - BearerAuth: []
      responses:
        200:
          description: User profile
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'

    patch:
      tags: [Users]
      summary: Update user profile
      security:
        - BearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                fullName:
                  type: string
                bio:
                  type: string
                avatarUrl:
                  type: string
      responses:
        200:
          description: Updated user profile

  /api/users/me/password:
    patch:
      tags: [Users]
      summary: Change user password
      security:
        - BearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [oldPassword, newPassword]
              properties:
                oldPassword:
                  type: string
                newPassword:
                  type: string
      responses:
        200:
          description: Password updated

  /api/posts:
    post:
      tags: [Posts]
      summary: Create a post
      security:
        - BearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreatePostRequest'
      responses:
        201:
          description: Post created

    get:
      tags: [Posts]
      summary: Get all posts (feed)
      security:
        - BearerAuth: []
      responses:
        200:
          description: List of posts
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Post'

  /api/posts/{id}:
    get:
      tags: [Posts]
      summary: Get single post
      security:
        - BearerAuth: []
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        200:
          description: Single post
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Post'

    delete:
      tags: [Posts]
      summary: Delete a post
      security:
        - BearerAuth: []
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        200:
          description: Post deleted
