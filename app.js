var express = require('express');
var multer  = require('multer')
var gm = require('gm')
var fs = require('fs')

var upload = multer({
  // dest: 'uploads/',
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 1*1024*1024 // 2MB file size limit
  }
})
// var upload = multer({ storage: storage })

var app = express();


// app.get('/', function(req, res) {
//   res.send('<form method="post" enctype="multipart/form-data">'
//     + '<p>Image: <input type="file" name="image" /></p>'
//     + '<p><input type="submit" value="Upload" /></p>'
//     + '</form>');
// })

var middlewareUpload = upload.single('avatar');


app.post('/api/avatar', function (req, res, next) {
  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any
  middlewareUpload(req, res, function(err) {
    if(err) {
      res.send("ERROR: File size too large");
      return;
    }

    // success upload
    console.log(req.file);
    res.write(req.file.buffer);
    // res.send(req.file.buffer.data);
  })
})

app.get('/', function(req, res, next){
  // resize and remove EXIF profile data
  // gm('image.jpeg')
  // .resize(240, 240)
  // .noProfile()
  // .write('image2.jpeg', function (err) {
  //   if(err) res.send(err);
  //
  //   if (!err) console.log('done');
  // });
  // obtain the size of an image
  gm('image.jpeg')
  .size(function (err, size) {
    if (!err)
      console.log(size.width > size.height ? 'wider' : 'taller than you');
  });

});

app.listen(8080, function() {
  console.log('Listening on port 8080!');
})
