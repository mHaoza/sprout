import{a as V,_ as p}from"./index.vue_vue_type_script_setup_true_lang-DcnABeQw.js";import{_ as h}from"./index-ZsyVa9i2.js";/**
 * @license lucide-vue-next v0.378.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const f=a=>a.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase();/**
 * @license lucide-vue-next v0.378.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var i={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round"};/**
 * @license lucide-vue-next v0.378.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const k=({size:a,strokeWidth:n=2,absoluteStrokeWidth:r,color:t,iconNode:l,name:c,class:o,...s},{slots:e})=>Vue.h("svg",{...i,width:a||i.width,height:a||i.height,stroke:t||i.stroke,"stroke-width":r?Number(n)*24/Number(a):n,class:["lucide",`lucide-${f(c??"icon")}`],...s},[...l.map(u=>Vue.h(...u)),...e.default?[e.default()]:[]]);/**
 * @license lucide-vue-next v0.378.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const d=(a,n)=>(r,{slots:t})=>Vue.h(k,{...r,iconNode:n,name:a},t);/**
 * @license lucide-vue-next v0.378.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _=d("BookmarkIcon",[["path",{d:"m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z",key:"1fy3hk"}]]);/**
 * @license lucide-vue-next v0.378.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const g=d("CalendarIcon",[["path",{d:"M8 2v4",key:"1cmpym"}],["path",{d:"M16 2v4",key:"4m81vk"}],["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",key:"1hopcy"}],["path",{d:"M3 10h18",key:"8toen8"}]]);/**
 * @license lucide-vue-next v0.378.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const v=d("TagIcon",[["path",{d:"M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z",key:"vktsd0"}],["circle",{cx:"7.5",cy:"7.5",r:".5",fill:"currentColor",key:"kqv944"}]]),y={class:"max-w-5xl mx-auto relative"},x=["onClick"],w={class:"text-xl mb-2 italic"},B={class:"mt-2 flex justify-start"},N=Vue.defineComponent({__name:"index",setup(a){const n=VueRouter.useRoute(),r=Vue.computed(()=>V.filter(o=>o.filePath.startsWith(`/posts${n.path}`))),t=Vue.reactive({height:0,top:0});function l(o){if(!o)return;const{clientHeight:s,offsetTop:e}=o,m=e+0;t.height===s&&t.top===m||(t.height=s,t.top=m)}const c=Vue.ref();return Vue.onMounted(()=>{Vue.watch(()=>n.path,()=>Vue.nextTick(()=>{var o;return l((o=c.value)==null?void 0:o[0])}),{immediate:!0})}),(o,s)=>(Vue.openBlock(),Vue.createElementBlock("ul",y,[Vue.createElementVNode("div",{class:"mask pointer-events-none absolute left-0 top-0 right-0 transform rounded transition-all duration-300 ease-in-out",style:Vue.normalizeStyle({height:`${t.height}px`,transform:`translateY(${t.top}px)`})},null,4),(Vue.openBlock(!0),Vue.createElementBlock(Vue.Fragment,null,Vue.renderList([...r.value,...r.value,...r.value],e=>(Vue.openBlock(),Vue.createElementBlock("li",{key:e.filePath,ref_for:!0,ref_key:"itemRef",ref:c,class:"[&:nth-child(n+2)]:mt-2 cursor-pointer p-4",onClick:u=>o.$router.push(`post/${e.fileName.replace(".md","")}`),onMouseenter:s[0]||(s[0]=u=>l(u.target))},[Vue.createElementVNode("div",w,Vue.toDisplayString(e.data.title),1),Vue.createVNode(Vue.unref(p),{class:"max-w-full","md-text":e.data.description??""},null,8,["md-text"]),Vue.createElementVNode("div",B,[Vue.createVNode(Vue.unref(g),{class:"w-5 mr-1"}),Vue.createElementVNode("span",null,Vue.toDisplayString(Vue.unref(dayjs)(e.data.date).format("YYYY-MM-DD")),1),Vue.createVNode(Vue.unref(_),{class:"ml-4 mr-1 w-5"}),Vue.createElementVNode("span",null,Vue.toDisplayString(e.data.category),1),Vue.createVNode(Vue.unref(v),{class:"ml-4 mr-1 w-5"}),(Vue.openBlock(!0),Vue.createElementBlock(Vue.Fragment,null,Vue.renderList(e.data.tags,u=>(Vue.openBlock(),Vue.createElementBlock("span",{key:u,class:"mr-2"},Vue.toDisplayString(u),1))),128))])],40,x))),128))]))}}),$=h(N,[["__scopeId","data-v-fd0ded87"]]),E={class:"home"},b=Vue.defineComponent({__name:"index",setup(a){return(n,r)=>(Vue.openBlock(),Vue.createElementBlock("div",E,[Vue.createVNode(Vue.unref($))]))}});export{b as default};
