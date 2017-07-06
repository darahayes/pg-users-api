# rh-users-api

This project is a simple API for doing CRUD operations on user objects. It's built with Hapi.js and PostgreSQL.

## Getting Started

### docker-compose

The easiest way to run the API is to use the provided `docker-compose` file. This will spin up the API server in a Docker container along with a postgres container. No additional config is required.

```
docker-compose up
```

Once it's ready the server should be accessible at [http://localhost:3001](http://localhost:3001). The local code is mounted into the container and the process is run with nodemon, making it possible to live reload the app inside the container.

### As a process

My preferred way to run the app is to run postgres in a container and the app as a process. It can be done as follows:

```
docker-compose up postgres
npm run init && npm run start:dev
```

`npm run init` is just a simple wrapper around `npm run db:init && npm run db:migrate && npm run:dbseed`

## API Docs

The server uses the [hapi-swagger](http://npm.im/hapi-swagger) to dynamically generate Swagger based API documentation. You can view the documentation and even run queries against the server using the API explorer. It can be accessed from [http://localhost:3001/api/docs](http://localhost:3001/api/docs)

## Config

The application config `server/config/index.js` defines a set of reasonable defaults and can be reconfigured using environment variables.

You can also copy the`.env.sample` file into `.env` and add your configs there. They will be loaded into `process.env` using the `dotenv` module.

## Potential Improvements

### Testing 

Only the endpoints are tested as there wasn't enough time to go very deep. It would be good if we could test all of the internal functions in `/server/lib/users.js` and maybe mock the callls to the database. 

Testing the endpoints against a running database as a whole should at least give some decent coverage. Essentially they are integration tests.

### The User Data Model

The user is modelled in postgres as a single table. For quicker development the `location`, `street` and `name` fields were implemented as `jsonb` columns. However this approach leads to more difficult searching and the potential for the user table to bloat in the future. There might have been a better way to split the data into relational tables with foreign keys.

### Searching

We have the ability to search by username and by email. By itself, the SQL `LIKE` operator tends to be very slow. However using a Postgres feature called `trigram indexes`, we can add a special index to our searchable fields which allows us to have reasonably fast fuzzy text searches with the like operator, e.g. `SELECT * from users where email LIKE %alsion%`.

One limitation of our data model was that the name and location fields were in `jsonb` columns which we can't create trigram indexes for. There was another possible way of implementing a full text search but there wasn't enough time to get it to work properly.

## Endpoints

### GET /api/user

List users. It's possible to request the desired user fields or to use `fields=all` to return all fields. By default only `username`, `email` and `name` is returned. This endpoint also has pagination support using `limit` & `offset`. The result will also provide `next_page` - a url to the next page of results.

```
curl http://localhost:3001/api/user?fields=email&fields=username&fields=name&fields=dob&fields=pps&offset=50&limit=10
```

Which returns:

```
{
  "rows": [
    {
      "email": "tammy.harris@example.com",
      "username": "bigrabbit420",
      "name": {
        "last": "harris",
        "first": "tammy",
        "title": "ms"
      },
      "dob": "1970-01-13T13:57:40.878Z",
      "pps": "8512356T"
    },
    ..,
  ],
  "nextPage": "http://0.0.0.0:3001/api/user?offset=60&limit=10&fields=email&fields=username&fields=name&fields=dob&fields=pps"
}
```

### POST /api/user

Create a user oject.

```
curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' -d '{
  "email": "bruce@wayne.org",
  "username": "batman",
  "password": "alfred123",
  "name": {
    "title": "Mr",
    "first": "Bruce",
    "last": "Wayne"
  }
}' 'http://localhost:3001/api/user'
```

### PUT /api/user/:id

Update a user by ID.

```
curl -X PUT --header 'Content-Type: application/json' --header 'Accept: application/json' -d '{
  "gender": "male",
  "location": {
    "street": "Wayne Manor",
    "city": "Gotham City",
    "state": "New York"
  }
}' 'http://localhost:3001/api/user/101'
```

Returning:

```
{
  "id": 101,
  "email": "bruce@wayne.org",
  "username": "batman",
  "phone": null,
  "cell": null,
  "dob": null,
  "pps": null,
  "gender": "male",
  "location": {
    "city": "Gotham City",
    "state": "New York",
    "street": "Wayne Manor"
  },
  "name": {
    "last": "Wayne",
    "first": "Bruce",
    "title": "Mr"
  },
  "picture": null
}
```

### POST /api/user/login

Fake login endpoint that takes a email/username and password combo and verifies the password against the user's hashed password stored at the time of user creation.

```
curl -i -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' -d '{
  "login": "batman", #Can also be bruce@wayne.org
  "password": "alfred123"
}' 'http://localhost:3001/api/user/login'
```

### DELETE /api/user/id

Deletes a user by ID.

```
curl -X DELETE --header 'Accept: application/json' 'http://localhost:3001/api/user/101' # bye bye batman
```

### GET /api/user/search

Search for users either by `email` or `username`. There wasn't enough time to get full text search working properly.
Again, it's possible to request the desired fields or to use `fields=all` to return all fields.

```
curl -X GET --header 'Accept: application/json' 'http://localhost:3001/api/user/search?query=alison&fields=email'
```

which returns:

```
[
  {
    "email": "alison.reid@example.com"
  },
  {
    "email": "alison.hamilton@example.com"
  },
  {
    "email": "alison.fox@example.com"
  }
]
```





