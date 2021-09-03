const express = require('express')
const path = require('path')
const Datastore = require('nedb')
const app = express()
const port = 8080
app.listen(port)

const database = new Datastore('database.bd')
database.loadDatabase();

app.use(express.static(path.join(__dirname, '/public')));

// parse url-encoded content from body
app.use(express.urlencoded({ extended: false }))

// parse application/json content from body
app.use(express.json())

// serve index.html as content root
app.get('/', function(req, res){

    var options = {
        root: path.join(__dirname, 'public')
    }

    res.sendFile('index.html', options, function(err){
        console.log(err)
    })
})

app.post('/favbooks', function(req, res){
  const data =req.body;
  database.find({id: data.id},(err,books)=> {
  if(books.length==0){
    console.log(books);
    database.insert(data);
    res.json({
     status: 'success',
     id: data.id,
     title: data.title,
     author: data.author,
     img: data.img
  });
  }else{
  console.log("Book already in fav!")
  res.json({
   status: 'book_is_in_fav',
});
  }
});
});

app.post('/find_fav', function(req, res){
  const data =req.body;
  database.find({id: data.id},(err,books)=> {
  if(books.length==0){
    res.json({
     status: 'not_in_fav',
      });
  }else{
  res.json({
   status: 'book_is_in_fav',
});
  }
});
});

app.post('/remove_fav', function(req, res){
  const data =req.body;
  database.find({id: data.id},(err,books)=> {
  if(books.length==0){
    console.log(books);
    res.json({
     status: 'book_is_not_in_fav',
  });
  }else{
  console.log("Book already in fav!")
  const my_id = books[0]._id;
  console.log(books[0]._id)

  database.remove({ _id: my_id }, { multi: true}, function (err, numRemoved) {
    if(err){
      console.log("err")
      console.log(err);
    }else{
      res.json({
       status: 'success',
    });
    }
  });
  }
});
});

app.get('/favbooks', function(req, res){
  database.find({},(err,data)=> {
    if(err){
      res.end();
      return;
    }
    res.json(data);

  });
});
