//app.js
//mbankole 2017
var app  = require('express')()
var express  = require('express')
var server = require('http').createServer(app)
var io = require('socket.io')(server)
var session = require('express-session')({
  secret: "potatoes are cool",
  resave: false,
  saveUninitialized: false
})
var sharedsession = require('express-socket.io-session')
var multer  = require('multer')
var bodyParser = require('body-parser')

var query_parsing = require('./query-parsing')

app.use(session)

io.use(sharedsession(session, {
    autoSave:true
}));

var edit_upload_dest = multer({ dest: 'uploads/edit_uploads/'})
var upload = multer({ dest: 'uploads/' })

app.set('view engine', 'pug')
app.set('views', process.cwd() + '/views')
app.use(express.static('static'))

io.on('connection', function(socket) {
  console.log('a user connected')
  //console.log(socket)
  socket.emit("sessiondata", socket.handshake.session);
  var sess = socket.handshake.session
  console.log(sess)

  if (!sess.count) {
    sess.count = 0
  }
  sess.count++
  //console.log(sess)
  socket.on('edit_connect', function(data) {
    if (true) { //sess.uploaded_query && sess.uploaded_query != {}) {
      socket.emit('uploaded_query_data', { data: sess.uploaded_query })
      sess.uploaded_query = {}
    }
  })
  sess.save()
})


app.get('/', function (req, res) {
  console.log('HIT!!')
  console.log(req)
  var sess = req.session
  if (sess.views) {
    sess.views++
    res.render('index', { title: 'inv '+ sess.views.toString() })
  } else {
    sess.views = 1
    res.render('index', { title: 'first' })
  }
})

app.get('/edit', function (req, res) {
  console.log('served edit')
  var sess = req.session
  sess.edit = 'idk whatever'
  res.render('edit', { title: 'Edit Query' })
})
/*
io.on('connection' , function(socket) {
  console.log('something connected')
})
*/

app.post('/edit-upload', edit_upload_dest.array('upload_file', 1), function (req, res, next) {
  //console.log(req.files)
  var sess = req.session
  var idk = ''
  sess.uploaded_query = 'pending'
  if (req.files[0]['mimetype'] == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
    console.log("uploaded excel file")
    query_parsing.parse_altium_bom(req.files[0]['path']).then (function(parsed) {
      sess.uploaded_query = parsed
      console.log(sess.uploaded_query)
      console.log('set')
    })

    //console.log(sess.uploaded_query)

  }
  else if (req.files[0]['mimetype'] == 'text/csv') {
    console.log("uploaded csv")
    sess.uploaded_query = query_parsing.parse_digikey_csv2(req.files[0]['path'])
    console.log(sess.uploaded_query)
    console.log('set')
  }
  /*else if (req.files[0]['mimetype'] == 'text/csv') {
    console.log("uploaded csv")
    query_parsing.parse_digikey_csv2(req.files[0]['path']).then( function(parsed) {
      //console.log(parsed)
      sess.uploaded_query = parsed
      console.log(sess.uploaded_query)
      console.log('set')
    })
  }*/
  else {
    sess.uploaded_query = "Invalid"
    //res.render('error', {title: 'Error'})
  }
  //setTimeout(1000);
  //console.log(sess.uploaded_query)
  res.render('edit', { title: 'Edit Query' })
})

app.post('/edit-send', upload.array('image', 100), function (req, res, next) {
  console.log(req.files)
  console.log(query_parsing.parse_form(req.body))
  res.render('index', { title: 'hey', message: 'Hello there!' })
})

server.listen(5000, function () {
  console.log('app listening on port 5000!')
})
