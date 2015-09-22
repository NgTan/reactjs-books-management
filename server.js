var express    = require('express');
var bodyParser = require('body-parser');
var fs         = require('fs');
var path       = require('path');
var app        = express();

app.set('port', process.env.PORT || 3000);

app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get('/books.json', function (req, res) {
  fs.readFile('books.json', function (error, data) {
    if (error) {
      throw error;
    }

    res.setHeader('Cache-Control', 'no-cache');
    res.json(JSON.parse(data));
  });
});

app.post('/books.json', function (req, res) {
  fs.readFile('books.json', function (error, data) {
    if (error) {
      throw error;
    }

    var books = JSON.parse(data);

    switch (req.body.action) {
      case 'ADD':
        delete req.body.action;
        books.push(req.body);
        break;
      case 'REMOVE':
        books.splice(req.body.index, 1);
        break;
      case 'UPDATE':
        break;
    }

    fs.writeFile('books.json', JSON.stringify(books, null, 2), function (error) {
      if (error) {
        throw error;
      }

      res.setHeader('Cache-Control', 'no-cache');
      res.json(books);
    });
  });
});

app.listen(app.get('port'), function () {
  console.log('Listening on port', app.get('port'));
});
