(function(){
    var lastScrollTop = 0;
    $(window).on("scroll", function(){
        var st = $(this).scrollTop();
        var direction;
        if (st > lastScrollTop){
            direction = "down";
        } else {
            direction = "up";
        }
        lastScrollTop = st;
        $(window).trigger("scroll-"+direction);
    });
})();

function toggleFooter(direction) {
    var speed = 600;
    if(direction === 0){
        $(".g-footer").find(".g-footer-big").hide();
        $(".g-footer").removeClass("g-footer_big").find(".g-footer-small").show();
    } else if (direction == "show") {
        $(".g-footer").find(".g-footer-small").fadeOut(speed / 2, "linear", function () {
            $(".g-footer").addClass("g-footer_big").find(".g-footer-big").fadeIn(speed / 2);
        });
        if(!($(".g-footer").mod("fixed")))
            $('html, body').animate({scrollTop: $(".g-footer").offset().top}, 500, function () {});
    } else {
        $(".g-footer").find(".g-footer-big").fadeOut(speed / 2, "linear", function () {
            $(".g-footer").removeClass("g-footer_big").find(".g-footer-small").fadeIn(speed / 2);
        });
    }
}
function IsEmail(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
}
$(document).ready(function () {
    'use strict';

    var mainMenu = $(".g-header-menu > div").clone();

    mainMenu.find("a").map(function(i, val){
        if(i == mainMenu.find("a").length - 1) {
            return $(this).attr("class", "g-menu__element menu-conntact-btn");
        }

        return $(this).attr("class", "g-menu__element");
    });

    $("#menu").html(mainMenu);

    $("#contact-form-btn").on("click", function () {
        toggleFooter("show");
        setTimeout(contactFormSubmitted, 1000)
    });

    $(".g-footer-big__close").on("click", function () {
        toggleFooter("hide");
    });

    $(document).on("click", ".g-header__menu-btn", function () {
        if ($("#menu").hasClass("g-menu_visible") && $(window).scrollTop() !== 0) {
            $(".g-header").setMod("hidden").setMod("substrate").setMod("menu-toggle");
        }
        if ($(".g-footer").hasMod("big"))
            toggleFooter(0);
        setTimeout(function(){
            $(".g-footer").toggleClass("g-footer_fixed");
        }, 200);
        $("#menu").toggleClass("g-menu_visible");
        $(this).toggleClass("g-burger-menu_active");
        $(".g-header").toggleClass("g-header_menu-open");
        $(".g-logo-toggle").toggleClass("g-logo-toggle_mod");
        setTimeout(function () {
            $(".g-header__menu-btn").toggleClass("menu_hover");
        }, 430);
        return false;
    });

    $(".g-contact-form__input, .g-contact-form__text").on("blur", function () {
        if ($(this).val() == "" || ($(this).attr("name") == "form[email]" && !IsEmail($(this).val()))) {
            $(this).delMod("active")
        } else {
            $(this).setMod("active")
        }
    });

    window.contactFormSubmit = function() {
        var errorForm = false;
        $(".g-contact-form").find(".g-contact-form__input, .g-contact-form__text").each(function () {
            if (($(this).val() == "") || ($(this).attr("name") == "form[email]" && !IsEmail($(this).val()))) {
                $(this).setMod("error");
                errorForm = true;
            }
        });
        if(errorForm)
            return false;
        $(".g-contact-form form").submit();
    };
    /*
    $(".g-contact-form__submit").on("click", function(){
        contactFormSubmit();
    });
    */
    $(".g-contact-form__text").keydown(function (e) {
        if (e.ctrlKey && e.keyCode == 13) {
            contactFormSubmit();
        }
    });
    $(".g-contact-form__input, .g-contact-form__text").on("input", function () {
        $(this).delMod("error");
    });
    var lastScrollTop = 0;
    $(window).on("scroll", function (event) {
        var st = $(this).scrollTop();
        if (!$(".g-header").hasMod("menu-open") && !$(".g-header").hasMod("animate")) {
            if (st > lastScrollTop) {
                $(".g-header").setMod("hidden");
                if(st > 2*$(window).height()/3) {
                    $(".g-header").setMod("substrate").setMod("menu-toggle");
                }
            } else {
                if(st > 2*$(window).height()/3) {
                    $(".g-header").delMod("hidden");
                }
                if (st == 0 && !($(".g-header").hasMod("hidden"))) {
                    var $currentHeader = $(".g-header-state").byMod("type", $(".g-header").mod("scheme")),
                        $headerMenu = $currentHeader.find(".g-header-menu"),
                        headerMenuWidth = $headerMenu.width();
                    $headerMenu.width(headerMenuWidth);
                    $headerMenu.find(".g-header-menu__element").each(function () {
                        $(this).css({
                            right: headerMenuWidth - $(this).position().left - $(this).width() + "px",
                            width: $(this).width() + "px"
                        });
                        $(this).css({"position": "absolute", "margin": 0});
                    });
                    setTimeout(function () {
                        $(".g-header-state").byMod("type", $(".g-header").mod("active")).find(".g-header-menu").setMod("animate");
                        $(".g-header").delMod("substrate");
                    }, 5);
                    setTimeout(function () {

                        $(".g-header").delMod("menu-toggle")
                            .find(".g-header-state")
                            .byMod("type", $(".g-header").mod("active"))
                            .find(".g-header-menu")
                            .delMod("animate")
                            .removeAttr("style")
                            .find(".g-header-menu__element")
                            .removeAttr("style");
                    }, 705);
                }else if(st==0){
                    $(".g-header")
                        .delMod("hidden")
                        .delMod("substrate")
                        .delMod("menu-toggle")
                        .find(".g-header-state")
                        .byMod("type", $(".g-header").mod("active"))
                        .find(".g-header-menu")
                        .delMod("animate")
                        .removeAttr("style")
                        .find(".g-header-menu__element")
                        .removeAttr("style");

                }
            }
        }
        lastScrollTop = st;
    });

    window.contactFormSubmitted = function () {
        var $this = $('.g-contact-form');
        var $title = $('.g-contact-form__title');
        var $form = $this.find('form');
        console.log($form);
        $this.addClass('g-contact-form_submitted');
        setTimeout(function(){
            var template = Handlebars.compile($("#contact-success-msg").html());
            $title.html(template({email: ''}));
            $form.css('visibility', 'hidden');
        }, 600);
    }

    $('.g-contact-form').on('submit', function(){
        var $this = $(this);
        var $title = $('.g-contact-form__title');
        var $form = $this.find('form');
        var email = $this.find('[type="email"]').val();
        $.ajax({
            type: $form.attr('method'),
            url: $form.attr('action'),
            data: $form.serialize(),
            success: function (data) {
                console.log(data);
            },
            error: function (err) {
                console.log(err);
            }
        });
        return false;
    });

});