var http = require('http');
var fs = require('fs');
var url = require('url');

var app = http.createServer(function (request, response) {
    var _url = request.url;
    var queryData = new URL('http://localhost:3000' + _url).searchParams;
    var pathname = new URL('http://localhost:3000' + _url).pathname;

    console.log(`===로그 시작===`);
    console.log(`queryData : ${queryData}`);
    console.log(`pathname : ${pathname}`);
    console.log(`queryData.get('id') : ${queryData.get('id')}`);

    if (pathname === '/') {
        if (queryData.get('id') === null) {
            console.log('# id = null 내용이 실행됩니다.')
            fs.readdir('./data', function (err, filelist) {
                console.log(`filelist 출력 : ${filelist}`);
                var title = 'Welcome';
                var description = 'Hello, Node.js';
                var list = `<ul>`;
                var i = 0;
                while (i < filelist.length) {
                    list += `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
                    i++;
                }
                list += '</ul>';

                var template = `
                    <!doctype html>
                <html>
                <head>
                  <title>WEB1 - ${title}</title>
                  <meta charset="utf-8">
                </head>
                <body>
                  <h1><a href="/">WEB</a></h1>
                  ${list}
                  <h2>${title}</h2>
                  <p>${description}</p>
                </body>
                </html>
                    `;
                response.writeHead(200);
                response.end(template);
            });

        } else {
            console.log('# id != null 내용이 실행됩니다.')
            fs.readdir('./data', function (err, filelist) {
                console.log(`filelist 출력 : ${filelist}`);
                var title = 'Welcome';
                var description = 'Hello, Node.js';
                var list = `<ul>`;
                var i = 0;
                while (i < filelist.length) {
                    list += `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
                    i++;
                }
                list += '</ul>';

                fs.readFile(`data/${queryData.get('id')}`, 'utf8', function (err, description) {
                    var title = queryData.get('id');
                    var template = `
                <!doctype html>
            <html>
            <head>
              <title>WEB1 - ${title}</title>
              <meta charset="utf-8">
            </head>
            <body>
              <h1><a href="/">WEB</a></h1>
                ${list}
              <h2>${title}</h2>
              <p>${description}</p>
            </body>
            </html>
                `;
                    response.writeHead(200);
                    response.end(template);
                });

            });
        }
        console.log(`url : ${url}`);
        console.log(`_url : ${_url}`);
        console.log(`queryData.id : ${queryData.id}`);
        console.log(`===로그 종료===`);
    } else {
        response.writeHead(404);
        response.end('Not found');
    }


});
app.listen(3000);