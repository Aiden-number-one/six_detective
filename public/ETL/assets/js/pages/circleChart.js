var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

(function ($) {
  "use strict";

  $.fn.circleChart = function (options) {
    var _this2 = this;

    var defaults = {
      color: "#0090df",
      backgroundColor: "#e6e6e6",
      background: true,
      speed: 2000,
      widthRatio: 0.2,
      value: 66,
      unit: 'percent',
      counterclockwise: false,
      size: 110,
      startAngle: 0,
      animate: true,
      backgroundFix: true,
      lineCap: "round",
      animation: "easeInOutCubic",
      text: false,
      redraw: false,
      cAngle: 0,
      textCenter: true,
      textSize: false,
      textWeight: 'normal',
      textFamily: 'sans-serif',
      relativeTextSize: 1 / 7,
      autoCss: true,
      onDraw: false
    };

    //Math functions

    Math.linearTween = function (t, b, c, d) {
      return c * t / d + b;
    };
    Math.easeInQuad = function (t, b, c, d) {
      t /= d;
      return c * t * t + b;
    };
    Math.easeOutQuad = function (t, b, c, d) {
      t /= d;
      return -c * t * (t - 2) + b;
    };
    Math.easeInOutQuad = function (t, b, c, d) {
      t /= d / 2;
      if (t < 1) return c / 2 * t * t + b;
      t--;
      return -c / 2 * (t * (t - 2) - 1) + b;
    };
    Math.easeInCubic = function (t, b, c, d) {
      t /= d;
      return c * t * t * t + b;
    };
    Math.easeOutCubic = function (t, b, c, d) {
      t /= d;
      t--;
      return c * (t * t * t + 1) + b;
    };
    Math.easeInOutCubic = function (t, b, c, d) {
      t /= d / 2;
      if (t < 1) return c / 2 * t * t * t + b;
      t -= 2;
      return c / 2 * (t * t * t + 2) + b;
    };
    Math.easeInQuart = function (t, b, c, d) {
      t /= d;
      return c * t * t * t * t + b;
    };
    Math.easeOutQuart = function (t, b, c, d) {
      t /= d;
      t--;
      return -c * (t * t * t * t - 1) + b;
    };
    Math.easeInOutQuart = function (t, b, c, d) {
      t /= d / 2;
      if (t < 1) return c / 2 * t * t * t * t + b;
      t -= 2;
      return -c / 2 * (t * t * t * t - 2) + b;
    };
    Math.easeInQuint = function (t, b, c, d) {
      t /= d;
      return c * t * t * t * t * t + b;
    };
    Math.easeOutQuint = function (t, b, c, d) {
      t /= d;
      t--;
      return c * (t * t * t * t * t + 1) + b;
    };
    Math.easeInOutQuint = function (t, b, c, d) {
      t /= d / 2;
      if (t < 1) return c / 2 * t * t * t * t * t + b;
      t -= 2;
      return c / 2 * (t * t * t * t * t + 2) + b;
    };
    Math.easeInSine = function (t, b, c, d) {
      return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
    };
    Math.easeOutSine = function (t, b, c, d) {
      return c * Math.sin(t / d * (Math.PI / 2)) + b;
    };
    Math.easeInOutSine = function (t, b, c, d) {
      return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
    };
    Math.easeInExpo = function (t, b, c, d) {
      return c * Math.pow(2, 10 * (t / d - 1)) + b;
    };
    Math.easeOutExpo = function (t, b, c, d) {
      return c * (-Math.pow(2, -10 * t / d) + 1) + b;
    };
    Math.easeInOutExpo = function (t, b, c, d) {
      t /= d / 2;
      if (t < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
      t--;
      return c / 2 * (-Math.pow(2, -10 * t) + 2) + b;
    };
    Math.easeInCirc = function (t, b, c, d) {
      t /= d;
      return -c * (Math.sqrt(1 - t * t) - 1) + b;
    };
    Math.easeOutCubic = function (t, b, c, d) {
      t /= d;
      t--;
      return c * (t * t * t + 1) + b;
    };
    Math.easeInOutCubic = function (t, b, c, d) {
      t /= d / 2;
      if (t < 1) return c / 2 * t * t * t + b;
      t -= 2;
      return c / 2 * (t * t * t + 2) + b;
    };
    Math.easeOutCirc = function (t, b, c, d) {
      t /= d;
      t--;
      return c * Math.sqrt(1 - t * t) + b;
    };
    Math.easeInOutCirc = function (t, b, c, d) {
      t /= d / 2;
      if (t < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
      t -= 2;
      return c / 2 * (Math.sqrt(1 - t * t) + 1) + b;
    };

    var Circle = function Circle(pos, bAngle, eAngle, cAngle, radius, lineWidth, sAngle, settings) {
      var circle = Object.create(Circle.prototype);
      circle.pos = pos;
      circle.bAngle = bAngle;
      circle.eAngle = eAngle;
      circle.cAngle = cAngle;
      circle.radius = radius;
      circle.lineWidth = lineWidth;
      circle.sAngle = sAngle;
      circle.settings = settings;
      return circle;
    };

    Circle.prototype = {
      onDraw: function onDraw(el) {
        if (this.settings.onDraw !== false) {
          var copy = _extends({}, this);

          var units = {
            'percent': rToP,
            'rad': function rad(e) {
              return e;
            },
            'default': rToD
          };

          copy.value = (units[this.settings.unit] || units['default'])(copy.cAngle);

          copy.text = function (text) {
            return setCircleText(el, text);
          };
          copy.settings.onDraw(el, copy);
        }
      },
      drawBackground: function drawBackground(ctx) {
        ctx.beginPath();
        ctx.arc(this.pos, this.pos, this.settings.backgroundFix ? this.radius * 0.9999 : this.radius, 0, 2 * Math.PI);
        ctx.lineWidth = this.settings.backgroundFix ? this.lineWidth * 0.95 : this.lineWidth;
        ctx.strokeStyle = this.settings.backgroundColor;
        ctx.stroke();
      },
      draw: function draw(ctx) {
        ctx.beginPath();
        if (this.settings.counterclockwise) {
          var k = 2 * Math.PI;
          ctx.arc(this.pos, this.pos, this.radius, k - this.bAngle, k - (this.bAngle + this.cAngle), this.settings.counterclockwise);
        } else {
          ctx.arc(this.pos, this.pos, this.radius, this.bAngle, this.bAngle + this.cAngle, this.settings.counterclockwise);
        }
        ctx.lineWidth = this.lineWidth;
        ctx.lineCap = this.settings.lineCap;
        ctx.strokeStyle = this.settings.color;
        ctx.stroke();
      },
      animate: function animate(el, ctx, time, startTime, move /*move counterclockwise*/) {
        var _this = this;

        var mspf = new Date().getTime() - time; //milliseconds per frame
        if (mspf < 1) {
          mspf = 1;
        }
        if (time - startTime < this.settings.speed * 1.05 && ( /* time not over */!move && this.cAngle * 1000 <= Math.floor(this.eAngle * 1000) /* move clockwise */ || move && this.cAngle * 1000 >= Math.floor(this.eAngle * 1000) /* move counterclockwise */)) {
          this.cAngle = Math[this.settings.animation]((time - startTime) / mspf, this.sAngle, this.eAngle - this.sAngle, this.settings.speed / mspf);
          ctx.clearRect(0, 0, this.settings.size, this.settings.size);
          if (this.settings.background) {
            this.drawBackground(ctx);
          }
          this.draw(ctx);
          this.onDraw(el);
          time = new Date().getTime();
          rAF(function () {
            return _this.animate(el, ctx, time, startTime, move);
          });
        } else {
          this.cAngle = this.eAngle;
          ctx.clearRect(0, 0, this.settings.size, this.settings.size);
          if (this.settings.background) {
            this.drawBackground(ctx);
          }
          this.draw(ctx);
          this.setCurrentAnglesData(el);
        }
      },
      setCurrentAnglesData: function setCurrentAnglesData(el) {
        var units = {
          'percent': rToP,
          'rad': function rad(e) {
            return e;
          },
          'default': rToD
        };

        var f = units[this.settings.unit] || units['default'];

        el.data("current-c-angle", f(this.cAngle));
        el.data("current-start-angle", f(this.bAngle));
      }
    };

    var setCircleText = function setCircleText(el, text) {
      el.data("text", text);
      $(".circleChart_text", el).html(text);
    };

    var rToD = function rToD(rad) {
      return rad / Math.PI * 180;
    };
    var dToR = function dToR(deg) {
      return deg / 180 * Math.PI;
    };
    var pToR = function pToR(percent) {
      return dToR(percent / 100 * 360);
    };
    var rToP = function rToP(rad) {
      return rToD(rad) / 360 * 100;
    };

    var rAF = function (c) {
      return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
        window.setTimeout(c, 1000 / 60);
      };
    }();

    return this.each(function (idx, element) {
      var el = $(element);
      var cache = {};
      var _data = el.data();
      for (var key in _data) {
        if (_data.hasOwnProperty(key) && key.indexOf('_cache_') === 0) {
          if (defaults.hasOwnProperty(key.substring(7))) {
            cache[key.substring(7)] = _data[key];
          }
        }
      }

      var settings = _extends({}, defaults, cache, _data, options);
      console.log(settings);
      for (var _key in settings) {
        if (_key.indexOf('_cache_') !== 0) el.data('_cache_' + _key, settings[_key]);
      }
      if (!$("canvas.circleChart_canvas", el).length) {
        el.append(function () {
          return $('<canvas/>', { 'class': 'circleChart_canvas' }).prop({ width: settings.size, height: settings.size }).css(settings.autoCss ? {
            "margin-left": "auto",
            "margin-right": "auto",
            "display": "block"
          } : {});
        });
      }
      if (!$("p.circleChart_text", el).length) {
        if (settings.text !== false) {
          el.append("<p class='circleChart_text'>" + settings.text + "</p>");
          if (settings.autoCss) {
            if (settings.textCenter) {
              $("p.circleChart_text", el).css({
                "position": "absolute",
                "line-height": settings.size + "px",
                "top": 0,
                "width": "100%",
                "margin": 0,
                "padding": 0,
                "text-align": "center",
                "font-size": settings.textSize !== false ? settings.textSize : settings.size * settings.relativeTextSize,
                "font-weight": settings.textWeight,
                "font-family": settings.textFamily
              });
            } else {
              $("p.circleChart_text", el).css({
                "padding-top": "5px",
                "text-align": "center",
                "font-weight": settings.textWeight,
                "font-family": settings.textFamily,
                "font-size": settings.textSize !== false ? settings.textSize : settings.size * settings.relativeTextSize
              });
            }
          }
        }
      }

      if (settings.autoCss) {
        el.css("position", "relative");
      }

      if (!settings.redraw) {
        settings.cAngle = settings.currentCAngle ? settings.currentCAngle : settings.cAngle;
        settings.startAngle = settings.currentStartAngle ? settings.currentStartAngle : settings.startAngle;
      }

      var c = $("canvas", el).get(0);
      var ctx = c.getContext("2d");

      var units = {
        'percent': pToR,
        'rad': function rad(e) {
          return e;
        },
        'default': dToR
      };

      var f = units[settings.unit] || units['default'];

      var bAngle = f(settings.startAngle);
      var eAngle = f(settings.value);
      var cAngle = f(settings.cAngle);

      var pos = settings.size / 2;
      var radius = pos * (1 - settings.widthRatio / 2);
      var lineWidth = radius * settings.widthRatio;
      var circle = Circle(pos, bAngle, eAngle, cAngle, radius, lineWidth, cAngle, settings);
      el.data("size", settings.size);
      if (!settings.animate) {
        circle.cAngle = circle.eAngle;
        rAF(function () {
          if (settings.background) {
            circle.drawBackground(ctx);
          }
          if (settings.value !== 0) {
            circle.draw(ctx);
            circle.onDraw(el);
            circle.setCurrentAnglesData(el);
          } else {
            ctx.clearRect(0, 0, _this2.settings.size, _this2.settings.size);
            if (circle.settings.background) {
              circle.drawBackground(ctx);
            }
          }
        });
      } else {
        if (settings.value !== 0) {
          circle.animate(el, ctx, new Date().getTime(), new Date().getTime(), cAngle > eAngle);
        } else {
          rAF(function () {
            ctx.clearRect(0, 0, _this2.settings.size, _this2.settings.size);
            if (circle.settings.background) {
              circle.drawBackground(ctx);
            }
          });
        }
      }
    });
  };
})(jQuery);