class DND {
    constructor(){
        this.dragicon=document.createElement("div")
        this.dragicon.style.position="absolute"
        this.dragicon.style.border="1px solid pink"
        this.dragicon.style.background="white"
        this.dragicon.style.width="80px"
        this.dragicon.style.height="40px"
        this.dragicon.style.top="0px"
        this.dragicon.style.left="0px"
        this.dragicon.style.background="pink"
        this.dragicon.zIndex=6000
        this.initX=this.prevX=this.initY=this.prevY=-1
        document.body.appendChild(this.dragicon)
        this.dragicon.appendChild(this.createIcon())
        this.targets=[]
    }
    createIcon(){
        var div=document.createElement("div")
        div.className="w3-margin-bottom grid-item"
        var img=document.createElement("img")
        img.src="resources/globalholder.jpg" 
        img.style.width="100%"
        div.appendChild(img)
        var h=document.createElement("h4")
        h.innerHTML="Primatives"
        div.appendChild(h)
        img.addEventListener("touchstart",this.mouseStart.bind(this),false)
        img.addEventListener("touchmove",this.mouseMove.bind(this),false)
        return div
  
    }
    setTargets(targets){

    }
    inTargets(x,y){
        let elements = document.elementsFromPoint(x, y);
        const matchingElements = elements.filter(item => this.targets.includes(item));
        if(matchingElements.length>0)return true 
        return false
    }
    
    dropAction(){}
    mouseStart(e){
        if(e.type.startsWith("touch")){    
            this.initX = this.prevX = e.touches[0].screenX 
            this.initY = this.prevY = e.touches[0].screenY
        }
        else{
            this.initX = this.prevX = e.screenX 
            this.initY = this.prevY = e.screenY
        }
        var rec=e.target.getBoundingClientRect()
        this.initX=  this.initX-parseInt(rec.left)
        this.initY=  this.initY-parseInt(rec.top)
    }
          
    mouseMove(e){
        var x = e.screenX-this.initX ,	//Get X,y where the canvas's position is origin.
        y = e.screenY-this.initY
        if(e.type.startsWith("touch")){
          x = e.touches[0].screenX -this.initX
          y = e.touches[0].screenY -this.initY
        }

        e.target.parentNode.parentNode.style.left=x+"px"
        e.target.parentNode.parentNode.style.top=y+"px"
    }
    mouseEnd(){}

}

class Gallery {
    constructor(name){
        this.div=document.createElement("div")
        this.div.className="w3-white w3-wide w3-padding w3-card "
        var top=document.getElementById("topbar")
        this.div.setAttribute("style","left:0px;top:85px;background:pink;display:block;position:absolute;width:40vw;height:90vh")
       this.div.style.top=(top.clientHeight+5+"px")
        this.name=name
        this.holder=document.createElement("div")
        this.holder.className="quad"
        this.holder.style.display="grid"
        this.holder.style.width="100%"
        this.holder.style.height="100%"
        this.div.appendChild(this.holder)
        document.body.appendChild(this.div)
    }

    
    addIcons(list){
        var icn=null
        for(var i=0;i<list.length;i++){
            var im=list[i].icon
            if(im==null)im="globeholder.jpg"
            icn= this.addIcon('resources/'+im,list[i].model)
            this.holder.appendChild(icn)
            icn.addEventListener("touchstart", this.mouseDown.bind(this),false)
            icn.addEventListener("touchend", this.mouseUp.bind(this),false)

        }
        return this
    }
    
    mouseDown(){
        this.startTime = Date.now();
        this.timeoutId = setTimeout(this.timer,500)
    }
    mouseUp(){
       var elapsedTime = Date.now() - this.startTime;
       let seconds = (elapsedTime / 1000);
       clearTimeout(this.timeoutId);
    };

    timer(){
        clearTimeout(this.timeoutId);
    }

    addIcon(image,title){
        var icon =document.createElement("div")
        icon.className="w3-margin-bottom grid-item"
        var img=document.createElement("img")
        img.src="resources/primatives.jpg"
        img.setAttribute("alt","primatives")
        img.style.width="100%"
        var h4=document.createElement("h4")
        icon.appendChild(img)
        icon.appendChild(h4)
        h4.innerHTML=title
        icon.style.border="1px solid black"
        icon.style.maxHeight="20%"

        return icon
    }

    show(){
        this.div.style.display="block"
        return this
    }
    hide(){
        this.div.style.display="none"
        return this

    }
}
