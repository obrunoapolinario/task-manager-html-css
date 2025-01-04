// JavaScript
$(document).ready(function () {
    $('.color-square').on('click', function () {
        const color = window.getComputedStyle(this).backgroundColor;
        $('body').css('backgroundColor', color);
        localStorage.setItem('backgroundColor', color);
    });
});