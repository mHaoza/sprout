const __vite__fileDeps=["assets/index-BJVN3kWr.js","assets/index.vue_vue_type_script_setup_true_lang-DcnABeQw.js","assets/index-Bzur8fbZ.css","assets/index-BInTD5aQ.css","assets/index-B6OD_QfU.js","assets/index-DoRtokXD.js","assets/index-BNOcuqZW.css"],__vite__mapDeps=i=>i.map(i=>__vite__fileDeps[i]);
(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))u(t);new MutationObserver(t=>{for(const e of t)if(e.type==="childList")for(const r of e.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&u(r)}).observe(document,{childList:!0,subtree:!0});function n(t){const e={};return t.integrity&&(e.integrity=t.integrity),t.referrerPolicy&&(e.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?e.credentials="include":t.crossOrigin==="anonymous"?e.credentials="omit":e.credentials="same-origin",e}function u(t){if(t.ep)return;t.ep=!0;const e=n(t);fetch(t.href,e)}})();const h="/assets/role-Clara_portrait-CxHchJ5F.png",V=[{type:"Clara",name:"猩红兔子",color:"#8C0212",backgroundColor:"#F3E8DB",image:h}],y={class:"flex justify-center items-end pb-3 h-24 bg-[var(--theme-background-color)]"},g=Vue.defineComponent({__name:"index",setup(c){const{y:o}=VueUse.useWindowScroll(),n=[{path:"/",name:"首页"},{path:"/anime",name:"追番"},{path:"/demo",name:"案例"},{path:"/about",name:"关于"}];return(u,t)=>{const e=Vue.resolveComponent("RouterLink");return Vue.openBlock(),Vue.createElementBlock("header",{class:Vue.normalizeClass(["fixed top-0 left-0 right-0 z-50 w-screen transition-[top]",{scrolled:Vue.unref(o)>200}])},[Vue.createElementVNode("nav",y,[Vue.createVNode(e,{to:"/",class:"absolute top-4 text-2xl"},{default:Vue.withCtx(()=>[Vue.createTextVNode("mHaoza")]),_:1}),(Vue.openBlock(),Vue.createElementBlock(Vue.Fragment,null,Vue.renderList(n,r=>Vue.createVNode(e,{key:r.path,to:r.path,class:"px-2 py-1 mx-3 hover:text-[var(--theme-color)]"},{default:Vue.withCtx(()=>[Vue.createTextVNode(Vue.toDisplayString(r.name),1)]),_:2},1032,["to"])),64))])],2)}}}),E=(c,o)=>{const n=c.__vccOpts||c;for(const[u,t]of o)n[u]=t;return n},v=E(g,[["__scopeId","data-v-faca6f48"]]),b={class:"mx-auto md:max-w-screen-lg px-4 py-12 tracking-wide"},x=Vue.defineComponent({__name:"App",setup(c){return Vue.onMounted(()=>{const o=V[0];document.documentElement.style.setProperty("--theme-color",o.color),document.documentElement.style.setProperty("--theme-background-color",o.backgroundColor),document.documentElement.style.setProperty("--background-image",`url('${o.image}')`),document.getElementsByTagName("body")[0].className=o.type}),(o,n)=>(Vue.openBlock(),Vue.createElementBlock(Vue.Fragment,null,[Vue.createVNode(Vue.unref(v)),Vue.createElementVNode("main",b,[Vue.createVNode(Vue.unref(VueRouter.RouterView),{class:"mt-24"})])],64))}}),L="modulepreload",P=function(c){return"/"+c},m={},i=function(o,n,u){let t=Promise.resolve();if(n&&n.length>0){document.getElementsByTagName("link");const e=document.querySelector("meta[property=csp-nonce]"),r=(e==null?void 0:e.nonce)||(e==null?void 0:e.getAttribute("nonce"));t=Promise.all(n.map(s=>{if(s=P(s),s in m)return;m[s]=!0;const l=s.endsWith(".css"),p=l?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${s}"]${p}`))return;const a=document.createElement("link");if(a.rel=l?"stylesheet":L,l||(a.as="script",a.crossOrigin=""),a.href=s,r&&a.setAttribute("nonce",r),document.head.appendChild(a),l)return new Promise((_,f)=>{a.addEventListener("load",_),a.addEventListener("error",()=>f(new Error(`Unable to preload CSS for ${s}`)))})}))}return t.then(()=>o()).catch(e=>{const r=new Event("vite:preloadError",{cancelable:!0});if(r.payload=e,window.dispatchEvent(r),!r.defaultPrevented)throw e})},C=VueRouter.createRouter({history:VueRouter.createWebHistory("/"),routes:[{path:"/",name:"home",component:()=>i(()=>import("./index-BJVN3kWr.js"),__vite__mapDeps([0,1,2,3]))},{path:"/post/:postName",name:"post",component:()=>i(()=>import("./index-B6OD_QfU.js"),__vite__mapDeps([4,1,2]))},{path:"/anime",name:"anime",component:()=>i(()=>import("./index-DoRtokXD.js"),__vite__mapDeps([5,6]))},{path:"/demo",name:"demo",component:()=>i(()=>import("./index-IZssqsct.js"),[])},{path:"/about",name:"about",component:()=>i(()=>import("./index-DcS7OhNC.js"),[])}]}),d=Vue.createApp(x);d.use(C);d.mount("#app");export{E as _};