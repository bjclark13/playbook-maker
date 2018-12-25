(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{14:function(t,e,n){t.exports=n(33)},19:function(t,e,n){},21:function(t,e,n){},33:function(t,e,n){"use strict";n.r(e);var a=n(0),r=n.n(a),o=n(13),i=n.n(o),s=(n(19),n(2)),c=n(3),u=n(5),d=n(4),l=n(6),h=(n(21),n(7)),g=(n(10),n(1)),f=function(t){function e(){return Object(s.a)(this,e),Object(u.a)(this,Object(d.a)(e).apply(this,arguments))}return Object(l.a)(e,t),Object(c.a)(e,[{key:"render",value:function(){return r.a.createElement(g.Rect,Object.assign({width:20,height:20,cornerRadius:2,stroke:"black",fill:"white",shadowColor:"black"},this.props))}}]),e}(r.a.Component),p=function(t){function e(){return Object(s.a)(this,e),Object(u.a)(this,Object(d.a)(e).apply(this,arguments))}return Object(l.a)(e,t),Object(c.a)(e,[{key:"render",value:function(){return r.a.createElement(g.Circle,Object.assign({radius:9,fill:"white",stroke:"black",shadowColor:"black"},this.props))}}]),e}(r.a.Component),x=function(t){function e(){return Object(s.a)(this,e),Object(u.a)(this,Object(d.a)(e).apply(this,arguments))}return Object(l.a)(e,t),Object(c.a)(e,[{key:"render",value:function(){return r.a.createElement(b,Object.assign({},this.props,{text:"X"}))}}]),e}(r.a.Component),b=function(t){function e(){return Object(s.a)(this,e),Object(u.a)(this,Object(d.a)(e).apply(this,arguments))}return Object(l.a)(e,t),Object(c.a)(e,[{key:"render",value:function(){return r.a.createElement(g.Text,Object.assign({fontSize:25},this.props))}}]),e}(r.a.Component),m=function(t){function e(t){var n;return Object(s.a)(this,e),(n=Object(u.a)(this,Object(d.a)(e).call(this,t))).state={textes:[{text:"QB"},{text:"HB"},{text:"FB"},{text:"C"},{text:"Y"},{text:"Z"}],exes:[{}],ohs:[{}],squares:[{}]},n}return Object(l.a)(e,t),Object(c.a)(e,[{key:"render",value:function(){var t=this,e=0;return r.a.createElement(g.Layer,null,r.a.createElement(g.Text,{y:5,x:50,text:"Editor: Click an icon to add to the play"}),this.state.ohs.map(function(n,a){return e++,r.a.createElement(p,{x:60*e,y:35,onClick:function(){return t.props.addToBoard("ohs")}})},this),this.state.exes.map(function(n,a){return e++,r.a.createElement(x,{key:a,x:60*e,y:25,onClick:function(){return t.props.addToBoard("ohs")}})}),this.state.squares.map(function(n,a){return e++,r.a.createElement(f,{key:a,x:60*e,y:25,onClick:function(){return t.props.addToBoard("squares")}})}),this.state.textes.map(function(n,a){return e++,r.a.createElement(b,{text:n.text,x:60*e,y:25,onClick:function(){return t.props.addToBoard("textes",{text:n.text})}})}))}}]),e}(r.a.Component),w=function(t){function e(t){var n;return Object(s.a)(this,e),(n=Object(u.a)(this,Object(d.a)(e).call(this,t))).handleDragStart=function(t){n.state.drawMode||t.target.setAttrs({})},n.roundToNearest=function(t,e){return t%e>=e/2?parseInt(t/e)*e+e:parseInt(t/e)*e},n.saveProgress=function(){var t=n.state;delete t.drawMode,delete t.editing,window.sessionStorage.setItem("playbook-active",JSON.stringify(n.state))},n.getLocalChanges=function(){var t;(t=window.sessionStorage.getItem("playbook-active"))&&n.setState(JSON.parse(t))},n.publishChanges=function(){window.sessionStorage.removeItem("playbook-active")},n.handleDragEnd=function(t,e,a){if(!n.state.drawMode){t.target.to({duration:.5,scaleX:1,scaleY:1});var r=n.state[a];r[e].x=t.currentTarget._lastPos.x,r[e].y=t.currentTarget._lastPos.y,n.setState(Object(h.a)({},a,r),n.saveProgress)}},n.handleMouseMove=function(t){if(n.state.drawMode&&n.state.editing){var e=n.state.editing,a=n.stageRef.getStage().getPointerPosition();e.push(a.x,a.y),n.setState({editing:e})}},n.handleMouseUp=function(t){if(n.state.drawMode&&n.state.editing){n.stageRef.getStage();var e,a=n.state[n.state.drawMode];a.push({points:n.state.editing}),n.setState((e={},Object(h.a)(e,n.state.drawMode,a),Object(h.a)(e,"editing",!1),e))}},n.addToBoard=function(t,e){var a=n.state[t];e=Object.assign({x:window.innerWidth/2-150+300*Math.random(),y:window.innerHeight/2},e);a.push(e),n.setState(Object(h.a)({},t,a))},n.state={textes:[],exes:[],ohs:[],lines:[],arrows:[],squares:[],drawMode:!1},n}return Object(l.a)(e,t),Object(c.a)(e,[{key:"componentDidMount",value:function(){this.getLocalChanges()}},{key:"render",value:function(){var t=this;return r.a.createElement(g.Stage,{width:window.innerWidth,height:window.innerHeight,onMouseMove:this.handleMouseMove,onMouseUp:this.handleMouseUp,ref:function(e){t.stageRef=e}},r.a.createElement(m,{addToBoard:this.addToBoard}),r.a.createElement(g.Layer,null,this.state.drawMode?r.a.createElement(g.Text,{y:150,x:50,text:"Mode: Drawing: Click on an icon in the play to draw a route"}):r.a.createElement(g.Text,{y:150,x:50,text:"Mode: Dragging: Click on an icon to move them around"}),r.a.createElement(g.Text,{y:190,x:50,onClick:function(){return t.setState({drawMode:"lines"})},text:"Draw Lines"}),r.a.createElement(g.Text,{y:210,x:50,onClick:function(){return t.setState({drawMode:"arrows"})},text:"Draw Arrows"}),r.a.createElement(g.Text,{y:230,x:50,onClick:function(){return t.setState({drawMode:!1})},text:"Switch to Drawing Mode"}),this.state.ohs.map(function(e,n){return r.a.createElement(p,{x:e.x,y:e.y,draggable:!t.state.drawMode,key:n,onDragStart:t.handleDragStart,onDragEnd:function(e){return t.handleDragEnd(e,n,"ohs")},onClick:function(){return t.setState({editing:[e.x,e.y]})}})}),this.state.squares.map(function(e,n){return r.a.createElement(f,{x:e.x,y:e.y,draggable:!t.state.drawMode,key:n,onDragStart:t.handleDragStart,onDragEnd:function(e){return t.handleDragEnd(e,n,"squares")},onClick:function(){return t.setState({editing:[e.x,e.y]})}})}),this.state.lines.map(function(t,e){return r.a.createElement(g.Line,{points:t.points,stroke:"black",tension:1})}),this.state.arrows.map(function(t,e){return r.a.createElement(g.Arrow,{points:t.points,stroke:"black",fill:"black",tension:1})}),this.state.textes.map(function(e,n){return r.a.createElement(b,{draggable:!t.state.drawMode,key:n,onDragStart:t.handleDragStart,onDragEnd:function(e){return t.handleDragEnd(e,n,"textes")},text:e.text,x:e.x,y:e.y,onClick:function(){return t.setState({editing:[e.x,e.y]})}})}),this.state.exes.map(function(e,n){return r.a.createElement(x,{draggable:!t.state.drawMode,key:n,onDragStart:t.handleDragStart,onDragEnd:function(e){return t.handleDragEnd(e,n,"exes")},text:"X",x:e.x,y:e.y,onClick:function(){return t.setState({editing:[e.x,e.y]})}})})))}}]),e}(a.Component),y=function(t){function e(){return Object(s.a)(this,e),Object(u.a)(this,Object(d.a)(e).apply(this,arguments))}return Object(l.a)(e,t),Object(c.a)(e,[{key:"render",value:function(){return r.a.createElement("div",{className:"App"},r.a.createElement(w,null))}}]),e}(a.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));i.a.render(r.a.createElement(y,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(t){t.unregister()})}},[[14,2,1]]]);
//# sourceMappingURL=main.f33b7e59.chunk.js.map