import{W as n,B as m,n as l}from"./app.84788141.js";import{m as c}from"./vuex.db5583be.js";import"./vue-recaptcha.ac7b26c4.js";import"./vue.2fdc5d8e.js";import"./after.f5f6eafa.js";import"./@glidejs.c34926ed.js";import"./overlayscrollbars.16146508.js";import"./qrcode.124b3fa5.js";import"./encode-utf8.c8acd0c0.js";import"./dijkstrajs.f17cb91e.js";import"./gsap.10236bb8.js";import"./bitcoin-units.c392cbba.js";import"./big.js.5a739493.js";import"./jquery.a5d8725e.js";import"./lodash.a4543754.js";import"./axios.372962c2.js";import"./laravel-echo.1870cf92.js";import"./socket.io-client.4c8cf9d1.js";import"./parseuri.1963fa84.js";import"./socket.io-parser.6220f9fe.js";import"./component-emitter.72d4fec7.js";import"./isarray.396bc49a.js";import"./engine.io-client.915a8ff3.js";import"./has-cors.150b278c.js";import"./engine.io-parser.2ae49814.js";import"./has-binary2.8a78c161.js";import"./arraybuffer.slice.9c094f68.js";import"./base64-arraybuffer.8e0339d2.js";import"./blob.387277be.js";import"./parseqs.ede9f166.js";import"./component-inherit.7edfe7ae.js";import"./yeast.d32d0463.js";import"./indexof.a4b72e6b.js";import"./to-array.b41ea466.js";import"./component-bind.d6d60fa3.js";import"./backo2.46430cfe.js";import"./vue-router.21875538.js";import"./vue-i18n.85d99549.js";import"./vuex-persistedstate.4cde3667.js";import"./vue-izitoast.758affc3.js";import"./vue-feather.e39d5e52.js";import"./feather-icons.5fdfdf40.js";import"./v-mask.d150318c.js";import"./v-click-outside.91688d80.js";import"./vue-infinite-scroll.16ae2245.js";import"./@chenfengyuan.9943b948.js";import"./v-tooltip.0d9af9d3.js";import"./@babel.aa9208ce.js";import"./popper.js.d3cea3a7.js";import"./vue-resize.e71c9b02.js";import"./vue-context.518fc610.js";import"./vue-clickaway.dacb5831.js";import"./vue-content-placeholders.fb834830.js";import"./overlayscrollbars-vue.6a31e3e1.js";import"./country-flag-emoji-polyfill.38b8e49f.js";import"./is-emoji-supported.c13a6994.js";import"./apexcharts.1d8667f6.js";import"./howler.7d01981f.js";const p={components:{WebIcon:n},data(){return{game:null,markets:null,doesntExist:!1,updateInterval:null,loadingGame:!1,expanded:[],categoryToggledAtLeastOnce:[],embedded:!1,mobileEmbedded:!1}},computed:{...c(["phoenixShowUnavailableRunners","phoenixShowEsportStats"]),isVisible(){return!this.doesntExist&&this.game}},watch:{isVisible(){this.isVisible&&!this.embedded&&this.$nextTick(()=>{this.initializeWidget("widget",()=>this.embedded=!0)})},doesntExist(){this.doesntExist||(this.embedded=!1)},game(){let a={};this.game.markets.forEach(t=>{if(!t.isAvailable&&!this.phoenixShowUnavailableRunners)return;let e=[];t.runners.forEach(s=>{!s.supported.status&&!this.phoenixShowUnavailableRunners||e.push(s)}),a[t.name]?a[t.name].categories.push(e):a[t.name]={name:t.name,open:t.open,isAvailable:t.isAvailable,categories:[e]}}),this.markets=a}},beforeDestroy(){clearInterval(this.updateInterval)},methods:{initializeWidget(a,t){this.game.sportType==="SPORTS"?window.SIR&&(window.SIR("addWidget","#"+a,"match.lmtPlus",{matchId:this.game.id}),t()):this.game.sportType==="ESPORTS"&&(this.game.twitch?window.Twitch&&(new window.Twitch.Embed(a,{width:"100%",height:190,channel:this.game.twitch.substring(this.game.twitch.lastIndexOf("/")+1),layout:"video"}),t()):document.querySelector("#"+a).innerHTML='<div class="notStarted">'+this.$i18n.t("sport.widgetUnavailable")+"</div>")},sortMarkets(a){return Object.values(a).sort((t,e)=>e.open-t.open).sort((t,e)=>e.isAvailable-t.isAvailable)},isExpanded(a){return!this.categoryToggledAtLeastOnce.includes(a.name)&&a.categories.filter(t=>t.filter(e=>e.main).length>0).length>0||!this.expanded.includes(a.name)},categoryBackground(){switch(this.$route.params.category){case"soccer":case"football":return{background:"#2d7837"};case"tennis":return{background:"#9d5535"};case"table tennis":return{background:"#1b4d78"};case"basketball":return{background:"#7e5f3a"};case"hockey":return{background:"#38536c"};default:return{background:"#08090a"}}},update(){this.loadingGame||(this.loadingGame=!0,axios.post("/api/sport/game",{id:this.$route.params.id}).then(({data:a})=>{this.game=a,this.doesntExist=!1,this.loadingGame=!1}).catch(()=>{this.doesntExist=!0,this.loadingGame=!1}))}},created(){this.update(),this.updateInterval=setInterval(()=>this.update(),1500),m.$on("sport:initializeMobileWidget",()=>{this.mobileEmbedded||this.initializeWidget("mobileWidget",()=>this.mobileEmbedded=!0)})}};var d=function(){var t=this,e=t._self._c;return e("div",{staticClass:"sportGamePage container"},[t.doesntExist?e("div",{staticClass:"error"},[e("web-icon",{attrs:{icon:"time"}}),e("div",{staticClass:"title"},[t._v(t._s(t.$t("sport.game_not_found")))])],1):[t.game?[e("div",{staticClass:"sportGameHeader"},[e("i",{staticClass:"fal fa-chevron-left",on:{click:function(s){return t.$router.push("/"+t.sportLink+"/category/"+t.$route.params.category)}}}),t._v(" "+t._s(t.game.name)+" ")]),e("div",{staticClass:"sportGameInfo",style:t.categoryBackground()},[e("div",{staticClass:"competitors"},[e("div",{staticClass:"competitor"},[e("div",{staticClass:"name"},[t._v(t._s(t.game.competitors[0].name))]),t.game.competitors[0].logo?e("img",{attrs:{src:t.game.competitors[0].logo,alt:""}}):t._e()]),e("div",{staticClass:"competitor"},[e("div",{staticClass:"name"},[t._v(t._s(t.game.competitors[1].name))]),t.game.competitors[1].logo?e("img",{attrs:{src:t.game.competitors[1].logo,alt:""}}):t._e()])]),e("div",{staticClass:"sportLiveStatus"},[t.game.liveStatus.createdAt>0?e("div",{staticClass:"createdAt"},[t._v(" "+t._s(new Date(t.game.liveStatus.createdAt).toLocaleString())+" ")]):t._e(),e("div",{staticClass:"score"},[t._v(t._s(t.game.liveStatus.score.split(":")[0])+" "),e("div",{staticClass:"divide"}),t._v(" "+t._s(t.game.liveStatus.score.split(":")[1])+" ")]),e("div",{staticClass:"stage"},[t._v(t._s(t.game.liveStatus.stage))]),e("div",{staticClass:"setScore"},[t._v(t._s(t.game.league.name))])]),t.game.markets.length>0?e("div",{staticClass:"live-markets"},t._l(t.game.markets[0].runners.slice(0,2),function(s){return e("bet-slip-button",{key:t.game.markets[0].name+s.name,class:"runner "+(s.open&&t.game.open&&t.game.markets[0].open?"":"disabled"),attrs:{category:t.$route.params.category,market:t.game.markets[0],runner:s,game:t.game}},[e("div",[t._v(t._s(t.game.open&&s.open&&t.game.markets[0].open?t.$t(s.translation.runner.key):"--"))]),e("div",{staticClass:"price"},[t._v(t._s(t.game.open&&s.open&&t.game.markets[0].open?s.price:"--"))])])}),1):t._e()]),t.game.open?t._e():e("div",{staticClass:"sportClosedBetting"},[e("i",{staticClass:"fal fa-pause-circle"}),t._v(" "+t._s(t.$t("sport.game_is_closed"))+" ")]),e("div",{staticClass:"sportGameMainData"},[e("div",{staticClass:"market-columns"},[e("div",{staticClass:"markets"},[t.phoenixShowEsportStats&&t.game.eSport?e("div",{staticClass:"phoenixEsportStats"},[e("pre",[t._v(t._s(t.game.eSport))])]):t._e(),Object.values(t.sortMarkets(t.markets)).length===0?e("div",{staticClass:"empty"},[e("web-icon",{attrs:{icon:"time"}}),e("div",[t._v(t._s(t.$t("sport.noMarkets")))])],1):t._e(),t._l(t.sortMarkets(t.markets),function(s){return[s.categories[0]&&s.categories[0][0]?e("div",{key:s.name,staticClass:"market"},[e("div",{staticClass:"title",on:{click:function(o){t.isExpanded(s)?t.expanded.push(s.name):t.expanded=t.expanded.filter(i=>i!==s.name),t.categoryToggledAtLeastOnce.push(s.name)}}},[t._v(" "+t._s(t.$t(s.categories[0][0].translation.market.key,s.categories[0][0].translation.market.data))+" "),e("i",{class:t.isExpanded(s)?"fas fa-chevron-down":"fas fa-chevron-left"}),!s.isAvailable&&t.phoenixShowUnavailableRunners?e("div",[t._v(" \xA0 [Unsupported] ")]):t._e()]),t.isExpanded(s)?t._l(s.categories,function(o){return e("div",{staticClass:"category"},t._l(o,function(i,r){return t.game.open&&i.open&&s.open||r<3?e("bet-slip-button",{key:s.name+i.name,class:"runner "+(t.game.open&&s.open&&i.open?"":"disabled")+" "+(o.length<3?"runner-2":"runner-3"),attrs:{category:t.$route.params.category,game:t.game,market:s,runner:i}},[e("div",[t._v(t._s(t.game.open&&i.open&&s.open?t.$t(i.translation.runner.key):"--"))]),e("div",{staticClass:"price"},[t._v(t._s(t.game.open&&i.open&&s.open?i.price:"--"))])]):t._e()}),1)}):t._e()],2):t._e()]})],2)]),e("div",{staticClass:"gameInfoDesktop"},[e("div",{staticClass:"competitors"},[e("div",{staticClass:"competitor"},[e("div",{staticClass:"name"},[t._v(t._s(t.game.competitors[0].name))]),t.game.competitors[0].logo?e("img",{attrs:{src:t.game.competitors[0].logo,alt:""}}):t._e()]),e("div",{staticClass:"competitor"},[e("div",{staticClass:"name"},[t._v(t._s(t.game.competitors[1].name))]),t.game.competitors[1].logo?e("img",{attrs:{src:t.game.competitors[1].logo,alt:""}}):t._e()])]),e("div",{staticClass:"sportLiveStatus"},[t.game.liveStatus.createdAt>0?e("div",{staticClass:"createdAt"},[e("web-icon",{attrs:{icon:"time"}}),t._v(" "+t._s(new Date(t.game.liveStatus.createdAt).toLocaleString())+" ")],1):t._e(),e("div",{staticClass:"score"},[t._v(t._s(t.game.liveStatus.score.split(":")[0])+" "),e("div",{staticClass:"divide"}),t._v(" "+t._s(t.game.liveStatus.score.split(":")[1])+" ")]),e("div",{staticClass:"stage"},[t._v(t._s(t.game.liveStatus.stage))]),e("div",{staticClass:"setScore"},[t._v(t._s(t.game.league.name))]),e("div",{attrs:{id:"widget"}})])])])]:e("loader")]],2)},g=[],v=l(p,d,g,!1,null,null,null,null);const bt=v.exports;export{bt as default};