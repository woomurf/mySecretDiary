var formidable = require('formidable');
var fs = require('fs');

module.exports = {
    HTML : function(year,month,datelist,imgslider,article,id){
        var cssfile = fs.readFileSync(`./src/home.css`,'utf-8');
        var swipefile = fs.readFileSync(`./src/swipe.js`,`utf-8`);

        var html  = `
            <!DOCTYPE html>
                <html>
                    <head>
                        <title>나만의 비밀 다이어리</title>
                        <meta charset = "utf-8" />
                        <style>
                            ${cssfile}
                        </style>
                        <script>
                            ${swipefile}
                        </script>
                        <div id = "main_date">
                            <h1 id = "year">${year}년 </h1>
                            ${month}
                        </div>
                        <div id = "who">
                            <p>이름 의 비밀 다이어리</p>
                        </div>
                    </head>
                    <body>
                        <div id = "datelist">
                            ${datelist}
                        </div>
                        <section>
                            <div id = "slider-wrap">
                                ${imgslider}
                                <div class = "slider-btns" id = "next"><span>▶</span></div>
                                <div class = "slider-btns" id = "previous"><span>◀</span></div>
    
                                <div id = "slider-pagination-wrap">
                                    <ul>
                                    </ul>
                                </div>
                            </div>
                            <div id = "article-wrap">
                                ${article}
                            </div>                        
                        </section>
                        <a href="/create">create</a> 
                        <a href="/update?id=${id}">update</a>
                        <form action="/delete_process" method = "post">
                            <input type = "hidden" name = "id" value = "${id}">
                            <input type = "submit" value = "delete">
                        </form>
                        
                         
                    </body>
                </html>`;
        return html;

        
    },
    datelist : function(articles){
        var datelist = "";

        articles.forEach(article => {
            datelist += `<button type = "text" value = "${article.id}" class = "btnDate">${article.date}</button>`;
        });

        return datelist;
    },
    monthlist : function (months) {
        var monthlist = `<select name = "month">`;

        
    },

    imgslider : function(imagelist){
        var slider = `<ul id = "slider">`

        imagelist.forEach(img => {
            slider += `<li> <img src = "${img.image_link}"> </li>`;
        });

        slider += `</ul>`;

        return slider;
    },

    setArticle : function(article){
        var content = `<div id = "subject"> <h3>${article.title}</h3> </div>`;

        content += `<div id = "content"> <p>${article.content}</p> </div>`;

        return content;
    },

    createArticle : function () {
        var html = `
        <!doctype html>
        <html>
            <head>
                <title> 나만의 비밀 다이어리 글쓰기 </title>
                <meta charset = "utf-8">
                <div id = "who">
                    <p>이름 의 비밀 다이어리</p>
                </div>
            </head>
            <body>
                <form action = "/create_process" method = "post">
                    <div id = "setDate">
                        <input type = "date" name = "day">
                    </div>
                    <div id = "articleUpload">
                        <p> 
                            <input type = "text" name = "title">
                        </p>
                        <p>
                            <textarea name = "content"></textarea>
                        </p>
                    </div>
                    <input type = "submit">
                </form>
            </body>
        </html>
        `;

        return html;
    },
    imgHTML : function (id) {
        var html = `
        <!doctype html>
        <html>
        <head>
            <meta charset = "utf-8">
        </head>
        <body>
            <form action = "/image_process" method ="post" enctype = "multipart/form-data">

                <div id = "imageUpload">
                    <input type="file" name = "images">
                    <input type = "file" value = "${id}" name = "id">
                </div>
                <input type = "submit" value = "업로드">
            </form>
        </body>
        </html>`;
        return html;
    },
    updateArticle : function (title,content,year,month,date) {
        var html = `
        <!doctype html>
        <html>
            <head>
                <title> 나만의 비밀 다이어리 글쓰기 </title>
                <meta charset = "utf-8">
                <div id = "who">
                    <p>이름 의 비밀 다이어리</p>
                </div>
            </head>
            <body>
                <form action = "/create_process" method = "post">
                    <div id = "setDate">
                        <input type = "date" name = "day" value = "${year}-${month}-${date}">
                    </div>
                    <div id = "imageUpload">
                        <input type="file" name = "images">
                        <input type = "submit">
                    </div>
                    <div id = "articleUpload">
                        <p> 
                            <input type = "text" name = "title" value = "${title}">
                        </p>
                        <p>
                            <textarea name = "content" >${content}</textarea>
                        </p>
                    </div>
                </form>
            </body>
        </html>
        `;

        return html;
    }
}

