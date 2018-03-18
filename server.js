const express = require('express');
const bodyParser = require('body-parser');

const app = express();
//To acept incoming POST requests -- put them in req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//THIS CODE WAS USED TO FIX AN OLD PROBLEM, IT MIGHT COME BACK
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');//http://165.227.16.199');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

//sets up a directory called "public" that we'll serve, just like an ordinary web server
app.use(express.static('public'))

let songs = [];
let id = 0;

app.get('/api/songs', (req, res) => {
  res.send(songs);
});

app.post('/api/songs', (req, res) => {
  id = id + 1;
  let song = {id:id, title:req.body.title, artist:req.body.artist, editing:req.body.editing};//, completed: req.body.completed};
  songs.push(song);
  res.send(song);
});

app.listen(3002, () => console.log('Server listening on port 3002!'));

app.put('/api/songs/:id', (req, res) => {
    let id = parseInt(req.params.id);
    let songsMap = songs.map(song => { return song.id; });
    let index = songsMap.indexOf(id);
    let song = songs[index];
    song.title = req.body.title;
    song.artist = req.body.artist;
    song.editing = req.body.editing;
    // handle drag and drop re-ordering
    if (req.body.orderChange) {
      let indexTarget = songsMap.indexOf(req.body.orderTarget);
      songs.splice(index,1);
      songs.splice(indexTarget,0,song);
    }
    res.send(song);
  });
  
  app.delete('/api/songs/:id', (req, res) => {
    let id = parseInt(req.params.id);
    let removeIndex = songs.map(song => { return song.id; }).indexOf(id);
    if (removeIndex === -1) {
      res.status(404).send("Sorry, that song doesn't exist");
      return;
    }
    songs.splice(removeIndex, 1);
    res.sendStatus(200);
  });