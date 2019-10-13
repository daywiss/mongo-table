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
(https://mongodb.github.io/node-mongodb-native/3.3/api/MongoClient.html#.connect)[Mongo Connection Docs].

```js

//You can spawn tables with the Tables function
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
and other collection options. See (https://mongodb.github.io/node-mongodb-native/3.3/api/Collection.html)[Mongo Collection Options]
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
Get a single document

### async set(id,doc) =>doc
Set a single document (upsert)

### async has(id) => boolean
Check if a document exists by id

### async delete(id) => {_id:string}
Delete single document

### async upsert(doc) => doc
Upsert (update or create if does not exist) document. Assigns id if not provided.

### async update(doc) => doc
Update an existing document, requires an _id.

### async insert(doc) => doc
Insert a new document.

### async getBy(query) => doc[]
Get documents by filtering properties. Uses indexes if they exist. Same as col.find(query).

### async getAll(ids:[]) => doc[]
Get documents by array of _ids.

### async deleteAll(ids:[]) => {_id:string}[]
Delete documents by an array of ids.

### async insertMany(docs:[]) => doc[]
Insert many documents by array of ids. Requres _id on each document.

### async list => doc[]
List all documents in collection as an array.

### async drop() => undefined
Drop documents from collection.

### async close() => undefined
Close Database connection. All collections on this connection will be affectect.

### readStream(query:object) => highland:cursor
Read mongo query as a node compatible stream.

### db() => database
Get the underlying Mongo database object.

### collection() => collection
Get the underlying Mongo collection.





