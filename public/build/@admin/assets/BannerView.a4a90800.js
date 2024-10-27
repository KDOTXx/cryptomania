import{D as p}from"./DashboardSwitch.dc169bb3.js";import{f as m,A as e,g,C as _,I as d,a4 as r,D as a,v,Q as h,e as u,N as b,O as w}from"./@vue.ca773235.js";import{_ as T}from"./app.f6b791b5.js";import"./vue.9ea8e8a6.js";import"./vuex.497f08d2.js";import"./overlayscrollbars.8d928870.js";import"./apexcharts.8dc8f2aa.js";import"./string-similarity.860833b6.js";import"./gsap.8449ad8c.js";import"./vue-router.63e2ccab.js";import"./vuex-persistedstate.fa252374.js";import"./izitoast.765d8918.js";import"./click-outside-vue3.6791b41e.js";import"./floating-vue.8db45bbf.js";import"./@floating-ui.9bdab495.js";import"./axios.ea6880df.js";import"./@vuepic.b319e7e5.js";import"./date-fns.5b6f9246.js";const I={data(){return{banner:null,enabled:null,image:"",title:"",content:"",ogTitle:"",ogImage:""}},created(){window.axios.post("/admin/bannerSettings").then(({data:i})=>{this.banner=i,this.enabled=i.enabled,this.image=i.image,this.title=i.title,this.content=i.content,this.ogTitle=i.ogSettingsWebsiteTitle,this.ogImage=i.ogSettingsWebsiteImage,this.$bus.$emit("loading:done")})},methods:{toggle(){this.enabled=!this.enabled,this.edit("state",this.enabled?"true":"false")},edit(i,t){window.axios.post("/admin/bannerEdit",{editKey:i,editValue:t}).catch(()=>{this.$toast.error("Failed to save")})}},components:{DashboardSwitch:p}},l=i=>(b("data-v-f0c3cceb"),i=i(),w(),i),f={key:0,class:"banner animate"},x={class:"switch"},V={class:"type"},y={class:"bannerEditContent"},C=l(()=>e("div",{class:"smTitle"}," Edit ",-1)),S={class:"edit"},E={class:"bannerPreviewContent"},k=l(()=>e("div",{class:"smTitle"}," Preview ",-1)),D={class:"preview"},B=["src"],N={class:"pTitle"},U=["innerHTML"],P=l(()=>e("div",{class:"ogTitle"},"OpenGraph",-1)),M=l(()=>e("div",{class:"ogDesc"},"This will be seen in social networks when someone shares a link to the website.",-1)),W={class:"type"},H={class:"bannerEditContent"},L=l(()=>e("div",{class:"smTitle"}," Edit ",-1)),O={class:"edit"},A={class:"bannerPreviewContent"},F=l(()=>e("div",{class:"smTitle"}," Preview ",-1)),G={class:"preview"},K=["src"],Q={class:"pTitle"};function j(i,t,q,z,s,n){const c=h("dashboard-switch");return s.banner?(u(),m("div",f,[e("div",x,[g(c,{value:s.enabled,onChange:n.toggle},null,8,["value","onChange"]),_(" Enabled ")]),e("div",V,[e("div",y,[C,e("div",S,[d(e("input",{type:"text","onUpdate:modelValue":t[0]||(t[0]=o=>s.title=o),placeholder:"Title",onInput:t[1]||(t[1]=o=>n.edit("title",s.title))},null,544),[[r,s.title]]),d(e("input",{type:"text","onUpdate:modelValue":t[2]||(t[2]=o=>s.image=o),placeholder:"Image",onInput:t[3]||(t[3]=o=>n.edit("image",s.image))},null,544),[[r,s.image]]),d(e("textarea",{placeholder:"Content","onUpdate:modelValue":t[4]||(t[4]=o=>s.content=o),rows:"10",onInput:t[5]||(t[5]=o=>n.edit("content",s.content))},null,544),[[r,s.content]])])]),e("div",E,[k,e("div",D,[e("img",{src:s.image,alt:""},null,8,B),e("div",N,a(s.title),1),e("div",{class:"pContent",innerHTML:s.content},null,8,U)])])]),P,M,e("div",W,[e("div",H,[L,e("div",O,[d(e("input",{type:"text","onUpdate:modelValue":t[6]||(t[6]=o=>s.ogTitle=o),placeholder:"Website Title",onInput:t[7]||(t[7]=o=>n.edit("ogTitle",s.ogTitle))},null,544),[[r,s.ogTitle]]),d(e("input",{type:"text","onUpdate:modelValue":t[8]||(t[8]=o=>s.ogImage=o),placeholder:"Image (for social networks)",onInput:t[9]||(t[9]=o=>n.edit("ogImage",s.ogImage))},null,544),[[r,s.ogImage]])])]),e("div",A,[F,e("div",G,[e("img",{src:s.ogImage,alt:""},null,8,K),e("div",Q,a(s.ogTitle),1)])])])])):v("",!0)}const me=T(I,[["render",j],["__scopeId","data-v-f0c3cceb"]]);export{me as default};