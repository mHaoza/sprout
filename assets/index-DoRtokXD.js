import{_ as d}from"./index-ZsyVa9i2.js";const _={class:"anime"},p={class:"grid grid-cols-5 gap-8 max-w-[900px] mx-auto"},h=["href"],V=["src"],f={class:"anime-name absolute bottom-0 p-1 w-full bg-gray-800/50 text-white overflow-hidden max-h-8 transition-[max-height]"},g=Vue.defineComponent({__name:"index",setup(b){const s=Vue.ref([]),r=VueUse.createFetch({baseUrl:"https://api.bgm.tv"}),n=Vue.reactive({subject_type:2,collection_type:3,limit:20,offset:0});let c=Number.POSITIVE_INFINITY;const l=Vue.computed(()=>{const o="877981",t=new URLSearchParams(Object.entries(n).map(e=>[e[0],e[1].toString()]));return`v0/users/${o}/collections?${t}`}),{isFetching:i,execute:u,onFetchResponse:m}=r(l);m(async o=>{const t=await o.json();s.value.push(...t.data),c=t.total}),window.addEventListener("scroll",a),Vue.onUnmounted(()=>window.removeEventListener("scroll",a));function a(){const{scrollTop:o,scrollHeight:t,clientHeight:e}=document.documentElement;!i.value&&c>n.limit*(n.offset+1)&&o+e>t-100&&(n.offset+=1,u())}return(o,t)=>(Vue.openBlock(),Vue.createElementBlock("div",_,[Vue.createElementVNode("ul",p,[(Vue.openBlock(!0),Vue.createElementBlock(Vue.Fragment,null,Vue.renderList(s.value,e=>(Vue.openBlock(),Vue.createElementBlock("li",{key:e.subject_id,class:"anime-item relative overflow-hidden shadow-xl rounded transition-transform cursor-pointer"},[Vue.createElementVNode("a",{href:`https://bangumi.tv/subject/${e.subject.id}`,target:"_blank"},[Vue.createElementVNode("img",{src:e.subject.images.medium,alt:"",class:"anime-img w-full h-full transition-transform"},null,8,V),Vue.createElementVNode("div",f,Vue.toDisplayString(e.subject.name_cn),1)],8,h)]))),128))])]))}}),w=d(g,[["__scopeId","data-v-0c62bad5"]]);export{w as default};
