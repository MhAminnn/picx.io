document.addEventListener('DOMContentLoaded', function() {
    var fadeElems = document.querySelectorAll('.fade-in-left, .fade-in-right');

    function checkFade() {
        fadeElems.forEach(function(elem) {
            var distInView = elem.getBoundingClientRect().top - window.innerHeight + 20;
            if (distInView < 0) {
                elem.classList.add('appear');
            } else {
                elem.classList.remove('appear');
            }
        });
    }

    window.addEventListener('scroll', checkFade);
    window.addEventListener('resize', checkFade);
    checkFade();
});