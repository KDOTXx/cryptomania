/*!
 * jQuery UI Touch Punch 0.2.3
 *
 * Copyright 2011–2014, Dave Furfero
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Depends:
 *  jquery.ui.widget.js
 *  jquery.ui.mouse.js
 */(function(t){if(t.support.touch="ontouchend"in document,!t.support.touch)return;var e=t.ui.mouse.prototype,i=e._mouseInit,h=e._mouseDestroy,n;function u(o,r){if(!(o.originalEvent.touches.length>1)){o.preventDefault();var s=o.originalEvent.changedTouches[0],c=document.createEvent("MouseEvents");c.initMouseEvent(r,!0,!0,window,1,s.screenX,s.screenY,s.clientX,s.clientY,!1,!1,!1,!1,0,null),o.target.dispatchEvent(c)}}e._touchStart=function(o){var r=this;n||!r._mouseCapture(o.originalEvent.changedTouches[0])||(n=!0,r._touchMoved=!1,u(o,"mouseover"),u(o,"mousemove"),u(o,"mousedown"))},e._touchMove=function(o){!n||(this._touchMoved=!0,u(o,"mousemove"))},e._touchEnd=function(o){!n||(u(o,"mouseup"),u(o,"mouseout"),this._touchMoved||u(o,"click"),n=!1)},e._mouseInit=function(){var o=this;o.element.bind({touchstart:t.proxy(o,"_touchStart"),touchmove:t.proxy(o,"_touchMove"),touchend:t.proxy(o,"_touchEnd")}),i.call(o)},e._mouseDestroy=function(){var o=this;o.element.unbind({touchstart:t.proxy(o,"_touchStart"),touchmove:t.proxy(o,"_touchMove"),touchend:t.proxy(o,"_touchEnd")}),h.call(o)}})(jQuery);
