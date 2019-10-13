const Promise = require('bluebird')
const assert = require('assert')
const highland = require('highland')
module.exports = async (db,schema) =>{
  const {name,indices=[],compound=[],...options} = schema

  function createCollection(name,opts){
    return db.createCollection(name,opts).catch(err=>{
      console.log(err.message)
    })
  }

  function createIndex(collection,name){
    return collection.createIndex({
      [name]:1
    })
  }

  function createIndexes(collection,indexes){
    return Promise.mapSeries(indexes,index=>{
      return createIndex(collection,index)
    })
  }

  function createCompoundIndex(collection,fields){
    const config = fields.reduce((result,name)=>{
      result[name] = 1
      return result
    },{})
    return collection.createIndex(config)
  }

  function createCompoundIndexes(collection,indexes){
    return Promise.mapSeries(indexes,index=>{
      return createIndex(collection,index)
    })
  }
  
  await createCollection(name || schema.table,options)
  const col = db.collection(name || schema.table)
  await createIndexes(col,indices)
  await createCompoundIndexes(col,compound)

  async function get(id){
      assert(id, 'requires id')
      return col.findOne({
        _id: id
      })
  }

  async function getAll(ids=[]){
    return col.find({_id:{$in:ids}}).toArray()
  }

  async function has(id){
    const result = await col.findOne({_id:id},{projection:{'_id':1}})
    return result ? true : false
  }
  async function set(id,props,opts={upsert:true}){
    const query = {}
    if(id) query._id = id 
    await col.replaceOne(query, props, opts)
    return {...query,...props}
  }
  async function upsert(props,opts){
    return set(undefined,props,opts)
  }
  async function update(props,opts={upsert:true}){
    assert(props._id,'requires _id')
    await col.updateOne({_id:props._id}, {$set:props}, opts)
    return props
  }
  async function insert(props,opts){
    await col.insertOne(props,opts)
    return props
  }
  async function getBy(data,options){
    return col.find(data,options).toArray()
  }
  async function del(id){
    await col.deleteOne({ _id: id })
    return { _id: id, id }
  }
  async function deleteAll(ids=[]){
    return col.deleteMany({_id:{$all:ids}})
  }
  function count(props){
    return col.countDocuments(props)
  }

  function streamify(cursor){
    return highland(cursor)
  }

  async function insertMany(docs=[]){
    docs = docs.map(x=> {
      if(x.id && x._id == null) x._id = x.id
      return x
    })
    await col.insertMany(docs)
    return docs
  }

  function drop(){
    return col.deleteMany({})
  }

  function query(){
    return col
  }

  function list(){
    return col.find({}).toArray()
  }

  function readStream(query={}){
    return highland(col.find(query))
  }

  function close(){
    return db.close()
  }


  return {
    set,get,getBy,has,delete:del,streamify,count,drop,insertMany,query,list,
    readStream,deleteAll,collection:query,close,insert,upsert,update,db:()=>db,
    getAll,
  }
}
