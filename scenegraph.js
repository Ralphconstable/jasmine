class SceneGraph extends _3DObject 
	{
	constructor(){
		super('test')
		this.extent='global'
		this.tree=document.getElementById("myUL")
		this.showgrid=true
		this.background=[0.5,0.5,0.5]
		this.display=[
			{"name":"showgrid","editor":"boolean","caption":"Show Grid","value":null},
			{"name":"background","editor":"color","caption":"Background","value":null},
		]
		this.addObjectToList()
		this.tree.addEventListener('click',this.outlineSelectedNodes.bind(this),false)
		var vp =[gCamera.transform.position.x,gCamera.transform.position.y,gCamera.transform.position.z]
		this.sections.push({"name":"Default","objectName":"","material":"","index":[],"uniforms":[]})
		this.sections[0].uniforms.push({"caption":"Light Color","name":"ambientLightColor","type":"FLOAT_VEC3","value":[1.0,1.0,1.0],"editor":"color","textureid":-1,"unit":-1,"pic":"","section":0,"exrent":"global"});
		this.sections[0].uniforms.push({"caption":"Ambient Str","name":"ambientStrength","type":"FLOAT","value":0.0,"editor":"range","textureid":-1,"unit":-1,"pic":"","section":0,"extent":"global"});
		//this.sections[0].uniforms.push({"caption":"View Pos","name":"viewPos","type":"FLOAT_VEC3","value":[0,0,3.],"editor":"edit","textureid":-1,"unit":-1,"pic":"","section":0});
	}

	toggle(){
		event.target.parentElement.querySelector(".nested").classList.toggle("active");
   		event.target.classList.toggle("caret-down");
	}

	updateName(){
		document.getElementById('sceneadd').innerHTML=document.getElementById('scenetitle').value
	}

	loadScene(){
		
	}
	
	addObject(parent,model){
		model.parent=null

		if(parent!=null)
			model.parent=parent
		var li=document.createElement("li")
			this.tree.appendChild(li)
			li.setAttribute('data-index',model.id)
			li.innerHTML=model.name
			model.li=li
           // li.addEventListener("click",this.outlineSelectedNodes.bind(this))
	}

	setParent(parent,child) {
		if(child==undefined||child==null)return
		// remove us from our parent
		  if (child.parent) {
			var ndx = child.parent.children.indexOf(child);
			if (ndx >= 0) {
			  child.parent.children.splice(ndx, 1);
			}
		  }
	  
		// Add us to our new parent
		  if (parent) {
			parent.children.push(child);

		  }
		  
		child.parent = parent;  
		//configure dom tree
		this.addToParent(parent,child)

	  };
	  
	findNodeByName(name){
		var node = null;
		var node = this.tree;
		// Traverse through the DOM from the start node to the end node
		while (node) {
			if (node.innerHTML == name) break;
			node = this.nextNode(node);
		}

		return node;
	}

	removeNode(name){
		var node = this.findNodeByName(name)
		node.parentNode.remove(node)
		}

	addToParent(parent,child){
		var parentnode	=this.findNodeByName(parent.name)
		var childnode	=this.findNodeByName(child.name)
		if(!parentnode)return
		if(parentnode.innerHTML.indexOf("span")>-1){
		}else{

			var span=document.createElement("span")

			parentnode.appendChild(span)
			parentnode.innerHTML=""
			span.innerHTML=parent.name
			parentnode.appendChild(span)
			span.className="caret"
			var ul =document.createElement("ul")
			ul.className="nested"
			span.addEventListener("click",this.toggle.bind(this))
			parentnode.appendChild(ul)

			ul.appendChild(childnode)

		}

	}

	  outlineSelectedNodes() {
		// Remove previous highlights
		var highlightedNodes = document.querySelectorAll('.highlighted');
		highlightedNodes.forEach(function(node) {
			node.classList.remove('highlighted');
		});	
// Get the user's selection
		var selection = window.getSelection();
		
		if (selection.rangeCount > 0) {
			// Get the selected range
			var range = selection.getRangeAt(0);
			// Traverse and outline nodes within the range
			var startNode = range.startContainer;
			var endNode = range.endContainer;
			// Get all nodes in range
			var nodes = this.getNodesInRange(startNode, endNode);
			// Add the 'highlighted' class to each node
			nodes.forEach(function(node) {
				if (node.nodeType === Node.ELEMENT_NODE) {
					node.classList.add('highlighted');
				} else if (node.nodeType === Node.TEXT_NODE && node.parentElement) {
					node.parentElement.classList.add('highlighted');
				}
			});
		}
	}

	  // Helper function to get all nodes between start and end nodes in the selection
	getNodesInRange(startNode, endNode) {
		var nodes = [];
		var node = startNode;
		// Traverse through the DOM from the start node to the end node
		while (node) {
			nodes.push(node);
			if (node === endNode) break;

			node = nextNode(node);
		}

	var obj=	this.getCSSAbsolutePosition(node.parentNode)
	    _SelectStart=node.parentNode.getAttribute("data-index")
		return nodes;
	}

	// Helper function to find the next node in the DOM tree
	nextNode(node) {
		if (node.firstChild) return node.firstChild;
		while (node) {
			if (node.nextSibling) return node.nextSibling;
			node = node.parentNode;
		}
		return null;
	}
	getCSSAbsolutePosition(el) {

		var pos= ('absolute relative').indexOf(getComputedStyle(el).position) == -1;
		var rect1= {top: el.offsetTop * pos, left: el.offsetLeft * pos};
		var rect2= el.offsetParent ? this.getCSSAbsolutePosition(el.offsetParent) : {top:0,left:0};
			return {top: rect1.top + rect2.top,
				left: rect1.left + rect2.left,
				width: el.offsetWidth,
				height: el.offsetHeight
			   };
	  }

	show(){
		document.getElementById('scenebox').style.display='block'
		return this
	}
	hide(){  
		document.getElementById('scenebox').style.display='none'
		return this

	}
}