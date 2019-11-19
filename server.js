var http = require('http');
var mysql = require('mysql');
var qs = require('querystring');
var url = require('url');
var template = require('./html.js');
var fs = require('fs');
var formidable = require('formidable');
var path = require('path');

var db = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '2019db',
    database : 'diary'
});
db.connect();

var app = http.createServer( function(request, response){
    var reqUrl = request.url;
    var queryData = url.parse(reqUrl, true).query;
    var pathname = url.parse(reqUrl, true).pathname;
    // var filepath = path.join(process.cwd()+"/",'nothing.png');
    // var stat = fs.statSync(filepath);
    // var readStream = fs.createReadStream(filepath);
    // readStream.pipe(response);

    if(pathname === '/'){
        if(queryData.id === undefined){
            db.query(`SELECT * FROM article ORDER BY year,month,date`,function(error,articles){
                if (error){
                    throw error;
                }
                
                var lastday = articles[articles.length-1];                
                var year = lastday.year;
                var id = lastday.id;
                var month = lastday.month;

                var datelist = template.datelist(articles);
                var imgslider;
                var content = template.setArticle(lastday);
                db.query(`SELECT * FROM image WHERE article_id = ?`,[id],function(error2,images){
                    if (error2){
                        throw error2;
                    }
                    

                    if (images.length == 0){
                        var default_img = [{image_link : `/image/nothing.png`}];
                        imgslider = template.imgslider(default_img);
                    }
                    else{
                        imgslider = template.imgslider(images);
                    }

                    var html = template.HTML(year,month,datelist,imgslider,content,id);
                            
                    response.writeHead(200);
                    response.end(html);
                });
                
            });
        }
        else{
            db.query(`SELECT * FROM article ORDER BY year,month,date`,function (error1,articles) {
                if(error1){
                    throw error1;
                }

                db.query(`SELECT * FROM article WHERE id = ? ORDER BY year,month,date `,[queryData.id], function e(error2,article) {
                    
                    var id    = article[0].id;
                    var year  = article[0].year;
                    var month = article[0].month;

                    var datelist = template.datelist(articles);
                    var content = template.setArticle(article[0]);
                    var imgslider;

                    db.query(`SELECT * FROM image WHERE article_id = ?`,[id], function (error3,images) {
                        if(error3){
                            throw error3;
                        }
                        
                        if (images.length == 0){
                            fs.readFile('./nothing.png',function (img) {
                                var default_img = [{image_link : "./nothing.png"}];
                                imgslider = template.imgslider(default_img);
                            });
                            
                        }
                        else{
                            imgslider = template.imgslider(images);
                        }
                        
                        fs.readFile(`./src/home.css`,function (error1,css) {
                            if(error1){
                                throw error1;
                            }
                            fs.readFile(`./src/swipe.js`,function (error2,swipe) {
                                if(error2){
                                    throw error2;
                                }
                                
                                var html = template.HTML(year,month,datelist,imgslider,content,css.toString(),swipe.toString(),id);
                                
                                response.writeHead(200);
                                response.end(html);
                                
                            });
                        });    
                    });   
                });
            });
        }
    }
    
    else if (pathname === '/create'){
        db.query(`SELECT * FROM article`,function (error,articles) {
            if(error){
                throw error;
            }

            var createHTML = template.createArticle();
            console.log(createHTML);
            
            response.writeHead(200);
            response.end(createHTML);

        })
    }
    else if(pathname ==='/image_process'){
        var body = '';
        request.on('data',function (data) {
            body += data;
        });
        request.on('end',function () {
            var post = qs.parse(body);
            var id = post.id;
            console.log(id);
            
        })
        var form = new formidable.IncomingForm();
        form.encoding = "utf-8";

        form.parse(request,function (err,fields,files) {
            var oldpath = files.images.path;
            var newpath = files.images.name;
            var id = files.id.name;
            console.log(id);
            
            fs.rename(oldpath,newpath,function (err) {
            });

            //db.query(`INSERT INTO images(image_link,article_id) VALUSE(?,?)`,[])
        })
        
    }
    else if(pathname ==='/create_process'){
        var body = '';
        request.on('data',function (data) {
            body += data;
        });
        request.on('end',function () {
            var post = qs.parse(body);
            
            var day = post.day;
            console.log(day);
            
            var date = day.split('-');
            var title = post.title;
            var content = post.content;

            db.query(`INSERT INTO article(title,content,year,month,date) VALUES(?,?,?,?,?)`,[title,content,date[0],date[1],date[2]],function (error,result) {
                
                var id = result.insertId;
                var html = template.imgHTML(id);
                response.writeHead(200);
                response.end(html);
            })
        })
    }
    else if( pathname === '/delete_process'){
        var body = '';
        request.on('data',function (data) {
            body += data;
        });
        request.on('end',function () {
            var post = qs.parse(body);
            var id = post.id;

            db.query(`DELETE FROM article WHERE id = ?`,[id],function (error) {
                if (error){
                    throw error;
                }

                response.writeHead(302,{Location: `/`});
                response.end();
            })
        })
    }
    else if(pathname === '/update'){
        db.query(`SELECT * FROM article WHERE id = ?`,[queryData.id],function (error,article) {
            if (error){
                throw error;
            }

            var title = article[0].title;
            var content = article[0].content;
            var year = article[0].year;
            var month = article[0].month;
            var date = article[0].date;

            var updatehtml = template.updateArticle(title,content,year,month,date);
            response.writeHead(200);
            response.end(updatehtml);

        });
    }
    else {
        response.writeHead(404);
        response.end('Not Found');
    }
});

app.listen(3000);
