(function ($) {
    "use strict";

    var CatchScroll = function (placeholder, options, callback) {
        var defaultOptions = {
            checkInit: true,
            handlers: ['wheel', 'keyboard', 'touch', 'other'],
            listen: true
        };
        options = $.extend({}, defaultOptions, options);

        var defaults = {
            defaultScroll: 1 / 14,
            oneScreen: 7 / 8,
            timeBetweenEvents: 250,
            touchDistance: 10,
            touchScroll: 5,
            wheelForce: 25,
            chromeWheelMod: 1.4
        };
        var keys = {
            '32': 'spacebar',
            '33': 'pgUp',
            '34': 'pgDown',
            '35': 'end',
            '36': 'home',
            '37': 'left',
            '38': 'up',
            '39': 'right',
            '40': 'down',
            'up': {
                32: -defaults.oneScreen,
                33: -defaults.oneScreen,
                36: -placeholder.height(),
                38: -defaults.defaultScroll,
                'software': -defaults.defaultScroll
            },
            'down': {
                32: defaults.oneScreen,
                34: defaults.oneScreen,
                35: placeholder.height(),
                40: defaults.defaultScroll,
                'software': defaults.defaultScroll
            },
            'wheel': {
                'mousewheel': 1,
                'DOMMouseScroll': 1
            },
            'software': {
                scrollWidth: 15,
                buttonHeight: 15
            }
        };

        var disable = false;
        var listen = options.listen;
        var release = true;
        var scroll = this;

        var manualScroll = false;
        var catchScrollbar = false;
        var browserStoppable = !(
            navigator.userAgent.search("MSIE") > -1 ||
            navigator.userAgent.search("Trident") > -1 ||
            navigator.userAgent.search("Firefox") > -1
        );
        function isTouch() {
            try {
                document.createEvent("TouchEvent");
                return true;
            }
            catch (e) { return false; }
        }
        var supportsTouch = isTouch();
        var body = $("body");
        var bodyBaseCSSPosition = body.css("position");
        if (supportsTouch) {
            body.css("position","fixed")
        }

        var disableDeferred = $.Deferred();
        var enableDeferred = $.Deferred();
        var catchDeferred = $.Deferred();
        var releaseDeferred = $.Deferred();
        var scrollDeferred = $.Deferred();
        scroll.api = {
            disable: function () {
                disable = true;
                disableDeferred.resolve();
                return disableDeferred.promise();
            },
            enable: function () {
                disable = false;
                enableDeferred.resolve();
                return enableDeferred.promise();
            },
            catch: function () {
                release = false;
                catchDeferred.resolve();
                return catchDeferred.promise();
            },
            release: function () {
                release = true;
                releaseDeferred.resolve();
                return releaseDeferred.promise();
            },
            scroll: function (length) {
                manualScroll = true;
                placeholder.scrollTop(length);
                scrollDeferred.resolve();
                return scrollDeferred.promise();
            },
            listen: function () {
                listen = true;
            },
            dontListen: function () {
                listen = false;
            },
            enableCatchScrollbar: function () {
                catchScrollbar = true;
            },
            disableCatchScrollbar: function () {
                catchScrollbar = false;
            },
            catchTouch: function () {
                if (supportsTouch) {
                    body.css("position","fixed");
                }
            },
            releaseTouch: function () {
                if (supportsTouch) {
                    body.css("position",bodyBaseCSSPosition);
                }
            },
            isStoppable: true,
            type: null
        };

        init();

        function init() {
            if ($.isArray(options.handlers)) {
                for (var i = 0, l = options.handlers.length; i < l; i++) {
                    processHandlers(options.handlers[i]);
                }
                return;
            }
            processHandlers(options.handlers);
        }

        function processHandlers(type) {
            switch (type) {
                case 'keyboard':
                    keyboard();
                    break;
                case 'other':
                    other();
                    break;
                case 'touch':
                    touch();
                    break;
                case 'wheel':
                    wheel();
                    break;
                default:
                    other();
                    break;
            }
        }

        function keyboard() {
            placeholder.attr({'tabindex': 0}).on('keydown', function (event) {
                if (!keys[event.keyCode]) {
                    return;
                }
                event.preventDefault();
                var position = getPosition(event);
                scroll.api.type = 'keyboard';
                scroll.api.isStoppable = event.cancelable;
                if (typeof callback === "function" && !disable) {
                    callback(position, scroll.api);
                }
                if (release) {
                    scroll.api.scroll(position.y);
                }
            });
            function getPosition(event) {
                var shiftSpace = event.keyCode == 32 && event.shiftKey;
                var direction = keys.down[event.keyCode] && !shiftSpace ? 'down' : 'up';
                var finalScroll = {};
                finalScroll.x = 0;
                finalScroll.y = placeholder.scrollTop() + placeholder.height() * keys[direction][event.keyCode];
                finalScroll.prevY = placeholder.scrollTop();
                finalScroll.direction = direction;

                return finalScroll
            }
        }

        function other() {
            var midClick = true;
            var scrollbar = false;
            var scrollbarClick = true;
            var midMBScroll = false;
            var prevY = 0;
            placeholder.on('mousedown', function (event) {
                var x = event.clientX;
                var width = event.target.offsetWidth;
                if (width < x && event.target.nodeName == "HTML" && event.button == 0) {
                    scrollbar = true;
                    scrollbarClick = true;
                }
            });
            placeholder.on('mouseup', function(event){
                if (midClick && !midMBScroll && event.button == 1) {
                    midMBScroll = true;//���������� ������ ������� ������� ���� (�������� �� ������)
                } else {
                    midMBScroll = false;
                    midClick = true;
                }
                scrollbar = false;
            });
            placeholder.on('scroll', function (event) {
                midClick = false;
                var position = getPosition(event);
                if (scrollbar) {
                    scroll.api.type = 'scrollbar';
                } else {
                    if (supportsTouch) {
                        scroll.api.type = 'touch';
                    } else {
                        scroll.api.type = 'other';
                    }
                }

                if (browserStoppable) {
                    scroll.api.isStoppable = event.cancelable || !scrollbar || !scrollbarClick || (scrollbar && catchScrollbar);
                } else {
                    scroll.api.isStoppable = event.cancelable;
                }
                if (typeof callback === "function" && !disable) {
                    if (!manualScroll) {
                        callback(position, scroll.api);
                    } else {
                        manualScroll = false;
                    }
                }
                if (!listen || !release) {
                    if (event.cancelable) {
                        event.preventDefault();
                    } else {
                        if (browserStoppable && (!scrollbar || scrollbarClick || (scrollbar && catchScrollbar))) {
                            scrollbarClick = false;
                            scroll.api.scroll(prevY);//����������� �������� � IE & Firefox
                        } else {
                            prevY = placeholder.scrollTop();
                        }
                    }
                    scroll.api.catchTouch();
                } else {
                    scrollbarClick = false;
                    prevY = placeholder.scrollTop();
                    scroll.api.releaseTouch();
                }
            });
            function getPosition(event) {
                var finalScroll = {};
                finalScroll.x = placeholder.scrollLeft();
                finalScroll.y = placeholder.scrollTop();
                finalScroll.prevY = prevY;
                finalScroll.direction = prevY <= finalScroll.y ? 'down' : 'up';
                return finalScroll
            }
        }

        function touch() {
            var startY = null;
            var tempDistY = null;
            var tempDistDiffY = null;
            var eventStart = null;
            var lastTouch = null;

            placeholder.on('touchstart', function (event) {
                var touchobj = event.originalEvent.changedTouches[0];
                startY = parseInt(touchobj.pageY, 10);
                eventStart = $.now();
                lastTouch = event;
                lastTouch.timeStart = eventStart;
                if (!listen) {
                    event.preventDefault();
                }
            });
            placeholder.on('touchmove', function (event) {
                if (!listen || !release) {
                    event.preventDefault();
                    scroll.api.catchTouch();
                }
                var position = getPosition(event);
                lastTouch = event;
                lastTouch.timeStart = $.now();
                scroll.api.type = 'touch';
                scroll.api.isStoppable = event.cancelable;
                if (typeof callback === "function" && !disable) {
                    callback(position, scroll.api);
                }
                if (release) {
                    scroll.api.scroll(position.y);
                    scroll.api.releaseTouch();
                }
            });
            placeholder.on('touchend', function (event) {
                var eventTime = $.now();
                var eNow = event.originalEvent.changedTouches[0];
                var ePrev = lastTouch.originalEvent.changedTouches[0];
                var S = Math.abs(eNow.clientY - ePrev.clientY - eNow.radiusY / 2);
                if (S >= 10 && eventTime - lastTouch.timeStart <= 3) {
                    scroll.api.type = 'touch';
                    var position = getPosition(event);
                    var t = eventTime - lastTouch.timeStart == 0 ? 1 : eventTime - lastTouch.timeStart;
                    var v = S/t;
                    position.y +=  v*15 * (position.direction == 'down' ? 1 : -1);
                    if (typeof callback === "function" && !disable) {
                        callback(position, scroll.api);
                    }
                }
                startY = null;
                tempDistY = 0;
                tempDistDiffY = null;
            });
            function getPosition(event) {
                var finalScroll = {};
                finalScroll.x = placeholder.scrollLeft();
                var touchobj = event.originalEvent.changedTouches[0];
                var dist = parseFloat(touchobj.clientY, 10) - parseFloat(lastTouch.originalEvent.changedTouches[0].clientY, 10);
                finalScroll.direction = dist >= 0 ? 'up' : 'down';
                if (Math.abs(dist) <= touchobj.radiusY / 2) {
                    dist = 0;
                } else {
                    if (dist > 0) {
                        dist -= touchobj.radiusY / 2;
                    } else {
                        dist += touchobj.radiusY / 2;
                    }
                }
                var distDiff = dist - tempDistY;
                var slideY = -1 * distDiff / 1.5;
                finalScroll.y = placeholder.scrollTop() + parseInt(slideY, 10);
                finalScroll.prevY = placeholder.scrollTop();
                tempDistY = dist;
                tempDistDiffY = distDiff;
                return finalScroll;
            }
        }

        function wheel() {
            placeholder.on('mousewheel DOMMouseScroll', function (event) {
                if (event.shiftKey || event.ctrlKey) {
                    return;
                }
                event.preventDefault();
                scroll.api.type = 'wheel';
                scroll.api.isStoppable = event.cancelable;
                var position = getPosition(event);
                if (typeof callback === "function" && !disable) {
                    callback(position, scroll.api);
                }
                if (release) {
                    scroll.api.scroll(position.y);
                }
            });
            function getPosition(event) {
                var finalScroll = {};
                finalScroll.x = 0;
                finalScroll.y = placeholder.scrollTop();
                var delta = -event.originalEvent.wheelDelta * defaults.chromeWheelMod || event.originalEvent.detail * defaults.wheelForce;
                finalScroll.y += delta;
                finalScroll.prevY = placeholder.scrollTop();
                finalScroll.direction = delta < 0 ? 'up' : 'down';
                return finalScroll;
            }
        }

        if (options.checkInit) {
            placeholder.ready(function (event) {
                if (typeof callback === "function") {
                    scroll.api.type = 'other';
                    callback({x: placeholder.scrollLeft(), y: placeholder.scrollTop(), direction: null}, scroll.api);
                }
            });
        }
    };
    $.fn.catchScroll = function (options, callback) {
        if (typeof options === 'function') {
            return new CatchScroll(this, {}, options);
        } else {
            return new CatchScroll(this, options, callback);
        }

    };
})(jQuery);