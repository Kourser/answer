(()=>{var t={386:t=>{function e(t,e){if((t=t.replace(/\s+/g,""))===(e=e.replace(/\s+/g,"")))return 1;if(t.length<2||e.length<2)return 0;let r=new Map;for(let e=0;e<t.length-1;e++){const n=t.substring(e,e+2),s=r.has(n)?r.get(n)+1:1;r.set(n,s)}let n=0;for(let t=0;t<e.length-1;t++){const s=e.substring(t,t+2),o=r.has(s)?r.get(s):0;o>0&&(r.set(s,o-1),n++)}return 2*n/(t.length+e.length-2)}t.exports={compareTwoStrings:e,findBestMatch:function(t,r){if(!function(t,e){return"string"==typeof t&&!!Array.isArray(e)&&!!e.length&&!e.find((function(t){return"string"!=typeof t}))}(t,r))throw new Error("Bad arguments: First argument should be a string, second should be an array of strings");const n=[];let s=0;for(let o=0;o<r.length;o++){const a=r[o],i=e(t,a);n.push({target:a,rating:i}),i>n[s].rating&&(s=o)}return{ratings:n,bestMatch:n[s],bestMatchIndex:s}}}}},e={};function r(n){var s=e[n];if(void 0!==s)return s.exports;var o=e[n]={exports:{}};return t[n](o,o.exports,r),o.exports}r.n=t=>{var e=t&&t.__esModule?()=>t.default:()=>t;return r.d(e,{a:e}),e},r.d=(t,e)=>{for(var n in e)r.o(e,n)&&!r.o(t,n)&&Object.defineProperty(t,n,{enumerable:!0,get:e[n]})},r.o=(t,e)=>Object.prototype.hasOwnProperty.call(t,e),(()=>{"use strict";r(386)})()})();