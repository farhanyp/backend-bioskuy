# Payment API Spec

### Create Payment API

###### Endpoint : POST /api/v1/payment

###### Headers:

- Authorization: jwt-token

###### Request Body :

```json
{
  "movie_id": 1,
  "studio_id": 1,
  "seat": "A-11",
  "show_start": 2023-12-3::24:24:24,
  "show_end": 2023-12-3::24:24:24,
  "status": "unpaid" || "paid"
}
```

###### Response Body Success :

```json
{
  "data": {
  "id": "uuid",
  "movie_id": 1,
  "studio_id": 1,
  "seat": "A-11",
  "show_start": 2023-12-3::24:24:24,
  "show_end": 2023-12-3::24:24:24,
  "status": "unpaid" || "paid"
  }
}
```

###### Response Body Error :

```json
{
  "errors": "payments already created"
}
```

### Get Film API

###### Endpoint : GET /api/v1/payments

###### Response Body Success :

```json
{
  "data": [
    {
      "id": "uuid",
      "movie_id": 1,
      "studio_id": 1,
      "seat": "A-11",
      "show_start": 2023-12-3::24:24:24,
      "show_end": 2023-12-3::24:24:24,
      "status": "unpaid" || "paid"
    },
    {
      "id": "uuid",
      "movie_id": 1,
      "studio_id": 1,
      "seat": "A-11",
      "show_start": 2023-12-3::24:24:24,
      "show_end": 2023-12-3::24:24:24,
      "status": "unpaid" || "paid"
    }
  ]
}
```

### Get Current Payments API

###### Endpoint : GET /api/v1/payment/current

###### Response Body Success :

```json
{
  "data":
    {
      "id": "uuid",
      "movie_id": 1,
      "studio_id": 1,
      "seat": "A-11",
      "show_start": 2023-12-3::24:24:24,
      "show_end": 2023-12-3::24:24:24,
      "status": "unpaid" || "paid"
    },
}
```

```json
{
  "errors": "Payments Not Found"
}
```

### Update Payments API

###### Endpoint : post /api/v1/payment/current

###### Headers:

- Authorization: jwt-token

###### Request Body :

```json
{
  {
    "movie_id": 1,
    "studio_id": 1,
    "seat": "A-11",
    "show_start": 2023-12-3::24:24:24,
    "show_end": 2023-12-3::24:24:24,
    "status": "paid"
    }
}
```

###### Response Body Success :

```json
{
  "data":
    {
    "movie_id": 1,
    "studio_id": 1,
    "seat": "A-11",
    "show_start": 2023-12-3::24:24:24,
    "show_end": 2023-12-3::24:24:24,
    "status": "paid"
    }
}
```

###### Response Body Error :

```json
{
  "errors": "payment Not Found"
}
```
