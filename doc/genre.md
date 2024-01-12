# Genre API Spec

### Create Genre API

###### Endpoint : POST /api/v1/genre

###### Headers:

- Authorization: jwt-token

###### Request Body :

```json
{
  "name": "Comedy"
}
```

###### Response Body Success :

```json
{
  "data": {
    "id": "uuid",
    "name": "Comedy"
  }
}
```

###### Response Body Error :

```json
{
  "errors": "Genre already created"
}
```

### Get Genre API

###### Endpoint : GET /api/v1/genre

###### Response Body Success :

```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Comedy"
    },
    {
      "id": "uuid",
      "name": "Action"
    }
  ]
}
```

### Get Current Genre API

###### Endpoint : GET /api/v1/genre/current

###### Response Body Success :

```json
{
  "data": {
    "id": "uuid",
    "name": "Comedy"
  }
}
```

```json
{
  "errors": "Genre Not Found"
}
```

### Update Genre API

###### Endpoint : post /api/v1/genre/current

###### Headers:

- Authorization: jwt-token

###### Request Body :

```json
{
  {
  "id" : 1,
  "name": "Comedy",
  }
}
```

###### Response Body Success :

```json
{
  "data": {
    "id": 1,
    "name": "Comedy"
  }
}
```

###### Response Body Error :

```json
{
  "errors": "Genre Not Found"
}
```

### DELETE Genre API

###### Endpoint : post /api/v1/genre/current/delete

###### Headers:

- Authorization: jwt-token

###### Request Body :

```json
{
  {
  "id" : 1,
  "name": "Comedy",
  }
}
```

###### Response Body Success :

```json
{
  "data": {
    "msg": "Genre Already Delete"
  }
}
```

###### Response Body Error :

```json
{
  "errors": "Genre Not Found"
}
```
