"use strict";(self.webpackChunkcomponents_demo=self.webpackChunkcomponents_demo||[]).push([[724],{9724:(e,l,s)=>{s.r(l),s.d(l,{default:()=>M});var t=s(5043),i=s(855),n=s(3513);const o=(e,l,s)=>{if(!e||!l||void 0===s)return;const t=JSON.parse(JSON.stringify(e)),i=l.split(".");let n=t;for(let o=0;o<i.length-1;o++){const e=isNaN(Number(i[o]))?i[o]:Number(i[o]);if(!n[e])throw new Error(`Property not found: ${i[o]}`);n=n[e]}return n[isNaN(Number(i[i.length-1]))?i[i.length-1]:Number(i[i.length-1])]=s,t};function r(e,l,s){try{const t=JSON.parse(JSON.stringify(e));return s.forEach((e=>{const s=t[l][e];"string"===typeof s&&(t[l][e]="null"===s?"null":"realYamlData"===e?s:(e=>{try{return JSON.parse(e),!0}catch(l){return!1}})(s)?JSON.parse(s):s)})),t}catch(t){return console.error("Failed to process fields:",t),e[l]||{}}}const a=e=>{try{const l=JSON.parse(JSON.stringify(e)),s=[],t=function(e){let l=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"";Array.isArray(e)?e.forEach(((e,i)=>{const n=`${l}.${i}`;"object"===typeof e&&null!==e?t(e,n):s.push(n)})):null!==e&&"object"===typeof e&&Object.keys(e).forEach((i=>{const n=e[i],o=l?`${l}.${i}`:i;"object"===typeof n&&null!==n?t(n,o):s.push(o)}))};return t(l),s}catch(l){console.error(l)}},d=e=>Array.isArray(e)?0===e.length?"[]":e.map(d):null!==e&&"object"===typeof e?Object.fromEntries(Object.entries(e).map((e=>{let[l,s]=e;return[l,d(s)]}))):e,c=e=>e.map((e=>`$${e.replace(/^[^\.]+/,"").replace(/\.(\d+)/g,"[$1]")}`));var u=s(3343),v=s(9748),h=s(9577),p=s(1121),x=s(8354),y=s(7419),f=s(1645),j=s(3117),m=s(1118),A=s(5206),g=s(4524),S=s(1966),C=s(5337),E=s(579);const{TextArea:w}=u.A,T={IS_NOT_EMPTY:"\u4e0d\u4e3a\u7a7a",IS_EMPTY:"\u4e3a\u7a7a",EQUALS:"==",NOT_EQUALS:"!=",IN:"IN",NOT_IN:"NOT_IN",GREATER_THAN:">",GREATER_THAN_OR_EQUAL_TO:">=",LESS_THAN:"<",LESS_THAN_OR_EQUAL_TO:"<="},b=e=>{const{keyPath:l,value:s,specialAssertConfigs:i=[],onConfirm:n}=e,[o]=v.A.useForm(),[r,a]=(0,t.useState)(!1),[d,c]=(0,t.useState)(),[b,k]=(0,t.useState)(null);(0,t.useEffect)((()=>{if(r){var e;const t=null===i||void 0===i?void 0:i.find((e=>(null===e||void 0===e?void 0:e.keyPath)===l));o.setFieldsValue({keyPath:l,value:s,expressList:null===t||void 0===t||!t.expressList||(null===t||void 0===t||null===(e=t.expressList)||void 0===e?void 0:e.length)<1?[{}]:null===t||void 0===t?void 0:t.expressList}),N()}}),[r]);const N=()=>{const e=o.getFieldsValue();c(e);(e.expressList||[]).forEach(((e,l)=>{null!==e&&void 0!==e&&e.expectValue||o.setFields([{name:["expressList",l,"parseFunction"],errors:[]}]),null!==e&&void 0!==e&&e.parseFunction||o.setFields([{name:["expressList",l,"expectValue"],errors:[]}])}))};return(0,E.jsxs)("div",{style:{display:"inline-block"},onClick:e=>{e.stopPropagation()},children:[(0,E.jsx)(h.A,{title:"\u914d\u7f6e\u7279\u6b8a\u6821\u9a8c",children:(0,E.jsx)("a",{style:{cursor:"pointer"},onClick:e=>a(!0),children:(0,E.jsx)(g.A,{})})}),(0,E.jsx)(p.A,{title:"\u914d\u7f6e\u7279\u6b8a\u6821\u9a8c",width:650,style:{},open:r,onCancel:()=>a(!1),onOk:()=>{o.submit()},children:(0,E.jsxs)(v.A,{form:o,onFinish:e=>{const{expressList:l,...s}=e,t={...s,expressList:null===l||void 0===l?void 0:l.filter((e=>["IS_NOT_EMPTY","IS_EMPTY"].includes(null===e||void 0===e?void 0:e.operator)?null===e||void 0===e?void 0:e.parseFunction:(null===e||void 0===e?void 0:e.parseFunction)&&(null===e||void 0===e?void 0:e.expectValue)))};n(t),a(!1)},children:[(0,E.jsx)(v.A.Item,{label:"\u5b57\u6bb5\u8def\u5f84",name:"keyPath",children:(0,E.jsx)(u.A,{disabled:!0})}),(0,E.jsx)(v.A.Item,{label:"\u6570\u636e\u8be6\u60c5",name:"value",children:(0,E.jsx)(w,{placeholder:"\u8f93\u5165",disabled:!0})}),(0,E.jsx)(x.A,{}),(0,E.jsx)(v.A.List,{name:"expressList",children:(e,l)=>{let{add:s,remove:t}=l;return(0,E.jsxs)(E.Fragment,{children:[e.map((e=>{var l,s,i,n,o,r,a,c,h,p,A,g,C,_,O,L;let{key:P,name:I,...M}=e;return(0,E.jsxs)(y.A,{gutter:[8,6],children:[(0,E.jsx)(f.A,{span:24,children:(0,E.jsx)(v.A.Item,{...M,label:"\u89e3\u6790\u51fd\u6570",name:[I,"parseFunction"],rules:[{required:!!["IS_NOT_EMPTY","IS_EMPTY"].includes(null===d||void 0===d||null===(l=d.expressList)||void 0===l||null===(s=l[I])||void 0===s?void 0:s.operator)||(null===d||void 0===d||null===(i=d.expressList)||void 0===i||null===(n=i[I])||void 0===n?void 0:n.expectValue),message:"\u8bf7\u8f93\u5165"}],required:!1,children:(0,E.jsx)(w,{rows:3,placeholder:"\u8f93\u5165",onChange:()=>{b&&clearTimeout(b);const e=setTimeout((()=>{N()}),300);k(e)}})})}),(0,E.jsx)(f.A,{span:8,children:(0,E.jsx)(v.A.Item,{...M,label:"\u6821\u9a8c\u89c4\u5219",name:[I,"operator"],initialValue:"EQUALS",children:(0,E.jsx)(j.A,{onSelect:()=>{N()},showSearch:!0,dropdownStyle:{filter:"invert(0.85) hue-rotate(170deg)",boxShadow:"none"},placeholder:"\u8bf7\u9009\u62e9",options:Object.entries(T).map((e=>({value:e[0],label:e[1]})))})})}),(0,E.jsx)(f.A,{span:15,children:(0,E.jsx)(v.A.Item,{...M,name:[I,"expectValue"],rules:[{required:!["IS_NOT_EMPTY","IS_EMPTY"].includes(null===d||void 0===d||null===(o=d.expressList)||void 0===o||null===(r=o[I])||void 0===r?void 0:r.operator)&&(null===d||void 0===d||null===(a=d.expressList)||void 0===a||null===(c=a[I])||void 0===c?void 0:c.parseFunction),message:"\u8bf7\u8f93\u5165"}],children:["GREATER_THAN","GREATER_THAN_OR_EQUAL_TO","LESS_THAN","LESS_THAN_OR_EQUAL_TO"].includes(null===d||void 0===d||null===(h=d.expressList)||void 0===h||null===(p=h[I])||void 0===p?void 0:p.operator)?(0,E.jsx)(m.A,{style:{width:"100%"},placeholder:"\u8f93\u5165\uff08\u6570\u5b57\uff09",disabled:["IS_NOT_EMPTY","IS_EMPTY"].includes(null===d||void 0===d||null===(A=d.expressList)||void 0===A||null===(g=A[I])||void 0===g?void 0:g.operator),onChange:()=>{b&&clearTimeout(b);const e=setTimeout((()=>{N()}),300);k(e)}}):(0,E.jsx)(u.A,{placeholder:["NOT_IN","IN"].includes(null===d||void 0===d||null===(C=d.expressList)||void 0===C||null===(_=C[I])||void 0===_?void 0:_.operator)?"\u591a\u4e2a\u503c\u8bf7\u7528\u82f1\u6587\u9017\u53f7\u5206\u9694":"\u8f93\u5165",disabled:["IS_NOT_EMPTY","IS_EMPTY"].includes(null===d||void 0===d||null===(O=d.expressList)||void 0===O||null===(L=O[I])||void 0===L?void 0:L.operator),onChange:()=>{b&&clearTimeout(b);const e=setTimeout((()=>{N()}),300);k(e)}})})}),(0,E.jsx)(f.A,{span:1,children:(0,E.jsx)(S.A,{style:{color:"red",marginTop:8,fontSize:16,cursor:"pointer"},onClick:()=>{t(I),N()}})}),(0,E.jsx)(x.A,{style:{marginTop:-10}})]},P)})),(0,E.jsx)(v.A.Item,{children:(0,E.jsx)(A.Ay,{style:{width:"100%"},type:"dashed",onClick:()=>{s()},block:!0,icon:(0,E.jsx)(C.A,{}),children:"\u6dfb\u52a0\u89c4\u5219"})})]})}})]})})]})};var k=s(3390),N=s(3727),_=s(7407);const O=e=>{const{value:l,onEdit:s}=e,[i,n]=(0,t.useState)(l),[o,r]=(0,t.useState)(i),[a,d]=(0,t.useState)(!1),c=(0,t.useRef)(null),[v,p]=(0,t.useState)(0),[x,y]=(0,t.useState)(0),f=()=>{const e=c.current.offsetWidth,l=e/document.documentElement.clientWidth*100;p(e),y(l)};return(0,t.useEffect)((()=>{c.current&&f()}),[c.current]),(0,E.jsx)("div",{style:{display:"inline-block"},children:(0,E.jsxs)("div",{style:{display:"flex"},children:[(0,E.jsx)("div",{children:a?(0,E.jsx)(u.A.TextArea,{rows:v>300?4:1,style:{width:v>300?"26vw":v+40,resize:"both"},value:o,onChange:e=>{r(e.target.value)}}):(0,E.jsx)("span",{style:{display:"-webkit-box",WebkitBoxOrient:"vertical",WebkitLineClamp:4,overflow:"hidden",textOverflow:"ellipsis",maxWidth:"24vw",lineHeight:"1.5",maxHeight:"6em"},ref:c,children:x>20?(0,E.jsx)(h.A,{placement:"topLeft",title:i,overlayStyle:{maxWidth:"30vw"},children:i}):i})}),(0,E.jsxs)("div",{style:{marginLeft:12,color:"#5478FC"},children:[a&&(0,E.jsxs)("div",{style:{display:"flex"},children:[(0,E.jsx)("div",{children:(0,E.jsx)(k.A,{onClick:()=>{n(o),s(o),d(!1)}})}),(0,E.jsx)("div",{style:{marginLeft:5},children:(0,E.jsx)(N.A,{onClick:()=>{d(!1)}})})]}),!a&&(0,E.jsx)(E.Fragment,{children:(0,E.jsx)(_.A,{onClick:()=>{f(),d(!0)}})})]})]})})},L=["yamlData","properties","sofaContext","eventPayload","headers","realYamlData"],P=e=>{const{data:l,rootNode:s,showAssertChecked:u=!1,showEditValue:v=!1,isAllAssert:h=!1,isAllCheckbox:p=!1,onChange:x,interfaceObj:y,showNode:f,noShowAssert:j,showConfigSpecialVerif:m=!1,selectKey:A,selectKeyRootNode:g}=e,[S,C]=(0,t.useState)(r(l,s,L)),[w,T]=(0,t.useState)(),[k,N]=(0,t.useState)([]),[_,P]=(0,t.useState)([]);(0,t.useEffect)((()=>{x(S)}),[S]);const[I,M]=(0,t.useState)(!0);(0,t.useEffect)((()=>{if(l){var e,t,i,n,o,c;const v=r(l,s,L);var u;if(I)N(((e,l,s)=>e?e.map((e=>{let t=e.replace(/^\$/,"");return t=t.replace(/\[(\d+)\]/g,".$1"),t.startsWith(".")&&(t=t.slice(1)),`${null!==l&&void 0!==l?l:s}.${t}`})):[])(null===(u=v[s])||void 0===u?void 0:u[A||"assertKeys"],g,s));v.rootNode=v;const h=null===v||void 0===v||null===(e=v[s])||void 0===e?void 0:e.yamlData,p=null===v||void 0===v||null===(t=v[s])||void 0===t?void 0:t.properties,x=null===v||void 0===v||null===(i=v[s])||void 0===i?void 0:i.sofaContext,j=null===v||void 0===v||null===(n=v[s])||void 0===n?void 0:n.eventPayload,m=null===v||void 0===v||null===(o=v[s])||void 0===o?void 0:o.headers,S=null===v||void 0===v||null===(c=v[s])||void 0===c?void 0:c.realYamlData,C={yamlData:h,properties:p,sofaContext:x,eventPayload:j},E={yamlData:h,sofaContext:x},w={yamlData:h,headers:m},b={[f]:C[f]},k={[f]:E[f]},_={[f]:w[f]},O=()=>{const e={[s]:h||{}};let l=e;return"realYamlData"===f&&(l={[s]:S||{}}),"MSG"===y&&(l=b),"RPC"===y&&(l=f?k:e),"HTTP"===y&&(l=f?_:e),l};T(d(O())),I&&P(a(d(O()))),M(!1)}}),[l]);const Y=(e,l,s)=>{const t=l.split(".")||[];"MSG"===y&&"assertKeys"!==t[1]&&("realYamlData"===f?t.splice(1,0,"realYamlData"):t.unshift("request")),"MSG"!==y&&"assertKeys"!==t[1]&&(f?"realYamlData"===f?t.splice(1,0,"realYamlData"):t.unshift("request"):t.splice(1,0,"yamlData"));const i=null===t||void 0===t?void 0:t.join("."),n=o(e,i,s);C(n)},$=e=>{if(e){const e=a(w);N(e)}else N([])},[D,F]=(0,t.useState)(!0);(0,t.useEffect)((()=>{[D,p,w,0===(null===k||void 0===k?void 0:k.length)].every((e=>e))&&($(!0),F(!1))}),[s,w]),(0,t.useEffect)((()=>{var e;u&&((e=k).length>0?Y(S,`${s}.assertKeys`,c(e)):Y(S,`${s}.assertKeys`,[]))}),[k]);const V=function(e){let l=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"root",t=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0;const n=function(e,n){var r,a,d;let p=arguments.length>2&&void 0!==arguments[2]&&arguments[2];const x=0===t?`${n}`:`${l}.${n}`,y=p?(0,E.jsxs)("div",{style:{display:"flex"},children:[(0,E.jsxs)("span",{children:[n,"\uff1a"]}),(0,E.jsx)("span",{children:v?(0,E.jsx)(O,{value:String(e),onEdit:e=>((e,l)=>{Y(S,e,l)})(x,e)}):String(e)}),(0,E.jsx)("span",{style:{display:m?"":"none"},children:(0,E.jsx)(b,{keyPath:null===(r=c([x]))||void 0===r?void 0:r[0],value:String(e),specialAssertConfigs:null!==(a=null===S||void 0===S||null===(d=S[s])||void 0===d?void 0:d.specialAssertConfigs)&&void 0!==a?a:[],onConfirm:e=>{(e=>{var l,t;const i=null!==(l=null===S||void 0===S||null===(t=S[s])||void 0===t?void 0:t.specialAssertConfigs)&&void 0!==l?l:[],n=new Map;[...i,e].forEach((e=>{n.set(e.keyPath,e)}));const r=Array.from(n.values()),a=o(S,`${s}.specialAssertConfigs`,r);C(a)})(e)}})}),(0,E.jsx)("span",{style:{marginLeft:5,display:u?"":"none"},children:(0,E.jsx)(i.A,{checked:null===k||void 0===k?void 0:k.includes(x),onChange:e=>{((e,l)=>{let s=[...k];e?s.push(l):s=s.filter((e=>e!==l)),N(s)})(e.target.checked,x)},children:(0,E.jsx)("span",{style:{color:"red"},children:j?"":"Assert"})})})]}):(0,E.jsxs)("div",{children:[(0,E.jsx)("span",{children:n}),(0,E.jsx)("span",{style:{marginLeft:15,display:["request","response","eventPayload","sofaContext","headers"].includes(x)&&h&&u?"":"none"},children:(0,E.jsx)(i.A,{style:{visibility:h?"visibility":"hidden"},checked:(null===_||void 0===_?void 0:_.length)===(null===k||void 0===k?void 0:k.length),indeterminate:0<(null===k||void 0===k?void 0:k.length)&&(null===k||void 0===k?void 0:k.length)<(null===_||void 0===_?void 0:_.length),onChange:e=>$(e.target.checked),children:(0,E.jsx)("span",{children:"\u5168\u9009"})})})]});return{key:x,title:y,children:p?null:V(e,x,t+1)}};return Array.isArray(e)&&(null===e||void 0===e?void 0:e.length)>0?e.map(((e,l)=>{const s=l;return"object"===typeof e?n(e,s):n(e,s,!0)})):null!==e&&"object"===typeof e?Object.keys(e).map((l=>{const s=e[l];return n(s,l,!(null!==s&&"object"===typeof s))})):[{key:l,title:`${l}: ${e}`}]};return(0,E.jsx)("div",{style:{width:"100%",overflowX:"auto"},children:w&&(0,E.jsx)(n.A,{defaultExpandedKeys:_,treeData:V(w),onSelect:(e,l)=>{}})})},I={request:{eventPayload:{yamlData:{id:"2190170000031691",paymentFactor:{productCode:"MC400401000000000028",internalUser:!0,skipPayFailedSendMsgProcess:!1,fundFlowMetadata:{}},paymentMethodTypes:["P24","P25",{bizType:"TRADE",productCode:"MC400401000000000028",internalUser:!0}]}}}},M=()=>{var e,l,s,n;const[o,r]=(0,t.useState)(["showAssertChecked","showEditValue","showConfigSpecialVerif"]),[a,d]=(0,t.useState)(null===I||void 0===I?void 0:I.request);return(0,E.jsx)("div",{style:{padding:15},children:(0,E.jsxs)("div",{style:{display:"flex",fontSize:12,gap:24},children:[(0,E.jsxs)("div",{style:{width:500},children:[(0,E.jsx)("h3",{children:"\u6570\u636e\u6e90"}),(0,E.jsx)("pre",{style:{whiteSpace:"pre-wrap",wordBreak:"break-word",backgroundColor:"#f5f5f5"},children:(0,E.jsx)("code",{children:JSON.stringify(null===a||void 0===a||null===(e=a.eventPayload)||void 0===e?void 0:e.yamlData,null,2)})}),(0,E.jsx)("h3",{children:"\u9009\u62e9\u8282\u70b9"}),(0,E.jsx)("pre",{style:{whiteSpace:"pre-wrap",wordBreak:"break-word",backgroundColor:"#f5f5f5"},children:(0,E.jsx)("code",{children:JSON.stringify(null!==(l=null===a||void 0===a||null===(s=a.eventPayload)||void 0===s?void 0:s.assertKeys)&&void 0!==l?l:"{}",null,2)})}),(0,E.jsx)("h3",{children:"\u6821\u9a8c\u89c4\u5219"}),(0,E.jsx)("pre",{style:{whiteSpace:"pre-wrap",wordBreak:"break-word",backgroundColor:"#f5f5f5"},children:(0,E.jsx)("code",{children:JSON.stringify(null===a||void 0===a||null===(n=a.eventPayload)||void 0===n?void 0:n.specialAssertConfigs,null,2)})})]}),(0,E.jsxs)("div",{children:[(0,E.jsx)("div",{style:{marginBottom:20},children:(0,E.jsx)(i.A.Group,{options:[{label:"Assert",value:"showAssertChecked"},{label:"\u7f16\u8f91",value:"showEditValue"},{label:"\u914d\u7f6e",value:"showConfigSpecialVerif"}],value:o,onChange:e=>{r(e)}})}),(0,E.jsx)(P,{data:null===I||void 0===I?void 0:I.request,rootNode:"eventPayload",showAssertChecked:o.includes("showAssertChecked"),showEditValue:o.includes("showEditValue"),showConfigSpecialVerif:o.includes("showConfigSpecialVerif"),isAllAssert:!0,isAllCheckbox:!0,onChange:e=>{console.log("\ud83d\ude80 ~ DomainCase ~ vals:",e),d(e)}})]})]})})}}}]);
//# sourceMappingURL=724.e58d10ec.chunk.js.map