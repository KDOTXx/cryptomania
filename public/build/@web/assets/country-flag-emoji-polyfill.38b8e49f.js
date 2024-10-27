import{i as t}from"./is-emoji-supported.c13a6994.js";function i(o="Twemoji Country Flags",e="https://cdn.jsdelivr.net/npm/country-flag-emoji-polyfill@0.1/dist/TwemojiCountryFlags.woff2"){if(t("\u{1F60A}")&&!t("\u{1F1E8}\u{1F1ED}")){const n=document.createElement("style");return n.textContent=`@font-face {
      font-family: "${o}";
      unicode-range: U+1F1E6-1F1FF, U+1F3F4, U+E0062-E0063, U+E0065, U+E0067,
        U+E006C, U+E006E, U+E0073-E0074, U+E0077, U+E007F;
      src: url('${e}') format('woff2');
      font-display: swap;
    }`,document.head.appendChild(n),!0}return!1}export{i as t};
