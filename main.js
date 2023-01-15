var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

function templateHTML(title, list, body, control) {
    console.log(`templateHTML 함수가 실행됩니다.`)
    return `
        <!doctype html>
        <html>
        <head>
        <title>WEB1 - ${title}</title>
        <meta charset="utf-8">
        </head>
        <body>
        <h1><a href="/">WEB</a></h1>
        ${list}
        ${control}
        ${body}
        </body>
        </html>
        `;
}

function templateList(filelist) {
    console.log(`templateList 함수가 실행됩니다.`)
    var list = `<ul>`;
    var i = 0;
    while (i < filelist.length) {
        list += `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
        i++;
    }
    list += '</ul>'
    return list;
}

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
                var list = templateList(filelist);

                var template = templateHTML(title, list, `<h2>${title}</h2>${description}`, `<a href="/create">create</a>`);
                response.writeHead(200);
                response.end(template);
            });

        } else {
            console.log('# id != null 내용이 실행됩니다.')
            fs.readdir('./data', function (err, filelist) {
                console.log(`filelist 출력 : ${filelist}`);
                var list = templateList(filelist);

                fs.readFile(`data/${queryData.get('id')}`, 'utf8', function (err, description) {
                    var title = queryData.get('id');
                    var template = templateHTML(title, list, `<h2>${title}</h2>${description}`, `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`);
                    response.writeHead(200);
                    response.end(template);
                });

            });
        }
        console.log(`url : ${url}`);
        console.log(`_url : ${_url}`);
        console.log(`queryData.id : ${queryData.id}`);
        console.log(`===로그 종료===`);
    } else if (pathname === '/create') {
        console.log('# pathname = /create 내용이 실행됩니다.')
        fs.readdir('./data', function (err, filelist) {
            console.log(`filelist 출력 : ${filelist}`);
            var title = 'WEB - create';
            var list = templateList(filelist);
            var template = templateHTML(title, list, `
                <form action="/create_process" method="post">
                <p><input type="text" name="title" placeholder="title"></p>
                <p><textarea name="description" placeholder="description"></textarea></p>
                <p><input type="submit"></p>
                </form>
            `, ``);
            response.writeHead(200);
            response.end(template);
        });
    } else if (pathname === '/create_process') {
        var body = '';
        request.on('data', function (data) {
            body += data;
        });
        request.on('end', function () {
            var post = qs.parse(body);
            var title = post.title;
            var description = post.description;
            console.log(post.title);
            fs.writeFile(`data/${title}`, description, 'utf8', function (err) {
                console.log(`File saved.`)
                response.writeHead(302, { Location: `/?id=${title}` });
                response.end();
            })
        });


    } else if (pathname === '/update') {
        console.log('pathname = /update 내용이 실행됩니다.')
        fs.readdir('./data', function (err, filelist) {
            fs.readFile(`data/${queryData.get('id')}`, 'utf8', function (err, description) {
                var title = queryData.get('id');
                var list = templateList(filelist);
                var template = templateHTML(title, list, `
                <form action="/update_process" method="post">
                <input type ="hidden" name= "id" value ="${title}>
                <p><input type="text" name="title" placeholder="title" value="${title}"></p>
                <p><textarea name="description" placeholder="description">${description}</textarea></p>
                <p><input type="submit"></p>
                </form>
                `
                    , "update 모드입니다."
                );
                response.writeHead(200);
                response.end(template);
            });

        });
    } else if (pathname === '/update_process') {
        var body = '';
        request.on('data', function (data) {
            body += data;
        });
        request.on('end', function () {
            var post = qs.parse(body);
            var id = post.id;
            var title = post.title;
            var description = post.description;
            console.log(`${id}, ${title}, ${description}`);

            fs.rename(`data/${id}`, `data/${title}`, function (error) {
                fs.writeFile(`data/${title}`, description, 'utf8', function (err) {
                    console.log(`File edit saved.`)
                    response.writeHead(302, { Location: `/?id=${title}` });
                    response.end();
                })
                console.log(post);
                /*
                
                    
                })*/
            });
        } else {
            response.writeHead(404);
            response.end('Not found');
        }


});
app.listen(3000);