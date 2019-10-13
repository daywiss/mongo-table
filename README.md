# Mongo Table
Simplifies initializing database, collection and indexes while providing
common basic mongo calls. 

## Install
`yarn add https://github.com/daywiss/mongo-table.git`

## API
Include in your code: `const Mongo = require('mongo-table')`

If you just want to connect to the db use: `const DB = require('mongo-table/db').


### Init
Initializes through mongo uri and passes through options to the standard mongo driver.
[https://mongodb.github.io/node-mongodb-native/3.3/api/MongoClient.html#.connect](Mongo Connection Docs).

```js

You can spawn tables with the Tables function
require('mongo-table')({
  uri:'your mongo db uri',
  //some various options
  useNewUrlParser:true,
  useUnifiedTopology:true,
}).then(async Tables=>{
  const userTable = await Tables({
    name:'users',
    indices:['email'],
  })
  //do something with user table
})

```
### Schema
Theres a really basic schema object which you can pass to the table to initialize indices
and other collection options. See [https://mongodb.github.io/node-mongodb-native/3.3/api/Collection.html](Mongo Collection Options)
for additional options.

```
{
  name:string //the name of the collection, required,
  indices:string[], //array of keys on the data which you want to index
  compound:[     //array of array of data keys you want to index
    string[]
  ],
  ...collectionOptions
}
```

### async get(id) => doc
### async set(id,doc) =>doc
### async has(id) => boolean
### async delete(id) => {_id:string}

### async upsert(doc) => doc
### async update(doc) => doc
### async insert(doc) => doc

### async getBy(ids:[]) => doc[]
### async deleteAll(ids:[]) => {_id:string}[]
### async insertMany(docs:[]) => doc[]
### async list => collection[]

### async drop() => undefined
### async close() => undefined

### readStream(query:object) => highland:cursor
### db() => database
### collection() => collection





