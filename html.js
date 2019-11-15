module.exports = {
    HTML : function(year,month,datelist,imgslider,article,cssfile,swipefile){
        
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
                            <h2 id = "month">${month}월 </h2>
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
    }
}

