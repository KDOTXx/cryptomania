import{B as o}from"./app.f6b791b5.js";import{L as n}from"./LoaderAnimation.f430cb8d.js";const i={methods:{open(){return new Promise(e=>{o.$emit("modal:new",{name:"loading",notDismissible:!0,component:{data(){return{done:!1}},components:{LoaderAnimation:n},created(){e(()=>this.done=!0)},template:`<div>
                <loader-animation :done="done"></loader-animation>
              </div>`}})})}}};export{i as _};
