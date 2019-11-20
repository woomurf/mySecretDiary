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

var minetype = {
    '.js' : 'text/javascript',
    '.css' : 'text/css',
    '.png' : 'image/png',
    '.jpg' : 'image/jpeg'
}

var app = http.createServer( function(request, response){
    var reqUrl = request.url;
    var queryData = url.parse(reqUrl, true).query;
    var pathname = url.parse(reqUrl, true).pathname;
    var ext = path.parse(reqUrl).ext;


    // 이미지 요청이 들어오면 확장자를 통해서 해당 이미지를 서버에 올려준다. 
    if(Object.keys(minetype).includes(ext)){
        imgname = qs.unescape(reqUrl);
       
        fs.readFile(`${__dirname}${imgname}`,function (error,data) {
            if(error){
                throw error;
            }
            
            response.statusCode = 200;
            response.setHeader('Content-Type',minetype[ext]);
            response.end(data);
        })
    }
    // 홈 화면 
    else if(pathname === '/'){
        // 게시글이 선택되지 않으면, 가장 최근 날짜의 게시글을 보여준다.
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
                        var default_img = [{image_link : `./image/nothing.png`}];
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
        // 게시글이 선택되었을 때
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
                            
                            var default_img = [{image_link : "/image/nothing.png"}];
                            imgslider = template.imgslider(default_img);
                            
                        }
                        else{
                            imgslider = template.imgslider(images);
                        }
                                
                        var html = template.HTML(year,month,datelist,imgslider,content,id);
                        
                        response.writeHead(200);
                        response.end(html);
                        ;    
                    });   
                });
            });
        }
    }
    // 게시글 작성 화면 - create. 
    else if (pathname === '/create'){
        db.query(`SELECT * FROM article`,function (error,articles) {
            if(error){
                throw error;
            }

            var createHTML = template.createArticle();
            
            response.writeHead(200);
            response.end(createHTML);

        })
    }
    // /create에서 작성한 내용을 받아 db에 저장하는 create_process
    else if(pathname ==='/create_process'){
        var form = new formidable.IncomingForm();
        form.encoding = "utf-8";
        form.multiples = true;

        form.parse(request,function (err,fields,files) {
            
            var day = fields.day;
            var title = fields.title;
            var content = fields.content;
            console.log(fields);
            console.log(files);

            date = day.split('-');

            db.query(`INSERT INTO article(title,content,year,month,date) VALUES(?,?,?,?,?)`,[title,content,date[0],date[1],date[2]],function (error,result) {
                var id = result.insertId;
                files.images.forEach(image => {
                    var oldpath = image.path;
                    var newpath = __dirname + "/image/"+image.name;
                    fs.rename(oldpath,newpath,function (err) {
                    });
                    imagelink = "./image/" + image.name;    
                    db.query(`INSERT INTO image(image_link,article_id) VALUES(?,?)`,[imagelink,id]);
                });
                response.writeHead(302,{Location: `/?id=${id}`});
                response.end();
            });
            
        });
    }
    // 게시글을 삭제하는 delete_process
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
    // 게시글을 수정하는 update
    else if(pathname === '/update'){
        
        db.query(`SELECT * FROM article WHERE id = ?`,[queryData.id],function (error,article) {
            if (error){
                throw error;
            }
            db.query(`SELECT * FROM image WHERE article_id = ? `,[queryData.id],function (error,images) {
                
                var imagelist = `<div id = "preview_wrapper">`;

                images.forEach(image => {
                    imagelist += `<div><img id = "image${image.id}"src = "${image.image_link}"> <button id = "${image.id}" class = "btnDelete">사진삭제</button></div>`;
                });
                imagelist += `</div>`;

                var title = article[0].title;
                var content = article[0].content;
                var year = article[0].year;
                var month = article[0].month;
                var date = article[0].date;

                var updatehtml = template.updateArticle(queryData.id,title,content,year,month,date,imagelist);
                response.writeHead(200);
                response.end(updatehtml);
            })

        });
    }
    // 수정된 정보를 db에 넣어주는 update_process
    else if (pathname === '/update_process'){
        var form = new formidable.IncomingForm();
        form.encoding = "utf-8";
        form.multiples = true;
        form.parse(request,function (err,fields,files) {
            
            var day = fields.day;
            var title = fields.title;
            var content = fields.content;
            var id = fields.id;
            var dlist = fields.deleteImage;
            var images = files.newImages;

            deletes = dlist.split(',');
            for(let i = 0; i < deletes.length; i++){
                db.query(`DELETE FROM image WHERE id = ?`,[deletes[i]]);
            }

            images.forEach(image => {
                var oldpath = image.path;
                var newpath = __dirname + "/image/"+image.name;
                fs.rename(oldpath,newpath,function (err) {
                });
                imagelink = "./image/" + image.name;    
                db.query(`INSERT INTO image(image_link,article_id) VALUES(?,?)`,[imagelink,id]);
            });

            console.log(fields);
            
            date = day.split('-');

            db.query(`UPDATE article SET title = ?,content = ?, year = ?, month = ? ,date = ? WHERE id = ${id} `,[title,content,date[0],date[1],date[2]],function (error,result) {
            
                response.writeHead(302,{Location: `/?id=${id}`});
                response.end();
             
            });
        });
    }
    else {
        response.writeHead(404);
        response.end('Not Found');
    }
});

app.listen(3000);
