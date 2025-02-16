$(document).ready(function () {
    'use strict';
    setTimeout(function(){
        $(".g-construction").fadeOut(1000);
    },3000);

    var $header = $(".g-header"),
        imgPath = "assets/img/",
        $headerNode = $header.find(".g-header-state").find(".g-logo img.g-logo-toggle__mod-img").attr("src", imgPath + "logo_white.png").parents(".g-header-state"),
        //$.unique() only for DOM elements
        headerColorSchemes = uniqueInArray(
            $(".p-slide").map(function () {
                return $(this).mod("type");
            }).get()
        ),
        firstHeaderColorScheme = $header.mod("scheme");

    for (var i = 0; i < headerColorSchemes.length; i++) {
        if (headerColorSchemes[i] == firstHeaderColorScheme) {
            continue;
        }

        $header
            .append(
            $headerNode.clone()
                .setMod("type", headerColorSchemes[i])
                .find(".g-logo img.g-logo-toggle__current-img")
                .attr("src", imgPath + "logo_" + headerColorSchemes[i] + ".png")
                .parents(".g-header-state")
        );
    }


    $(document).on("click", ".g-header-menu__element.menu-conntact-btn", function () {
        $('html, body').animate({scrollTop: $(".g-footer").offset().top}, 500, function () {
            toggleFooter("show");
        });
        return false;
    });
    $(document).on("click", "#menu .menu-conntact-btn", function () {
        toggleFooter("show");
        return false;
    });
    var slider;
    var ProjectSlider = function (speed) {
        this.speed = speed;
        this.slideStart = 1;
        this.currentSlide = this.slideStart;
        this.isButtonClick = false;
        this.$header = $(".g-header");
        this.$slider = $(".p-slider__slides");
        this.$slider.slidesjs({
            height: this.$slider.height(),
            start: this.slideStart,
            pagination: false,
            navigation: false,
            effect: {
                slide: {
                    speed: this.speed
                }
            },
            fadeEasing: "linear",
            callback: {
                start: this.animateSlider.bind(this)
            }
        });
        this.sliderApi = this.$slider.data("plugin_slidesjs");
        this.$pagination = $(".p-slider__pagination").find(".p-single");
        this.$pagination.each(function (i) {
            $(this).attr("data-slide-num", i);
        }).eq(this.slideStart - 1).setMod("active");
        this.$slider.find(".slidesjs-container").append(Handlebars.compile($("#slider-nav-tpl").html()));
    };
    ProjectSlider.prototype.inFIrstLine = function (current) {
        var $element = this.$pagination.filter("[data-slide-num = '" + current + "']");
        var slideInline = Math.round(this.$pagination.parents(".p-slider__pagination").width() / $element.width());
        return $element.index() < slideInline;
    };
    ProjectSlider.prototype.animateSlider = function (next, current) {
        this.$pagination = $(".p-slider__pagination").find(".p-single");
        this.currentSlide = next;
        if (this.inFIrstLine(current) && this.inFIrstLine(next) || this.isButtonClick) {
            $(".g-header").delMod("menu-toggle").delMod("substrate").setMod("animate").delMod("hidden").css({
                "position": "absolute",
                "top": 0,
                "left": 0,
                "transition": "background-color 0s linear"
            });
            $('html, body').animate({scrollTop: $(".p-slider").offset().top}, 500, function () {
                $(".g-header").delMod("animate").removeAttr("style")
            });
            this.animateLinePagination(next);

        } else {
            this.animatePagination(next);
        }
        this.setActiveSlider(next);
        this.animateHeader(next);
    };
    ProjectSlider.prototype.setActiveSlider = function (next) {
        this.$pagination.delMod("active").each(function () {
            if ($(this).data("slide-num") == next) {
                $(this).setMod("active");
            }
        });
    };
    ProjectSlider.prototype.animatePagination = function (next) {
        var current = this.$pagination.filter("[data-slide-num='" + next + "']"),
            currentWidth = $(current).width(),
            $container = $(current).closest(".p-pagination__block"),
            containerWidth = $container.width(),
            slideInLine = Math.round(containerWidth / currentWidth),
            currentIndex = $(current).index(),
            animateSlides = [];
        this.$pagination.each(function () {
            $(this).css({"height": $(this).height(), "overflow": "hidden"});
        });
        var lineIndex = 0;
        while (lineIndex + slideInLine < currentIndex + 1) lineIndex += slideInLine;
        for (var i = 0; i < lineIndex; i++) {
            animateSlides.push(this.$pagination.eq(i));
        }
        this.$pagination.parent().append(animateSlides);
        for (var i = animateSlides.length - 1; i >= 0; i--) {
            this.$pagination.parent().prepend(animateSlides[i].clone().addClass("clone").removeClass("p-single_active"));
        }
        var $clones = this.$pagination.parent().find(".clone");
        $(".g-header").delMod("menu-toggle").delMod("substrate").setMod("animate").delMod("hidden").css({
            "position": "absolute",
            "top": 0,
            "left": 0,
            "transition": "background-color 0s linear"
        });
        $clones.animate({height: 0}, 600, function () {
            $clones.remove();
        });
        $('html, body').animate({scrollTop: $(".p-slider").offset().top}, 600, function () {
            $(".g-header").delMod("animate").removeAttr("style")
        });
    };
    ProjectSlider.prototype.animateLinePagination = function (next) {
        var current = this.$pagination.filter(".p-single_active"),
            currentWidth = $(current).width(),
            containerWidth = $(current).closest(".p-pagination").width(),
            slideInLine = Math.round(containerWidth / currentWidth);
        if (this.direction == "right" && Math.round($(current).parent().width() - $(current).position().left - $(current).width()) == 0) {
            var firstAnimateSlides = this.$pagination.filter(":first"),
                animateSlides = this.$pagination.filter(":nth-child(" + slideInLine + "n + 1)").not(firstAnimateSlides);
            $(current).parent().css({width: currentWidth * slideInLine + 1});
            this.$pagination.each(function () {
                $(this).css({width: $(this).width()});
            });
            this.$pagination.parent().css({width: currentWidth + containerWidth + 1});
            $(animateSlides).each(function () {
                $(this).after($(this).clone().addClass("clone"));
            });
            this.$pagination.parent().append(firstAnimateSlides)
                .prepend(firstAnimateSlides.clone().addClass("clone"))
                .animate({"margin-left": -currentWidth}, 500, function () {
                    $(this).removeAttr("style").find(".p-single").removeAttr("style");
                    $(this).find(".clone").remove();
                });
        } else if (this.direction == "left" && $(current).position().left == 0) {
            var lastAnimateSlides = this.$pagination.filter(":last"),
                animateSlides = this.$pagination.filter(":nth-child(" + slideInLine + "n + 6)").not(lastAnimateSlides);
            $(current).parent().css({width: currentWidth * slideInLine + 1});
            this.$pagination.each(function () {
                $(this).css({width: $(this).width()});
            });
            this.$pagination.parent().css({width: currentWidth + containerWidth + 1, "margin-left": -currentWidth});

            $(animateSlides).each(function () {
                $(this).before($(this).clone().addClass("clone"));
            });
            this.$pagination.parent().prepend(lastAnimateSlides)
                .append(lastAnimateSlides.clone().addClass("clone"))
                .animate({"margin-left": 0}, 500, function () {
                    $(this).removeAttr("style").find(".p-single").removeAttr("style");
                    $(this).find(".clone").remove();
                });
        }
    };
    ProjectSlider.prototype.animateHeader = function (next) {
        var currentMod = this.$header.mod("scheme"),
            newMod = this.$slider.find(".p-slide").eq(next).mod("type");

        if (currentMod == newMod) return;
        var $currentHeader = this.$header.find(".g-header-state").byMod("type", currentMod),
            $newHeader = this.$header.find(".g-header-state").byMod("type", newMod),
            width = $currentHeader.width(),
            prWidth = "100%",
            speed = this.speed;
        if (this.direction == "right") {
            $currentHeader.setMod("direction", "left");
            $newHeader.setMod("direction", "right");
        } else {
            $currentHeader.setMod("direction", "right");
            $newHeader.setMod("direction", "left");
        }
        var currentInner = $currentHeader.find(".g-header-state__inner"),
            newInner = $newHeader.find(".g-header-state__inner");
        currentInner.css({"width": width});
        newInner.css({"width": width});
        $currentHeader.animate({"width": 'toggle'}, speed / 2);
        $newHeader.animate({"width": prWidth}, speed / 2, function () {
            currentInner.removeAttr("style");
            newInner.removeAttr("style");
            $currentHeader.removeAttr("style");
            $newHeader.removeAttr("style");
        });
        this.$header.setMod("scheme", newMod);
    };
    ProjectSlider.prototype.next = function () {
        slider.direction = "right";
        this.isButtonClick = true;
        this.sliderApi.next();
    };
    ProjectSlider.prototype.prev = function () {
        slider.direction = "left";
        this.isButtonClick = true;
        this.sliderApi.previous();

    };
    ProjectSlider.prototype.goto = function (number) {
        if (this.currentSlide < number) {
            this.direction = "right";
        } else {
            this.direction = "left";
        }
        this.isButtonClick = false;
        this.sliderApi.goto(number);
    };
    slider = new ProjectSlider(1000);
    $(document).on("click", "#next", function () {
        slider.next();
    });
    $(document).on("click", "#prev", function () {
        slider.prev();
    });
    $(".p-pagination .p-info").on("click", function (e) {
        if ($(e.target).closest(".p-info__link, .p-info__view-link").size() > 0) {
            return true;
        }

        slider.goto($(this).parents(".p-single").data("slide-num") + 1);
    });
});

function uniqueInArray(array) {
    var newArray = [];
    for (var i = 0, j = array.length; i < j; i++) {
        if (newArray.indexOf(array[i]) == -1) {
            newArray.push(array[i]);
        }
    }
    return newArray;
}