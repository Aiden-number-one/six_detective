!(function(c) {
  var e,
    n =
      '<svg><symbol id="iconarrow-up" viewBox="0 0 1024 1024"><path d="M512 325.27804301l-305.5203706 333.45002447h611.04137771z"  ></path></symbol><symbol id="iconfilter1" viewBox="0 0 1024 1024"><path d="M788.84918795 206.4796294H235.1555858C209.71385492 206.4796294 196.87603214 237.34912062 214.90292746 255.37601533L435.61990853 476.1264133V722.04524464c0 9.3458204 4.56013022 18.10446824 12.21723452 23.465396l95.47511402 66.80871109C562.14830339 825.50446523 588.38009147 812.14152933 588.38009147 788.85395574V476.1264133l220.72294826-220.75039797C827.09293842 237.38492379 814.34343016 206.4796294 788.84918795 206.4796294z" fill="" ></path></symbol><symbol id="iconarrow-down" viewBox="0 0 1024 1024"><path d="M512 687.05183468l286.42534743-312.60939794-572.85129161 0z"  ></path></symbol></svg>',
    t = (e = document.getElementsByTagName('script'))[e.length - 1].getAttribute('data-injectcss');
  if (t && !c.__iconfont__svg__cssinject__) {
    c.__iconfont__svg__cssinject__ = !0;
    try {
      document.write(
        '<style>.svgfont {display: inline-block;width: 1em;height: 1em;fill: currentColor;vertical-align: -0.1em;font-size:16px;}</style>',
      );
    } catch (e) {
      console && console.log(e);
    }
  }
  !(function(e) {
    if (document.addEventListener)
      if (~['complete', 'loaded', 'interactive'].indexOf(document.readyState)) setTimeout(e, 0);
      else {
        var t = function() {
          document.removeEventListener('DOMContentLoaded', t, !1), e();
        };
        document.addEventListener('DOMContentLoaded', t, !1);
      }
    else
      document.attachEvent &&
        ((o = e),
        (i = c.document),
        (l = !1),
        (d = function() {
          try {
            i.documentElement.doScroll('left');
          } catch (e) {
            return void setTimeout(d, 50);
          }
          n();
        })(),
        (i.onreadystatechange = function() {
          'complete' == i.readyState && ((i.onreadystatechange = null), n());
        }));
    function n() {
      l || ((l = !0), o());
    }
    var o, i, l, d;
  })(function() {
    var e, t;
    ((e = document.createElement('div')).innerHTML = n),
      (n = null),
      (t = e.getElementsByTagName('svg')[0]) &&
        (t.setAttribute('aria-hidden', 'true'),
        (t.style.position = 'absolute'),
        (t.style.width = 0),
        (t.style.height = 0),
        (t.style.overflow = 'hidden'),
        (function(e, t) {
          t.firstChild
            ? (function(e, t) {
                t.parentNode.insertBefore(e, t);
              })(e, t.firstChild)
            : t.appendChild(e);
        })(t, document.body));
  });
})(window);
