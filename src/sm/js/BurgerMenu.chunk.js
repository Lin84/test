/*!
 * frontend
 * name: innogy-web,
 * buildDate: Tue Jul 11 2017 11:09:41 GMT+0200 (CEST),
 * packageVersion: 2.0.0
 */
webpackJsonp([16],{649:function(t,o,e){"use strict";function n(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(o,"__esModule",{value:!0});var r=e(1),i=n(r),a=function(){function t(o){(0,i.default)(this,t),this.node=o.node,this.config=o.config,this.identifier=o.identifier}return t.prototype.init=function(){return this},t.prototype.getIdentifier=function(){return this.identifier},t}();o.default=a},650:function(t,o,e){"use strict";function n(t){return t&&t.__esModule?t:{default:t}}function r(t,o){var e=arguments.length>2&&void 0!==arguments[2]&&arguments[2],n=arguments.length>3&&void 0!==arguments[3]?arguments[3]:500,r=this,i=r.bars[t];return"undefined"==typeof i?h.default.reject(t,n):0===o?h.default.resolve(t):new h.default(function(a,s){r.$scope.one("stopAnimation.burger-svg",function(){i.stop(),s(t)}),i.animate(n).transform({rotation:o},e).after(function(){a(t,n)})})}function i(t,o){var e=arguments.length>2&&void 0!==arguments[2]?arguments[2]:500,n=this,r=n.bars[t];return"undefined"==typeof r?h.default.reject(t,e):o===r.y()?h.default.resolve(t):new h.default(function(i,a){n.$scope.one("stopAnimation.burger-svg",function(){r.stop(),a(t)}),r.animate(e).y(o).after(function(){i(t,e)})})}function a(t){var o=this,e={top:o.bars.middle.attr("origY"),bottom:o.bars.middle.attr("origY")},n={top:j.top,bottom:j.bottom};T&&(o.$scope.trigger("stopAnimation.burger-svg"),["top","bottom"].map(function(t){var e=o.bars[t].transform("rotation");return 0!==e&&(n[t]=n[t]+(e<0?-360-e:-e)),t})),T=!0,x=!0,h.default.all(["top","bottom"].map(function(n){return i.call(o,n,e[n],t/2)})).then(function(e){return o.bars.middle.hide(),h.default.all(e.map(function(e){return r.call(o,e,n[e],!0,t/2)}))}).then(function(){T=!1}).catch(function(t){})}function s(t){var o=this,e={top:o.bars.top.attr("origY"),bottom:o.bars.bottom.attr("origY")},n={top:-j.top,bottom:-j.bottom};T&&(o.$scope.trigger("stopAnimation.burger-svg"),["top","bottom"].map(function(t){var e=o.bars[t].transform("rotation");return 0===e?n[t]=0:n[t]=e<0?-360-e:-e,t})),T=!0,h.default.all(["top","bottom"].map(function(e){return r.call(o,e,n[e],!0,t/2)})).then(function(n){return o.bars.middle.show(),h.default.all(n.map(function(n){return i.call(o,n,e[n],t/2)}))}).then(function(t){t.map(function(t){return o.bars[t].rotate(0),t}),T=!1,x=!1}).catch(function(t){})}function u(){var t=this,o=(0,I.secondsToMS)(M.fx.duration.medium);t.$scope.parents("button").first().on("setActive.offScreen",function(){a.call(t,o)}),t.$scope.parents("button").first().on("setInactive.offScreen",function(){x&&s.call(t,o)})}Object.defineProperty(o,"__esModule",{value:!0});var f=e(1),d=n(f),c=e(3),l=n(c),p=e(2),m=n(p),b=e(12),h=n(b),g=e(649),v=n(g),_=e(6),y=n(_),w=e(167),$=n(w),Y=e(5),A=n(Y),I=e(64),M=e(721),j={top:315,bottom:225},T=!1,x=!1,S=function(t){function o(e){return(0,d.default)(this,o),(0,l.default)(this,t.call(this,e))}return(0,m.default)(o,t),o.prototype.init=function(t){var o=this;o.$scope=(0,y.default)(this.node),A.default.measureInstant(function(){o._w=parseInt(o.$scope.attr("width"),10),o._h=parseInt(o.$scope.attr("height"),10),o.id=o.$scope.attr("id"),o.svg=(0,$.default)(o.id).size(o._w,o._h),o.group=o.svg.group(),o.bars={top:o.svg.select("path[id*=_top], [id*=_top] path").first().addTo(o.svg),middle:o.svg.select("path[id*=_middle], [id*=_middle] path").first().addTo(o.svg),bottom:o.svg.select("path[id*=_down], [id*=_down] path").first().addTo(o.svg)},o.bars.top.attr({origY:o.bars.top.y()}),o.bars.middle.attr({origY:o.bars.middle.y()}),o.bars.bottom.attr({origY:o.bars.bottom.y()}),u.call(o)})},o}(v.default);o.default=S},721:function(t,o){t.exports={fx:{duration:{slow:"0.8s",medium:"0.4s",fast:"0.2s"},easing:"ease-in-out"}}}});
//# sourceMappingURL=/js/BurgerMenu.chunk.js.map