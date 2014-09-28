var formidable = require('formidable'),
    http = require('http'),
    util = require('util'),
    fs = require('fs');

http.createServer(function(req, res) {
  if (req.url == '/upload' && req.method.toLowerCase() == 'post') {
    // parse a file upload
    var form = new formidable.IncomingForm();

    form.parse(req, function(err, fields, files) {
      console.log(files);
      res.writeHead(200, {'content-type': 'text/plain'});
      res.write('received upload:\n\n');
      res.end(util.inspect({fields: fields, files: files}));
    });

    return;
  }

  var uploadHTML = fs.readFileSync('public/upload.html', 'utf8');

  // show a file upload form
  res.writeHead(200, {'content-type': 'text/html'});
  res.end(uploadHTML);
}).listen(8080);

function saveFile ()