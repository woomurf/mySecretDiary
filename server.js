var http = require('http');
var mysql = require('mysql');
var qs = require('querystring');
var url = require('url');
var template = require('./html.js');
var fs = require('fs');

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

    if(pathname === '/'){
        if(queryData.id === undefined){
            db.query(`SELECT * FROM article`,function(error,articles){
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
                        var default_img = ["./nothing.png"];
                        imgslider = template.imgslider(default_img);
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
                            
                            var html = template.HTML(year,month,datelist,imgslider,content,css.toString(),swipe.toString());
                            
                            response.writeHead(200);
                            response.end(html);
                            
                        });
                    });
                });
                
            });
        }
        else{
            db.query(`SELECT * FROM article`,function (error1,articles) {
                if(error1){
                    throw error1;
                }

                db.query(`SELECT * FROM article WHERE id = ?`,[queryData.id], function e(error2,article) {
                    
                    var id    = article[0].id;
                    var title = article[0].title;
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
                            var default_img = ["./nothing.png"];
                            imgslider = template.imgslider(default_img);
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
                                
                                var html = template.HTML(year,month,datelist,imgslider,content,css.toString(),swipe.toString());
                                
                                response.writeHead(200);
                                response.end(html);
                                
                            });
                        });    
                    });

                    
                });
            });
        }
    }
    else {
        response.writeHead(404);
        response.end('Not Found');
    }
});

app.listen(3000);
