const assert = require('assert')
const mongo = require('mongodb')
module.exports = async (config={}) => {
  const {uri,...options} = config
  assert(uri, 'requires uri')
  const db = (await mongo.connect(config.uri, options)).db()
  return db
}


