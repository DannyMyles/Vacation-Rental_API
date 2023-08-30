<h3 align="center">Totel API</h3>

<div align="center">

[![Status](https://img.shields.io/badge/status-active-success.svg)]()

</div>

## Documentation

The documentation for the features implemented is available [here](https://documenter.getpostman.com/view/20654215/2s93eZwqsJ)

## Features

### Users can add home with location, description and immages

- Request Type
  `POST`

- Endpoint

`http://localhost:4500/v1/user/home-locations`

- Sample Request Body

```JSON
{
  "name": "Cozy Apartment",
  "description": "A comfortable apartment with a great view of the city",
  "address": "123 Main Street",
  "city": "Anytown",
  "state": "CA",
  "zipCode": "12345",
  "coordinates": {
    "type": "Point",
    "coordinates": [-122.123456, 37.123456]
  },
  "images": [
    "image1.jpg",
    "image2.jpg",
    "image3.jpg"
  ]
}

```

- Success Response Body

```JSON
{
    "action": "/v1/user/home-locations",
    "code": 200,
    "status": true,
    "data": {
        "name": "Cozy Apartment",
        "address": "123 Main Street",
        "city": "Anytown",
        "state": "CA",
        "zipCode": "12345",
        "images": [
            {
                "url": "https://res.cloudinary.com/dxqeedmxk/image/upload/v1683620613/Reviews/rfllzaa1vixxop2xm50p.jpg",
                "public_id": "Reviews/rfllzaa1vixxop2xm50p",
                "_id": "645a03064b8b3ea534d2191f"
            },
            {
                "url": "https://res.cloudinary.com/dxqeedmxk/image/upload/v1683620615/Reviews/gnife5zxxju43okpcfel.jpg",
                "public_id": "Reviews/gnife5zxxju43okpcfel",
                "_id": "645a03064b8b3ea534d21920"
            }
        ],
        "description": "A comfortable apartment with a great view of the city",
        "_id": "645a03064b8b3ea534d2191e",
        "__v": 0
    },
    "message": "Success"
}
```

### Search Functionality

- Request Type

`GET`

- Sample Endpoint

`http://localhost:4500/v1/user/search?name=Cozy%20Apartment&city=Anytown&state=CA`

- Explanation

A request to the search route is a GET request with a query string containing the search parameters. For example:

GET /search?name=Cozy%20Apartment&city=Anytown&state=CA

In this example, we're searching for all locations with a name of "Cozy Apartment" that is located in the city of "Anytown" in the state of "CA". The %20 represents a space character in the URL encoded format.

- Sample Response

```
{
    "results": [
        {
            "_id": "645a03064b8b3ea534d2191e",
            "name": "Cozy Apartment",
            "address": "123 Main Street",
            "city": "Anytown",
            "state": "CA",
            "zipCode": "12345",
            "images": [
                {
                    "url": "https://res.cloudinary.com/dxqeedmxk/image/upload/v1683620613/Reviews/rfllzaa1vixxop2xm50p.jpg",
                    "public_id": "Reviews/rfllzaa1vixxop2xm50p",
                    "_id": "645a03064b8b3ea534d2191f"
                },
                {
                    "url": "https://res.cloudinary.com/dxqeedmxk/image/upload/v1683620615/Reviews/gnife5zxxju43okpcfel.jpg",
                    "public_id": "Reviews/gnife5zxxju43okpcfel",
                    "_id": "645a03064b8b3ea534d21920"
                }
            ],
            "description": "A comfortable apartment with a great view of the city",
            "__v": 0
        }
    ]
}
```

### Filter Functionality

- Request Type

`GET`

- Sample Endpoint

`http://localhost:4500/v1/user/filter?zipCode=12345`

- Explanation

`GET /filter?zipCode=12345`

In this example, we're filtering for locations that have a zip code of "12345". This request would return a JSON response containing the search or filter results.

- Sample Response

```
{
    "results": [
        {
            "_id": "6459ff6784c74c42432099cf",
            "name": "Cozy Apartment",
            "address": "123 Main Street",
            "city": "Anytown",
            "state": "CA",
            "zipCode": "12345",
            "images": [
                {
                    "url": "https://res.cloudinary.com/dxqeedmxk/image/upload/v1683619685/Reviews/h8vfdguqroysgqjtjc3a.jpg",
                    "public_id": "Reviews/h8vfdguqroysgqjtjc3a",
                    "_id": "6459ff6784c74c42432099d0"
                },
                {
                    "url": "https://res.cloudinary.com/dxqeedmxk/image/upload/v1683619688/Reviews/b5xkedgqculvwtyptyrk.jpg",
                    "public_id": "Reviews/b5xkedgqculvwtyptyrk",
                    "_id": "6459ff6784c74c42432099d1"
                }
            ],
            "description": "A comfortable apartment with a great view of the city",
            "__v": 0
        }
    ]
}
```
