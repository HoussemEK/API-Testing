# README

## Overview

This is an Express.js application for managing a list of people with CRUD operations, using SQLite for data storage and Keycloak for authentication.

### Features

- **CRUD Operations**: Create, read, update, and delete person records.
- **Authentication**: Secured routes using Keycloak.

### Technologies Used

- **Node.js**: JavaScript runtime.
- **Express.js**: Web framework.
- **SQLite**: Database for storing records.
- **Keycloak**: Identity and access management.

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the application:
   ```bash
   node index.js
   ```

### Testing with Postman

1. **Authenticate with Keycloak**:

   - Send a POST request to:
     ```
     POST http://localhost:8080/auth/realms/api-realm/protocol/openid-connect/token
     ```
   - Use `x-www-form-urlencoded` with:
     - `client_id`: `pai-id`
     - `client_secret`: `api-secret`
     - `grant_type`: `client_credentials`

2. **Set Authorization**: Use the `access_token` in the `Authorization` header as `Bearer <access_token>`.

3. **CRUD Operations**:

   - **Create a Person**:

     ```
     POST http://localhost:3000/personnes
     ```

     Body:

     ```json
     { "nom": "John Doe", "adresse": "123 Main St" }
     ```

   - **Retrieve All Persons**:

     ```
     GET http://localhost:3000/personnes
     ```

   - **Retrieve a Person by ID**:

     ```
     GET http://localhost:3000/personnes/{id}
     ```

   - **Update a Person**:

     ```
     PUT http://localhost:3000/personnes/{id}
     ```

     Body:

     ```json
     { "nom": "Jane Doe", "adresse": "456 Elm St" }
     ```

   - **Delete a Person**:
     ```
     DELETE http://localhost:3000/personnes/{id}
     ```

### Conclusion

This application provides a simple framework for managing person records with secure access control.
