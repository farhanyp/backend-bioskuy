# Studio API Spec

### Create Studio API

###### Endpoint : POST /api/v1/studio

###### Headers:

- Authorization: jwt-token

###### Request Body :

```json
{
  "name": "Studio 1"
}
```

###### Response Body Success :

```json
{
  "data": {
    "id": "uuid",
    "name": "Studio 1"
  }
}
```

###### Response Body Error :

```json
{
  "errors": "Studio already created"
}
```

### Get Studio API

###### Endpoint : GET /api/v1/studio

###### Response Body Success :

```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Studio 1"
    },
    {
      "id": "uuid",
      "name": "Studio 2"
    }
  ]
}
```

### Get Current Studio API

###### Endpoint : GET /api/v1/studio/current

###### Response Body Success :

```json
{
  "data": {
    "id": "uuid",
    "name": "Studio 1"
  }
}
```

```json
{
  "errors": "Studio Not Found"
}
```

### Update Stuido API

###### Endpoint : post /api/v1/studio/current

###### Headers:

- Authorization: jwt-token

###### Request Body :

```json
{
  {
  "id" : 1,
  "name": "Studio 1",
  }
}
```

###### Response Body Success :

```json
{
  {
  "id" : 1,
  "name": "Studio 1",
  }
}
```

###### Response Body Error :

```json
{
  "errors": "Studio Not Found"
}
```

### DELETE Studio API

###### Endpoint : post /api/v1/studio/current/delete

###### Headers:

- Authorization: jwt-token

###### Request Body :

```json
{
  {
  "id" : 1,
  "name": "Studio 1",
  }
}
```

###### Response Body Success :

```json
{
  "data": {
    "msg": "Studio Already Delete"
  }
}
```

###### Response Body Error :

```json
{
  "errors": "Studio Not Found"
}
```
