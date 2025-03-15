$(document).ready(function(){
    var $description = $('.sp-description');
	$(document).on("click", ".g-header-menu__element.menu-conntact-btn", function(){
        $('html, body').animate({ scrollTop: $(".g-footer").offset().top }, 500, function(){
	       	toggleFooter("show");
        });
        return false;
    });
    $description.setMod("scheme", $(".g-header").mod("scheme"));
    $(document).on("click", "#menu .menu-conntact-btn", function(){
        toggleFooter("show");
        return false;
    });

    var holdScroll = -1;
    var holdScrollDirection = '';
    $(window).catchScroll(function (position, api) {
        var holdScrollTimeout = function(direction, api) {
            if (holdScrollDirection == direction && holdScroll != -1) {
                return;
            }
            if (holdScroll == -1 && api.type == 'wheel' && direction == 'up') {
                api.release();
            } else {
                api.catch();
            }
            clearTimeout(holdScroll);
            holdScrollDirection = direction;
            holdScroll = setTimeout(function() {
                api.release();
                holdScroll = -1;
            },500);
        };

        var wrapper = $(".sp-wrapper");

        if (api.type == 'other' ||
            api.type == 'touch' ||
            (api.type == 'scrollbar' && api.isStoppable) ||
            api.type == 'wheel') {
            //����������� ��������������� ������� + ������
            if (position.direction == "down") {
                if (!wrapper.hasMod("scrolled")) {
                    wrapper.setMod("scrolled");
                    holdScrollTimeout("down",api);
                }
            } else {//up
                if (position.y <= 0 && wrapper.hasMod("scrolled")) {
                    wrapper.delMod("scrolled");
                    holdScrollTimeout("up",api);
                } else {
                    if (!wrapper.hasMod("scrolled")) {
                        api.catchTouch();
                    } else {
                        api.release();
                    }
                }
            }
        } else {//���������� � ����������������� �������
            if (position.direction == "down") {
                if (wrapper.hasMod("scrolled")) {
                    clearTimeout(holdScroll);
                    api.release();
                } else {
                    wrapper.setMod("scrolled");
                    api.catch();
                }
            } else {//up
                if ((position.prevY <= 0 || (api.type == 'scrollbar' && position.y <= 0)) && wrapper.hasMod("scrolled")) {
                    wrapper.delMod("scrolled");
                }
            }
        }
    });
    var video = $("video");
    video.each(function(ind, video){
        $(video).wrap($("<div>", {"class": "sp-video", "style": $(video).attr("style") + "; width:" + $(video).attr("width")})).removeAttr("style").css({"width": "100%" }).parent().append(Handlebars.compile($("#video-button").html()));
        $(video)[0].volume = ($.isNumeric($(video).attr("volume")))? $(video).attr("volume") : 1;
    });

    video.on("ended", function(){
        $(this).parent().delMod("active");
    });
    $(document).on("click", ".sp-video", function(){
        if($(this).mod("active"))
            $(this).delMod("active").parent().find("video").get(0).pause();
        else
            $(this).setMod("active").parent().find("video").get(0).play();
    });
});
$(window).on("load", function(){
    var sp_slider = $(".sp-slider");
    if (sp_slider.size()){
        var $img = sp_slider.find("img");
        sp_slider.slidesjs({
            width: $img.width(),
            height: $img.height()
        });
        sp_slider.each(function(){
        	$(this).find(" + p").css({"padding-right": $(this).find(".slidesjs-pagination").width()});
        });
    }
});

function isElementInViewport (el) {

    //special bonus for those using jQuery
    if (typeof jQuery === "function" && el instanceof jQuery) {
        el = el[0];
    }

    var rect = el.getBoundingClientRect();

    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
        rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
    );
}