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
                <form action = "/create_process" method = "post" enctype = "multipart/form-data">
                    <div id = "setDate">
                        <input type = "date" name = "day">
                    </div>
                    <div id = "imageUpload">
                        <input type="file" name = "images" multiple/>
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
                <button onclick = "location.href = '/'">back </button>
            </body>
        </html>
        `;

        return html;
    },
    updateArticle : function (id,title,content,year,month,date,imagelist) {
        var jsfile = fs.readFileSync("./src/file.js");
        var html = `
        <!doctype html>
        <html>
            <head>
                <title> 나만의 비밀 다이어리 글쓰기 </title>
                <meta charset = "utf-8">
                <script>
                    ${jsfile}
                </script>
                <div id = "who">
                    <p>이름 의 비밀 다이어리</p>
                </div>
            </head>
            <body>
                <form action = "/update_process" method = "post" enctype = "multipart/form-data">
                    <div id = "setDate">
                        <input type = "date" name = "day" value = "${year}-${month}-${date}">
                    </div>
                    <div id = "imageUpload">
                        <input type = "file" name = "newImages" multiple/>
                    </div>
                    <div id = "articleUpload">
                        <p> 
                            <input type = "text" name = "title" value = "${title}">
                        </p>
                        <p>
                            <textarea name = "content" >${content}</textarea>
                        </p>
                    </div>
                    <input type = "hidden" id = "deleteImage" name = "deleteImage"> 
                    <input type = "hidden" name = "id" value = "${id}">
                    <input type = "submit">
                </form>
                <button onclick = "location.href='/'">back</button>
                <div id = "currentImages">
                    ${imagelist}
                </div>
                
            </body>
        </html>
        `;

        return html;
    }
}

