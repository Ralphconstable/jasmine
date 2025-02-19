class ShaderBox {
    constructor(){
        var parent=document.getElementById("shaderbox")
        this.left =this.createEl("div", 'float:left;background:pink;width:25%;height:100%')
        this.left.id="leftpanel"

        this.right =this.createEl("div", 'background:blue;width:100%;height:100%')
        this.right.id="rightpanel"
       parent.appendChild(this.left)
        parent.appendChild(this.right)
    }
    createEl(el,cl){
        var elm =document.createElement(el)
        elm.setAttribute("style",cl)
        return elm
    }

    show(){
		document.getElementById('shaderbox').style.display='block'
		return this
	}
	hide(){  
		document.getElementById('shaderbox').style.display='none'
		return this

	}

}