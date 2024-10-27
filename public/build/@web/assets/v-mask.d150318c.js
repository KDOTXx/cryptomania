function J(r,e){var n=Object.keys(r);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(r);e&&(t=t.filter(function(a){return Object.getOwnPropertyDescriptor(r,a).enumerable})),n.push.apply(n,t)}return n}function m(r){for(var e=1;e<arguments.length;e++){var n=arguments[e]!=null?arguments[e]:{};e%2?J(Object(n),!0).forEach(function(t){K(r,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(r,Object.getOwnPropertyDescriptors(n)):J(Object(n)).forEach(function(t){Object.defineProperty(r,t,Object.getOwnPropertyDescriptor(n,t))})}return r}function h(r){return typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?h=function(e){return typeof e}:h=function(e){return e&&typeof Symbol=="function"&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},h(r)}function K(r,e,n){return e in r?Object.defineProperty(r,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):r[e]=n,r}var Q="_",le="function",pe=[];function ge(){var r=arguments.length>0&&arguments[0]!==void 0?arguments[0]:pe,e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:Q;if(!Y(r))throw new Error("Text-mask:convertMaskToPlaceholder; The mask property must be an array.");if(r.indexOf(e)!==-1)throw new Error(`Placeholder character must not be used as part of the mask. Please specify a character that is not present in your mask as your placeholder character.

`+"The placeholder character that was received is: ".concat(JSON.stringify(e),`

`)+"The mask that was received is: ".concat(JSON.stringify(r)));return r.map(function(n){return n instanceof RegExp?e:n}).join("")}function Y(r){return Array.isArray&&Array.isArray(r)||r instanceof Array}var ve="[]";function de(r){for(var e=[],n;n=r.indexOf(ve),n!==-1;)e.push(n),r.splice(n,1);return{maskWithoutCaretTraps:r,indexes:e}}var me=[],g="";function Z(){var r=arguments.length>0&&arguments[0]!==void 0?arguments[0]:g,e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:me,n=arguments.length>2&&arguments[2]!==void 0?arguments[2]:{};if(!Y(e))if(h(e)===le)e=e(r,n),e=de(e).maskWithoutCaretTraps;else throw new Error("Text-mask:conformToMask; The mask property must be an array.");var t=n.guide,a=t===void 0?!0:t,u=n.previousConformedValue,i=u===void 0?g:u,f=n.placeholderChar,o=f===void 0?Q:f,y=n.placeholder,c=y===void 0?ge(e,o):y,ue=n.currentCaretPosition,N=n.keepCharPositions,E=a===!1&&i!==void 0,C=r.length,$=i.length,U=c.length,ie=e.length,k=C-$,O=k>0,v=ue+(O?-k:0),L=v+Math.abs(k);if(N===!0&&!O){for(var D=g,A=v;A<L;A++)c[A]===o&&(D+=o);r=r.slice(0,v)+D+r.slice(v,C)}for(var l=r.split(g).map(function(ce,B){return{char:ce,isNew:B>=v&&B<L}}),p=C-1;p>=0;p--){var F=l[p].char;if(F!==o){var oe=p>=v&&$===ie;F===c[oe?p-k:p]&&l.splice(p,1)}}var s=g,q=!1;e:for(var d=0;d<U;d++){var H=c[d];if(H===o){if(l.length>0)for(;l.length>0;){var z=l.shift(),b=z.char,se=z.isNew;if(b===o&&E!==!0){s+=o;continue e}else if(e[d].test(b)){if(N!==!0||se===!1||i===g||a===!1||!O)s+=b;else{for(var fe=l.length,M=null,x=0;x<fe;x++){var S=l[x];if(S.char!==o&&S.isNew===!1)break;if(S.char===o){M=x;break}}M!==null?(s+=b,l.splice(M,1)):d--}continue e}else q=!0}E===!1&&(s+=c.substr(d,U));break}else s+=H}if(E&&O===!1){for(var V=null,T=0;T<s.length;T++)c[T]===o&&(V=T);V!==null?s=s.substr(0,V+1):s=g}return{conformedValue:s,meta:{someCharsRejected:q}}}var j={__nextCharOptional__:!0},w={"#":/\d/,A:/[a-z]/i,N:/[a-z0-9]/i,"?":j,X:/./},he=function(e){var n=e.lastIndexOf("/");return new RegExp(e.slice(1,n),e.slice(n+1))},ye=function(e){return he(e.toString().replace(/.(\/)[gmiyus]{0,6}$/,function(n){return n.replace("/","?/")}))},ke=function(e){return"[\\^$.|?*+()".indexOf(e)>-1?"\\".concat(e):e},Oe=function(e){return new RegExp("/[".concat(ke(e),"]/"))},be=function(e){return e instanceof RegExp},xe=function(e){return be(e)?e:Oe(e)};function _(r){var e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:w;return r.map(function(n,t,a){var u=e[n]||n,i=a[t-1],f=e[i]||i;return u===j?null:f===j?ye(xe(u)):u}).filter(Boolean)}function Te(r){var e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:w;return _(r.split(""),e)}function Re(r){var e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:w,n=r.map(function(t){return t instanceof RegExp?t:typeof t=="string"?t.split(""):null}).filter(Boolean).reduce(function(t,a){return t.concat(a)},[]);return _(n,e)}var we=function(e,n){var t=document.createEvent("HTMLEvents");t.initEvent(n,!0,!0),e.dispatchEvent(t)},P=function(e){return e instanceof HTMLInputElement?e:e.querySelector("input")||e},ee=function(e){return typeof e=="function"},I=function(e){return typeof e=="string"},Ee=function(e){return e instanceof RegExp};function re(r,e){return Array.isArray(r)?Re(r,e):ee(r)?r:I(r)&&r.length>0?Te(r,e):r}function Ce(){var r=new Map,e={previousValue:"",mask:[]};function n(u){return r.get(u)||m({},e)}function t(u,i){r.set(u,m(m({},n(u)),i))}function a(u){r.delete(u)}return{partiallyUpdate:t,remove:a,get:n}}function ne(r){var e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:w;return r===null||Array.isArray(r)||h(r)!=="object"?e:Object.keys(r).reduce(function(n,t){var a=r[t];return a!==null&&!(a instanceof RegExp)?n:m(m({},n),{},K({},t,a))},e)}var R=Ce();function Ae(r){we(r,"input")}function W(r){var e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!1,n=r.value,t=R.get(r),a=t.previousValue,u=t.mask,i=n!==a,f=n.length>a.length,o=n&&i&&f;if((e||o)&&u){var y=Z(n,u,{guide:!1}),c=y.conformedValue;r.value=c,Ae(r)}R.partiallyUpdate(r,{previousValue:n})}function X(r,e,n){var t=re(e,n);R.partiallyUpdate(r,{mask:t})}function G(r){var e=Array.isArray(r)?r:[r],n=e.filter(function(t){return I(t)||Ee(t)});return n.toString()}function te(){var r=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},e=ne(r&&r.placeholders);return{bind:function(t,a){var u=a.value;t=P(t),X(t,u,e),W(t)},componentUpdated:function(t,a){var u=a.value,i=a.oldValue;t=P(t);var f=ee(u)||G(i)!==G(u);f&&X(t,u,e),W(t,f)},unbind:function(t){t=P(t),R.remove(t)}}}te();function ae(){var r=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},e=ne(r&&r.placeholders);return function(n,t){if(!I(n)&&!Number.isFinite(n))return n;var a=re(t,e),u=Z("".concat(n),a,{guide:!1}),i=u.conformedValue;return i}}ae();var Me=function(r){var e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};r.directive("mask",te(e)),r.filter("VMask",ae(e))};export{Me as p};