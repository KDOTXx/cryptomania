/*!
 * vue-countdown v1.1.5
 * https://fengyuanchen.github.io/vue-countdown
 *
 * Copyright 2018-present Chen Fengyuan
 * Released under the MIT license
 *
 * Date: 2020-02-25T01:19:32.769Z
 */var o=1e3,a=60*o,l=60*a,h=24*l,d="visibilitychange",m={name:"countdown",data:function(){return{counting:!1,endTime:0,totalMilliseconds:0}},props:{autoStart:{type:Boolean,default:!0},emitEvents:{type:Boolean,default:!0},interval:{type:Number,default:1e3,validator:function(i){return i>=0}},now:{type:Function,default:function(){return Date.now()}},tag:{type:String,default:"span"},time:{type:Number,default:0,validator:function(i){return i>=0}},transform:{type:Function,default:function(i){return i}}},computed:{days:function(){return Math.floor(this.totalMilliseconds/h)},hours:function(){return Math.floor(this.totalMilliseconds%h/l)},minutes:function(){return Math.floor(this.totalMilliseconds%l/a)},seconds:function(){return Math.floor(this.totalMilliseconds%a/o)},milliseconds:function(){return Math.floor(this.totalMilliseconds%o)},totalDays:function(){return this.days},totalHours:function(){return Math.floor(this.totalMilliseconds/l)},totalMinutes:function(){return Math.floor(this.totalMilliseconds/a)},totalSeconds:function(){return Math.floor(this.totalMilliseconds/o)}},render:function(i){return i(this.tag,this.$scopedSlots.default?[this.$scopedSlots.default(this.transform({days:this.days,hours:this.hours,minutes:this.minutes,seconds:this.seconds,milliseconds:this.milliseconds,totalDays:this.totalDays,totalHours:this.totalHours,totalMinutes:this.totalMinutes,totalSeconds:this.totalSeconds,totalMilliseconds:this.totalMilliseconds}))]:this.$slots.default)},watch:{$props:{deep:!0,immediate:!0,handler:function(){this.totalMilliseconds=this.time,this.endTime=this.now()+this.time,this.autoStart&&this.start()}}},methods:{start:function(){this.counting||(this.counting=!0,this.emitEvents&&this.$emit("start"),document.visibilityState==="visible"&&this.continue())},continue:function(){var i=this;if(!!this.counting){var e=Math.min(this.totalMilliseconds,this.interval);if(e>0)if(window.requestAnimationFrame){var r,n,c=function f(s){r||(r=s),n||(n=s);var u=s-r;u>=e||u+(s-n)/2>=e?i.progress():i.requestId=requestAnimationFrame(f),n=s};this.requestId=requestAnimationFrame(c)}else this.timeoutId=setTimeout(function(){i.progress()},e);else this.end()}},pause:function(){window.requestAnimationFrame?cancelAnimationFrame(this.requestId):clearTimeout(this.timeoutId)},progress:function(){!this.counting||(this.totalMilliseconds-=this.interval,this.emitEvents&&this.totalMilliseconds>0&&this.$emit("progress",{days:this.days,hours:this.hours,minutes:this.minutes,seconds:this.seconds,milliseconds:this.milliseconds,totalDays:this.totalDays,totalHours:this.totalHours,totalMinutes:this.totalMinutes,totalSeconds:this.totalSeconds,totalMilliseconds:this.totalMilliseconds}),this.continue())},abort:function(){!this.counting||(this.pause(),this.counting=!1,this.emitEvents&&this.$emit("abort"))},end:function(){!this.counting||(this.pause(),this.totalMilliseconds=0,this.counting=!1,this.emitEvents&&this.$emit("end"))},update:function(){this.counting&&(this.totalMilliseconds=Math.max(0,this.endTime-this.now()))},handleVisibilityChange:function(){switch(document.visibilityState){case"visible":this.update(),this.continue();break;case"hidden":this.pause();break}}},mounted:function(){document.addEventListener(d,this.handleVisibilityChange)},beforeDestroy:function(){document.removeEventListener(d,this.handleVisibilityChange),this.pause()}};export{m as i};