window.onload = function(){
    //slide-wrap
    var slideWrapper = document.getElementById("slider-wrap");
    //current slideIndexition
    var slideIndex = 0;
    //items
    var slides = document.querySelectorAll('#slider-wrap ul li');
    //number of slides
    var totalSlides = slides.length;
    //get the slide width
    var sliderWidth = slideWrapper.clientWidth;
    //set width of items
    slides.forEach(function (element) {
        element.style.width = sliderWidth + 'px';
    })
    //set width to be 'x' times the number of slides
    var slider = document.querySelector('#slider-wrap ul#slider');
    slider.style.width = sliderWidth * totalSlides + 'px';

    // next, prev
    var nextBtn = document.getElementById('next');
    var prevBtn = document.getElementById('previous');
    nextBtn.addEventListener('click', function () {
        plusSlides(1);
    });
    prevBtn.addEventListener('click', function () {
        plusSlides(-1);
    });

    // hover
    slideWrapper.addEventListener('mouseover', function () {
        this.classList.add('active');
        
    });
    slideWrapper.addEventListener('mouseleave', function () {
        this.classList.remove('active');
    });


    function plusSlides(n) {
        showSlides(slideIndex += n);
    }

    function currentSlides(n) {
        showSlides(slideIndex = n);
    }

    function showSlides(n) {
        slideIndex = n;
        if (slideIndex == -1) {
            slideIndex = totalSlides - 1;
        } else if (slideIndex === totalSlides) {
            slideIndex = 0;
        }

        slider.style.left = -(sliderWidth * slideIndex) + 'px';
        pagination();
    }

    //pagination
    slides.forEach(function () {
        var li = document.createElement('li');
        document.querySelector('#slider-pagination-wrap ul').appendChild(li);
    })

    function pagination() {
        var dots = document.querySelectorAll('#slider-pagination-wrap ul li');
        dots.forEach(function (element) {
            element.classList.remove('active');
        });
        dots[slideIndex].classList.add('active');
    }

    pagination();


    /* date눌러서 게시글 넘기기 기능 */
    var dateBtn = document.getElementsByClassName("btnDate");
    for(let i = 0; i < dateBtn.length; i++){
        dateBtn[i].onclick = function () {
            location.href = '/?id='+this.value;
        }
    }
    
}