var http = require('http');
var fs = require('fs');
var url = require('url');


var app = http.createServer(function (request, response) {
    var _url = request.url;
    var queryData = new URL('http://localhost:3000' + _url).searchParams;
    var pathname = new URL('http://localhost:3000' + _url).pathname;

    console.log(`url : ` + url);
    console.log(`queryData : ` + queryData);
    console.log(`queryData.get('id') : ` + queryData.get('id'));
    console.log(`pathname : ` + pathname)

    if (pathname == '/index.html') {
        response.end("index")
    }

    fs.readdir('./data', function (error, filelist) {
        console.log(filelist);

        var list = `<ol>`;
        var i = 0;
        while (i < filelist.length) {
            list += `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
            i = i + 1;
        }

        list += `</ol>`

        fs.readFile(`data/${queryData.get('id')}`, 'utf8', function (err, description) {
            var template = `
            <!doctype html>
            <html>
            <head>
            <title>WEB1 - ${queryData.get('id')}</title>
            <meta charset="utf-8">
            </head>
            <body>
            <h1><a href="index.html">WEB</a></h1>
            ${list}
            <h2>${queryData.get('id')}</h2>
            <p>${description}</p>
            </body>
            </html>
    `;

            response.writeHead(200);
            response.end(template);
        });
    });
});
app.listen(3000);