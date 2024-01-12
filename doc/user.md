# User API Spec

## Register User API

Endpoint : POST /api/v1/auth/register

Request Body :

```json
{
  "email": "user@gmail.com",
  "password": "rahasia",
  "name": "user",
  "role": "user" || "admin"
}
```

Response Body Success :

```json
{
  "data": {
    "email": "user@gmail.com",
    "name": "user",
    "role": "user" || "admin"
  }
}
```

Response Body Error :

```json
{
  "errors": "Username already registered"
}
```

## Login User API

Endpoint : POST /api/v1/auth/login

Request Body :

```json
{
  "email": "user@gmail.com",
  "password": "rahasia"
}
```

Response Body Success :

```json
{
  "data": {
    "token": "jwt-token"
  }
}
```

Response Body Error :

```json
{
  "errors": "Username or password wrong"
}
```
