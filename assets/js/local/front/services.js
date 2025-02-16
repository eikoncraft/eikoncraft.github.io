$(document).on("ready", function(){
    $(document).on("click", "#menu .menu-conntact-btn, #contact-form-btn", function(){
        toggleFooter("show");
        $('html, body').animate({ scrollTop: $(".g-footer").offset().top }, 500);
        return false;
    });
    var ServicesBrain = function(services, tools){
    $(" .s-list, .s-left-block__title, .s-description").removeClass("s-hidden-block");
        this.tools = tools;
        this.animate = false;
        this.currentService = "all"
        this.$servicesNode = $(".s-list");
        this.$toolsNode = $(".s-tools");
        this.$textBlocks = $(".s-description__text").css({"display": "none"});
        var singleService = $("<div>",{
            "class": "s-tools__list s-tools-list s-tools-list_service-tools",
            "style": "opacity: 0"
        });
        this.$singleServiceTools = $(singleService).append($("<h2>",{
                                        "class": "s-tools-list__title",
                                        "text": "Technologies and tools"
                                    })).append($("<ul>", {
                                        "class": "s-tools-list__block"
                                    }));
        this.$toolsNode.append(this.$singleServiceTools);
        this.$toolsNode.css({"opacity": "0"});
        this.services = this.$servicesNode.find(".s-list-element").map(function(index, service){
            return {"id": $(service).data("id"), "tools": []};
        });
        var servicesCount = this.services.length,
            colorDivider = 278/(this.services.length - 1),
            i = 0;

        this.$servicesNode.find(".s-list-element").each(function(){
            $(this).attr("data-color", colorDivider*i).setMod("transparent");
            i++;
        });

        this.$toolsNode.find(".s-tool").each(function(index, tool){
            $(tool).find(".s-tool__description").css({"left": ($(tool).find(".s-tool__icon").innerWidth() - $(tool).find(".s-tool__description").innerWidth())/2 + "px"});
            var services = (new String($(tool).data("services"))).split(",");
            for(var i = 0; i < services.length; i++)
                for(var k = 0; k < servicesCount; k++)
                    if(this.services[k].id == services[i])
                        this.services[k].tools.push($(tool));
        }.bind(this));
        this.startAnimate();
    };
    
    ServicesBrain.prototype.startAnimate = function(){
        var $services = this.$servicesNode.find(".s-list-element"),
            titleTop = 0,
            i = 1,
            height = $services.height(),
            animateSpeed = 100;
        var promise = $.when();
        this.$textBlocks.filter("[data-id=all]").fadeIn();
        $.each($services, function(index, service){
            $(service).css({"bottom": 0, "position": "absolute", "opacity": "0"});
            promise = promise.then(function(){
                return $(service).css({"opacity": "1"}).find("div").css({"background-color": "#fff"}).parent().animate({"bottom": -height}, animateSpeed).promise();
            }).then(function(result){
                $(service).find(".s-list__square").css({"background-color": "hsl(" + $(service).data("color") + ", 100%, 50%)"})
                        .parent().removeAttr("style").delMod("transparent")
                        .css({  "color": $(service).find(".s-list__square").css("background-color"),
                                "text-shadow": "0px 0px 1em " + $(service).find("div").css("background-color")});
                setTimeout(function(){
                    $(service).setMod("transition").removeAttr("style");
                }, 200);
            });
        });
        promise = promise.then(function(){
            this.$toolsNode.animate({"opacity": "1"}, 500, function(){
                $(this).removeAttr("style");
            });
        }.bind(this));
    };
    ServicesBrain.prototype.hoverAnimate = function(id, event){
        if(event == "leave"){
            this.$toolsNode.find(".s-tool").delMod("hidden");
            for (var i = 0; i < this.services.length; i++) {
                if (this.services[i].id == id) {
                    this.services[i].tools.forEach(function(tool, index){
                        $(tool).delMod("active")
                    });
                }
            }
        }else{
            this.$toolsNode.find(".s-tool").setMod("hidden");
            for (i = 0; i < this.services.length; i++) {
                if (this.services[i].id == id) {
                    this.services[i].tools.forEach(function(tool, index){
                        $(tool).setMod("active")
                    });
                }
            }
        }
    };
    ServicesBrain.prototype.prepareToAnimation = function(tools){
        tools.forEach(function(tool, index){
            this.$singleServiceTools.find(".s-tools-list__block").append($(tool).clone().delMod("hidden"));
        }.bind(this));
    }
    ServicesBrain.prototype.clickAnimate = function(id){
        if(this.animate)
            return;
        var speed = 500;
        this.animate = true;
        if(this.currentService != id){
            if(id == "all"){
                this.$singleServiceTools.animate({"opacity": 0},speed, function(){
                    this.$singleServiceTools.find(".s-tool").remove();
                    this.$toolsNode.delMod("hidden");
                    this.animate = false;
                }.bind(this));
            } else {
                this.$toolsNode.setMod("hidden");
                this.$singleServiceTools.animate({"opacity": 0},speed, function(){
                    this.$singleServiceTools.find(".s-tool").remove();
                    for (var i = 0; i < this.services.length; i++) {
                        if (this.services[i].id == id) {
                            this.prepareToAnimation(this.services[i].tools);

                        }
                    }
                    this.$singleServiceTools.animate({"opacity": 1},speed, function(){
                        this.animate = false;
                    }.bind(this));
                }.bind(this));
            }
            this.$textBlocks.filter("[data-id="+ this.currentService + "]").fadeOut(speed, function(){
                this.$textBlocks.filter("[data-id="+ id + "]").fadeIn(speed);
            }.bind(this));
            this.$servicesNode.find(".s-list-element").delMod("active").filter("[data-id="+ id + "]").setMod("active");
            this.currentService = id;
        } else {
            this.animate = false;
        }
        // if(this.$toolsNode.mod("hidden")){
        //     this.$singleServiceTools.animate({"opacity": 0},500, function(){
        //         this.$singleServiceTools.find(".s-tool").remove();
        //         this.prepareToAnimation(this.services[id].tools);
        //         this.$singleServiceTools.find(".s-tool").removeAttr("style");
        //         this.$singleServiceTools.animate({"opacity": 1},500);
        //         this.animate = false;
        //     }.bind(this));
        // } else {
        //     this.prepareToAnimation(this.services[id].tools);
        //     this.$toolsNode.setMod("hidden");
        //     setTimeout(function(){
        //         var left = 0,
        //             promise = $.when();
        //         $.each(this.$singleServiceTools.find(".s-tool"), function(id, tool){
        //             promise = promise.then(function(){
        //                 var currentLeft = left;
        //                 left += $(tool).width() + 10;
        //                 return $(tool).animate({"top": "0", "left": currentLeft, borderSpacing: -360 }, {
        //                                 step: function(now,fx) {
        //                                 $(this).css('-webkit-transform','rotate('+now+'deg)'); 
        //                                 $(this).css('-moz-transform','rotate('+now+'deg)');
        //                                 $(this).css('transform','rotate('+now+'deg)');
        //                                 },
        //                                 duration: 200
        //                                 },'linear');
        //             }).then(function(result){

        //             });
                
        //         });
        //         promise = promise.then(function(){
        //             this.$singleServiceTools.find(".s-tool").removeAttr("style");
        //             this.animate = false;
        //         }.bind(this));
        //     }.bind(this), 500);

        // }
    };
    var servicesObj = new ServicesBrain();

    function randomColor(){
        var r = Math.round(Math.random()* 255) % 255;
        var g = Math.round(Math.random()* 255) % 255;
        var b = Math.round(Math.random()* 255) % 255;
        return "rgb(" + r + ", " + g + ", " + b + ")";
    }
    
    $(".s-list__element").on("mouseenter", function(){
        $(this).css({"color": $(this).find(".s-list__square").css("background-color")});
        servicesObj.hoverAnimate($(this).data("id"));
    });
    
    $(".s-list__element").on("mouseleave", function(){
        if(!($(this).mod("active")))
            $(this).removeAttr("style");
        servicesObj.hoverAnimate($(this).data("id"), "leave");
    });
    $(".s-list__element").on("click", function(){
        $(this).parent().find(".s-list-element").removeAttr("style");
        $(this).css({"color": $(this).find(".s-list__square").css("background-color")});
        servicesObj.clickAnimate($(this).data("id"));
    });
    $(".s-left-block__title").on("click", function(){
        $(this).parent().find(".s-list-element").removeAttr("style");
        servicesObj.clickAnimate("all"); 
    });
});