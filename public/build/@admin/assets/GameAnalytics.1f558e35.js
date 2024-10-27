import{_ as v,W as f}from"./app.f6b791b5.js";import{f as a,g as y,F as l,i as _,v as x,e as o,A as t,D as n,N as g,O as w,Q as k}from"./@vue.ca773235.js";import"./vue.9ea8e8a6.js";import"./vuex.497f08d2.js";import"./overlayscrollbars.8d928870.js";import"./apexcharts.8dc8f2aa.js";import"./string-similarity.860833b6.js";import"./gsap.8449ad8c.js";import"./vue-router.63e2ccab.js";import"./vuex-persistedstate.fa252374.js";import"./izitoast.765d8918.js";import"./click-outside-vue3.6791b41e.js";import"./floating-vue.8db45bbf.js";import"./@floating-ui.9bdab495.js";import"./axios.ea6880df.js";import"./@vuepic.b319e7e5.js";import"./date-fns.5b6f9246.js";const b={data(){return{data:null,currencies:null}},methods:{find(d,r,u){const h=this.data.filter(s=>s.currency===u&&s.statId===d&&s.type===r)[0];return h||{payout:0,profit:0,wagered:0}},findCurrencies(d){return[...new Set(this.data.filter(r=>r.statId===d).map(r=>r.currency))]}},mounted(){window.axios.post("/admin/gameAnalytics").then(({data:d})=>{let r=d;window.axios.post("/api/data/currencies").then(({data:u})=>{this.data=r,this.currencies=u,this.$bus.$emit("loading:done")})})},components:{WebIcon:f}},m=d=>(g("data-v-9b96c1bd"),d=d(),w(),d),F={key:0,class:"gameAnalytics animate"},C={key:0,class:"noData"},S=m(()=>t("div",null,"No data yet. Play any game to make analytics appear.",-1)),A={class:"head"},N={class:"title"},P={class:"stats"},D={class:"stat"},W=m(()=>t("div",{class:"title"},"Wagered today",-1)),B={class:"text"},V={class:"stat"},G=m(()=>t("div",{class:"title"},"Payout today",-1)),E={class:"text"},L={class:"stat"},O=m(()=>t("div",{class:"title"},"Profit today",-1)),Q={class:"text"},j={class:"stat"},q=m(()=>t("div",{class:"title"},"Wagered total",-1)),z={class:"text"},H={class:"stat"},J=m(()=>t("div",{class:"title"},"Payout total",-1)),K={class:"text"},M={class:"stat"},R=m(()=>t("div",{class:"title"},"Profit total",-1)),T={class:"text"};function U(d,r,u,h,s,c){const p=k("web-icon");return s.data?(o(),a("div",F,[s.data.length===0?(o(),a("div",C,[y(p,{icon:"time"}),S])):(o(!0),a(l,{key:1},_([...new Set(s.data.map(i=>i.statId))],i=>(o(),a("div",{class:"banner",key:i},[t("div",A,[t("div",N,n(i),1)]),t("div",P,[t("div",D,[W,t("div",B,[(o(!0),a(l,null,_(c.findCurrencies(i),e=>(o(),a("div",{class:"currency",key:e},n(s.currencies[e].name)+" "+n(c.find(i,"daily",e).wagered.toFixed(s.currencies[e].decimals)),1))),128))])]),t("div",V,[G,t("div",E,[(o(!0),a(l,null,_(c.findCurrencies(i),e=>(o(),a("div",{class:"currency",key:e},n(s.currencies[e].name)+" "+n(c.find(i,"daily",e).payout.toFixed(s.currencies[e].decimals)),1))),128))])]),t("div",L,[O,t("div",Q,[(o(!0),a(l,null,_(c.findCurrencies(i),e=>(o(),a("div",{class:"currency",key:e},n(s.currencies[e].name)+" "+n(c.find(i,"daily",e).wagered.toFixed(s.currencies[e].decimals)-c.find(i,"daily",e).payout.toFixed(s.currencies[e].decimals)),1))),128))])]),t("div",j,[q,t("div",z,[(o(!0),a(l,null,_(c.findCurrencies(i),e=>(o(),a("div",{class:"currency",key:e},n(s.currencies[e].name)+" "+n(c.find(i,"total",e).wagered.toFixed(s.currencies[e].decimals)),1))),128))])]),t("div",H,[J,t("div",K,[(o(!0),a(l,null,_(c.findCurrencies(i),e=>(o(),a("div",{class:"currency",key:e},n(s.currencies[e].name)+" "+n(c.find(i,"total",e).payout.toFixed(s.currencies[e].decimals)),1))),128))])]),t("div",M,[R,t("div",T,[(o(!0),a(l,null,_(c.findCurrencies(i),e=>(o(),a("div",{class:"currency",key:e},n(s.currencies[e].name)+" "+n(c.find(i,"total",e).wagered.toFixed(s.currencies[e].decimals)-c.find(i,"total",e).payout.toFixed(s.currencies[e].decimals)),1))),128))])])])]))),128))])):x("",!0)}const me=v(b,[["render",U],["__scopeId","data-v-9b96c1bd"]]);export{me as default};