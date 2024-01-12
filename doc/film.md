# Film API Spec

### Create Film API

###### Endpoint : POST /api/v1/film

###### Headers:

- Authorization: jwt-token

###### Request Body :

```json
{
  "name": "James Bond",
  "price": 10.000,
  "status": "showing" || "not airing yet" || "expired"
}
```

###### Response Body Success :

```json
{
  "data": {
  "id": "uuid",
  "name": "James Bond",
  "price": 10.000,
  "status": "showing" || "not airing yet" || "expired"
  }
}
```

###### Response Body Error :

```json
{
  "errors": "Film already created"
}
```

### Get Film API

###### Endpoint : GET /api/v1/film

###### Response Body Success :

```json
{
  "data": [
    {
      "id": "uuid",
      "name": "James Bond",
      "price": 10.000,
      "status": "showing" || "not airing yet" || "expired"
    },
    {
      "id": "uuid",
      "name": "James Bond 2",
      "price": 10.000,
      "status": "showing" || "not airing yet" || "expired"
    }
  ]
}
```

### Get Current Film API

###### Endpoint : GET /api/v1/film/current

###### Response Body Success :

```json
{
  "data":
    {
      "id": "uuid",
      "name": "James Bond",
      "price": 10.000,
      "status": "showing" || "not airing yet" || "expired"
    },
}
```

```json
{
  "errors": "Film Not Found"
}
```

### Update Film API

###### Endpoint : post /api/v1/film/current

###### Headers:

- Authorization: jwt-token

###### Request Body :

```json
{
  {
  "id" : 1,
  "name": "James Bond",
  "price": 10.000,
  "status": "showing" || "not airing yet" || "expired"
  }
}
```

###### Response Body Success :

```json
{
  "data":
    {
      "id" : 1,
      "name": "James Bond",
      "price": 10.000,
      "status": "showing" || "not airing yet" || "expired"
    },
}
```

###### Response Body Error :

```json
{
  "errors": "Film Not Found"
}
```

### DELETE Film API

###### Endpoint : post /api/v1/film/current/delete

###### Headers:

- Authorization: jwt-token

###### Request Body :

```json
{
  {
  "id" : 1,
  "name": "James Bond",
  "price": 10.000,
  "status": "showing" || "not airing yet" || "expired"
  }
}
```

###### Response Body Success :

```json
{
  "data": {
    "msg": "Film Already Delete"
  }
}
```

###### Response Body Error :

```json
{
  "errors": "Film Not Found"
}
```
