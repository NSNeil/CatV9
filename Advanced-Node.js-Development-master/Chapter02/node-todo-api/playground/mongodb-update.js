const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
  if(err){
    return console.log('Unable to connect MongoDB server');
  }
  console.log('Connected to MongoDB server');
  const db = client.db('TodoApp');


  // db.collection('Todos').findOneAndUpdate({
  //   _id: new ObjectID('5a86c378baa6685dd161da6e')
  // }, {
  //   $set: {
  //     completed:true
  //   }
  // }, {
  //   returnOriginal: false
  // }).then((result) => {
  //   console.log(result);
  // });

  db.collection('Users').findOneAndUpdate({
    _id: new ObjectID('5ae462eb845f39a314efb90d')
  }, {
    $set: {
      name: 'CatV9'
    },
    $inc: {
      age: 1
    }
  }, {
    returnOriginal: false
  }).then((result) => {
    console.log(result);
  });

  client.close();
});
