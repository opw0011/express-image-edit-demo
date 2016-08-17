var express = require('express');
var multer  = require('multer');
//var gm = require('gm')
var gm = require('gm').subClass({ imageMagick: true });
var fs = require('fs');

var upload = multer({
  // dest: 'uploads/',
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 2*1024*1024 // 2MB file size limit
  }
})
// var upload = multer({ storage: storage })

var app = express();


app.get('/', function(req, res) {
	res.sendFile(__dirname+ '/index.html');	
/*
   res.send('<form method="post" enctype="multipart/form-data" action="/api/avatar">'
     + '<p>Image: <input type="file" name="avatar" /></p>'
     + '<p><input type="submit" value="Upload" /></p>'
     + '</form>');
*/ 
})

var middlewareUpload = upload.single('avatar');


app.post('/api/avatar', function (req, res, next) {
  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any
  middlewareUpload(req, res, function(err) {
    if(err) {
      res.send("ERROR: File size too large");
      console.log(err);
			return;
    }
		
		if(req.file == null) {
			res.send("ERROR: No file is uploaded");
			return;
		}

    // success upload
    console.log(req.file);
  
		// set file header 
		var newFileName = encodeURIComponent("驚天地泣鬼神無碼高清圖.jpg");
 		res.setHeader('Content-Disposition', 'attachment;filename*=UTF-8\'\''+newFileName);
		//res.setHeader('Content-disposition', 'attachment; filename=驚天地泣鬼神無碼高清圖.jpg');
		res.set('Content-Type', 'image/jpg; charset=utf-8');
		gm(req.file.buffer)
        .resize(200,200)
				//.drawText(30, 20, "GMagick!")
				//.draw(['image Over 0,0 300,300 ./image/bg-new.png'])
        .composite('./image/bg-new.png')
				.geometry('+0+0')
				.stream(function streamOut (err, stdout, stderr) {
            if (err) return next(err);
            stdout.pipe(res); //pipe to response

            stdout.on('error', next);
   });	

		//res.write(req.file.buffer);
    // res.send(req.file.buffer.data);
  })
})

app.get('/', function(req, res, next){
	console.log("GET: /");
	res.set('Content-Type', 'image/jpg');
  	
	gm('./uploads/b.jpg')
        .resize(1000,1000)
        .stream('jpg', function streamOut (err, stdout, stderr) {
            if (err) return next(err);
            stdout.pipe(res); //pipe to response

            // the following line gave me an error compaining for already sent headers
            //stdout.on('end', function(){res.writeHead(200, { 'Content-Type': 'ima    ge/jpeg' });}); 

            stdout.on('error', next);
   });	

});

app.listen(8080, function() {
  console.log('Listening on port 8080!');
})
