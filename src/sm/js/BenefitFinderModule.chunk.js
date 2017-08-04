/*!
 * frontend
 * name: innogy-web,
 * buildDate: Tue Jul 11 2017 11:09:41 GMT+0200 (CEST),
 * packageVersion: 2.0.0
 */
webpackJsonp([9],{22:function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=n(1),u=i(o),a=function(){function t(e){(0,u.default)(this,t),this.node=e.node,this.config=e.config,this.identifier=e.identifier}return t.prototype.init=function(){return this},t.prototype.getIdentifier=function(){return this.identifier},t}();e.default=a},123:function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=n(125),u=i(o);e.default={location:u.default}},125:function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}function o(t){return/[\d]{5}\s\D+/.test(t)}function u(t){var e=t.split(" ").join("+");return o(t)&&(e=e.substring(6)),new r.default(function(t,n){s.default.get(f.host+f.path+e,function(e){var n=[];s.default.each(e,function(t,e){e.zip?n.push(e.zip+" "+e.city):n.push(e.city)}),t(n)}).fail(function(t){n(t)})})}Object.defineProperty(e,"__esModule",{value:!0});var a=n(12),r=i(a),l=n(6),s=i(l),f={host:"",path:"/energiekaufhaus/rs/regionalisierung/autocomplete?limit=100&ortEingabe="};e.default={getSuggestions:u,checkSelectedSuggestion:function(t){return new r.default(function(e,n){o(t)&&e(t),u(t).then(function(t){e(t[0])}).catch(function(t){n(t)})})}}},174:function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}function o(t){return/[\d]{5}\s\D+/.test(t)}Object.defineProperty(e,"__esModule",{value:!0});var u=n(1),a=i(u),r=n(3),l=i(r),s=n(2),f=i(s),c=n(211),d=i(c),h=n(5),p=i(h),g=function(t){function e(){return(0,a.default)(this,e),(0,l.default)(this,t.call(this,!0))}return(0,f.default)(e,t),e.prototype.init=function(e,n){var i=this;return t.prototype.init.call(this,e,n),this.$input.on("focus",function(){i.$input.val("")}),this},e.prototype._selectSuggestion=function(e){var n=this;o(e)?(t.prototype._selectSuggestion.call(this,e),p.default.mutateInstant(function(){n.$root.addClass("inline-editing--valid"),n.$root.trigger("select-validated-suggestion",e)})):this.makeSuggestions(e)},e}(d.default);e.default=g},175:function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=n(12),u=i(o),a=n(75),r=i(a),l=window.innogy,s=(new r.default).debugLocal(!0,"REGIONALISATION");if(!l)throw new Error("Cannot use regionalisation functions. No global innogy found");if(!l.regionalisation)throw new Error("Cannot use regionalisation functions. No regionalisation on global innogy found");e.default={getRegionalization:function(){return l.regionalisation.get().catch(function(t){return s.warn("Could not get regionalisation",t),u.default.reject(t)})},regionalize:function(t){var e=t.city,n=t.zip;return l.regionalisation.set(n,e).catch(function(t){return s.warn("Could not set regionalisation",t),u.default.reject(t)})}}},664:function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=n(1),u=i(o),a=n(3),r=i(a),l=n(2),s=i(l),f=n(22),c=i(f),d=n(666),h=i(d),p=function(t){function e(n){return(0,u.default)(this,e),(0,r.default)(this,t.call(this,n))}return(0,s.default)(e,t),e.prototype.init=function(){if(this.node.is("[data-tpl=bfc01]")){var t=new h.default;this.controller=t.init(this.node)}},e}(c.default);e.default=p},666:function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var o=n(1),u=i(o),a=n(3),r=i(a),l=n(2),s=i(l),f=n(9),c=i(f),d=n(175),h=i(d),p=n(174),g=i(p),_=n(123),v=i(_),y=n(5),b=i(y),m=function(t){function e(){return(0,u.default)(this,e),(0,r.default)(this,t.call(this))}return(0,s.default)(e,t),e.prototype._makeRegionalisierung=function(t,e,n){this.location=n,h.default.regionalize(this._splitValue(n)).then(t).catch(function(t){})},e.prototype._splitValue=function(t){var e=t.slice(0,5),n=t.substr(6);return{zip:e,city:n}},e.prototype._checkService=function(){var t=this;h.default.getRegionalization().then(function(){b.default.mutateInstant(function(){t.$root.addClass("available")})}).catch(function(){t.logger.info("Product Finder Service down"),t.$root.addClass("available")})},e.prototype._validateLocation=function(){return this.$autocomplete.is(".inline-editing--valid")},e.prototype._validate=function(){},e.prototype._handleSubmit=function(t){},e.prototype.init=function(t){this.$root=t,this.$autocomplete=t.find(".autocomplete"),this.$form=t.find("form"),this.$area=t.find(".area"),this.$location=t.find(".location"),this.$query=t.find(".query"),this._checkService(),this._validate(),this.$autocomplete.on("select-validated-suggestion",this._makeRegionalisierung.bind(this,function(){})),this.$form.on("submit",this._handleSubmit.bind(this));var e=new g.default,n=v.default[this.$autocomplete.attr("data-gateway")];return e.init(this.$autocomplete,n),this},e}(c.default);e.default=m}});
//# sourceMappingURL=/js/BenefitFinderModule.chunk.js.map