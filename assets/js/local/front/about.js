$(document).ready(function () {
    $(".g-footer").setMod("big").find(".g-footer-big__close").setMod("hide");

    $(document).on("click", ".g-header-menu__element.menu-conntact-btn", function () {
        $('html, body').animate({scrollTop: $(".g-footer").offset().top}, 500);
        return false;
    });
    $(".g-header__menu-btn").on("click", function () {
        var $header = $(".g-header");
        $header.toggleClass("g-header_substrate", $header.hasClass("g-header_substrate"));
    });
    $(".c-jedi__join-btn").on("click", function () {
        $('html, body').animate({scrollTop: $("#vacancies").offset().top}, 500);
    });
    var $people = $(".c-jedi").not(".c-jedi_padawan"),
        $padavan = $(".c-jedi_padawan"),
        $vacancies = $("#vacancies"),
        $c_people = $(".c-people"),
        peopleHeight = $people.height(),
        slidesInLine = Math.round($people.parent().width() / $people.width()),
        speed = 600;
    $people.each(function () {
        $(this).css({"transition-duration": (Math.floor(Math.random() * (speed - 101)) + 100) + "ms"});
    });
    for (var i = 1; i <= 4; i++) {
        $people.filter(":nth-child(" + slidesInLine + "n + " + i + ")").css({"transition-delay": 100 * i + "ms"});
    }
    $people.setMod("hidden");
    $padavan.addClass("c-jedi_padawan-hidden");
    $(".c-people").css({"height": $(".c-people").height()});
    $(window).on("resize", function () {
        $c_people.removeAttr("style");
        $(".c-people").css({"height": $(".c-people").height()});
    });
    $(window).on("scroll", function (event) {
        var scroll = $(window).scrollTop() + $("html").height() - peopleHeight;
        $people.each(function () {
            if ($(this).offset().top < scroll) {
                $(this).delMod("hidden");
            }
        });
        if ($vacancies.offset().top < scroll + peopleHeight + 20) {
            $padavan.removeClass("c-jedi_padawan-hidden");
            $(".c-people").removeAttr("style");
        }
    });
});