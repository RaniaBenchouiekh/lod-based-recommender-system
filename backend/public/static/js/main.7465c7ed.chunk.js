(this["webpackJsonpreact-spa"]=this["webpackJsonpreact-spa"]||[]).push([[0],{325:function(e,t,n){e.exports=n(715)},330:function(e,t,n){},331:function(e,t,n){},361:function(e,t){},363:function(e,t){},400:function(e,t){},447:function(e,t){},448:function(e,t){},630:function(e,t){},631:function(e,t){},715:function(e,t,n){"use strict";n.r(t);var a=n(9),o=n.n(a),i=n(322),r=n.n(i),c=(n(330),n(6)),l=n(7),u=n(16),s=n(17),m=n(718),p=n(719),g=n(720),d=n(721),h=(n(331),n(30)),f=n.n(h),E=n(337).CrossStorageHub;var v=function(e){Object(s.a)(n,e);var t=Object(u.a)(n);function n(e){return Object(c.a)(this,n),t.call(this,e)}return Object(l.a)(n,[{key:"componentDidMount",value:function(){E.init([{origin:/chrome-extension:\/\/fkoeghlceoikfeedhmojdmahoenpjhpg/,allow:["get","set","del","getKeys","clear"]}])}},{key:"saveState",value:function(){f.a.trackSession((function(e){return e?(localStorage.setItem("loginValue",JSON.stringify(!0)),localStorage.setItem("session",JSON.stringify(e)),o.a.createElement("div",null)):o.a.createElement("div",null)}))}},{key:"render",value:function(){return o.a.createElement("div",{className:"Login-wrapper"},o.a.createElement("div",{className:"Login-formWrapper"},o.a.createElement("h1",{id:"Login-title"},"Connection"),o.a.createElement(m.a,null,o.a.createElement("p",{id:"Login-Label1"},"You are logged in as '",o.a.createElement(p.a,{src:"user.name"}),"'."),this.saveState(),o.a.createElement("p",{id:"Login-logoutButton"},o.a.createElement(g.a,{popup:"popup.html"}))),o.a.createElement(d.a,null,o.a.createElement("p",{id:"Login-Label2"},"Please log in to your pod."),o.a.createElement("p",{id:"Login-authButton"},o.a.createElement(g.a,{popup:"popup.html"})),o.a.createElement("p",{id:"Login-registerButton"},"You don't have an account ?",o.a.createElement("a",{href:"https://solid.github.io/solid-idps/",target:"__blank"},"Register here.")))))}}]),n}(a.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));r.a.render(o.a.createElement(o.a.StrictMode,null,o.a.createElement(v,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[325,1,2]]]);
//# sourceMappingURL=main.7465c7ed.chunk.js.map