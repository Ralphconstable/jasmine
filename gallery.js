function models(){
    /*window.scrollTo({
        top: document.getElementById("home").offsetTop, // Scroll to the top of the element
        behavior: 'smooth' // Optional: Add smooth scrolling animation
      });*/
    _Galleries[0].show()

}
function addObject(){
    var target=event.target
    var index=parseInt(target.id.split(":")[1])
    var object=eval(_ModelsGallery[index].object)
    object.setPosition(lastPosition.x,lastPosition.y,lastPosition.z)
    lastPosition.x+=200/gl.canvas.width
    lastPosition.y+=200/gl.canvas.width
    lastPosition.z+=200/gl.canvas.width
    _SceneGraph.addObject(null,object)
    _Galleries[0].hide()
}

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


class Gallery2{
    constructor(id){
        this.main=this.createEl("div","w3-modal")
        this.main.style.maxHeight="100vh"
        this.main.id=id
        this.div= this.createEl("div","w3-modal-content w3-card-4 w3-animate-zoom")
        this.main.appendChild(this.div)
        var header=this.createEl("header","w3-container w3-blue")
        this.div.appendChild(header)
        var span=this.createEl("span","w3-button w3-blue w3-medium w3-display-topright" )
        span.innerHTML="&times"
        this.div.appendChild(span)
        span.setAttribute("onclick","document.getElementById('"+id+"').style.display='none'" )
        var h4=this.createEl("h4")
        h4.innerHTML="Header"
        header.appendChild(h4)

        this.createTab(['London','Paris','Tokyo'],['london','paris','france'])

    //   this.div.appendChild(this.createClose())
        document.body.appendChild(this.main)
        document.getElementById("londonp").style.display = "block";


    }
    createEl(el,cl){
        var elm =document.createElement(el)
        if(cl!=null)
        elm.className=cl
        return elm
    }

    createTab(buttonArray,buttonid){
      this.tabbar=this.createEl('div', "w3-bar w3-border-bottom")
      this.div.appendChild(this.tabbar)

      for(var i=0;i<buttonArray.length;i++){
        var button=this.createEl('button',  "tablink w3-bar-item w3-button")
            button.setAttribute('onclick',"openCity(event,+"+buttonArray[i] +")")
            button.innerHTML=buttonArray[i]
            button.id=buttonid[i]
            button.addEventListener('click',this.openCity.bind(this),true)
            this.tabbar.appendChild(button)
            this.div.appendChild(this.createPanel(buttonArray[i],buttonid[i]))
      }

    }

    createPanel(buttonArray,buttonid,gallry){
        var panelDiv=this.createEl('div', "w3-container city")
        panelDiv.style.width="100%"
        panelDiv.id=buttonid+"p"
        var h2=this.createEl('h2',null)
        panelDiv.appendChild(h2)
        h2.innerHTML=buttonArray
        var div=this.createEl("div","responsive")
        div.style.float="left"
        div.style.width="100%"
        for(var i=0;i<_ModelsGallery.length;i++){
            
            this.createImage(div,_ModelsGallery[i].icon,_ModelsGallery[i].model,i)
        }
        panelDiv.appendChild(div)
        panelDiv.style.display="none"
        return panelDiv
    }


    createImage(div,gll,desc,i){
        var div1=this.createEl("div","gallery")
        div1.style.margin="3px"
        div1.style.width="16.6%";
        div1.style.height="16.6%";
        div1.style.float="left";
        div1.style.overflow="hidden";
      
        div.appendChild(div1)
        if(gll==null)gll='globeholder.jpg'
        var a =this.createEl("a",null)
        div1.appendChild(a)
        a.setAttribute("target","_blank")
        var img=document.createElement("img")
        img.setAttribute("src","resources/"+gll)
        a.appendChild(img)
        img.id='image:'+i
        var description=this.createEl('div',"desc")
        description.innerHTML =desc
        div1.appendChild(description)
        div1.addEventListener("click",addObject,false)
        return this
    }

    createClose(){
        var div=this.createEl('div', "w3-container w3-light-grey w3-padding")
        var button =this.createEl("button","w3-button w3-right w3-white w3-border" )
        button.setAttribute('onclick',  "document.getElementById('"+this.main.id+"').style.display='none'")
        button.innerHTML="Close"
        div.appendChild(button)
        return div
    }

    openCity() {
        var i;
        var x = document.getElementsByClassName("city");
        for (i = 0; i < x.length; i++) {
          x[i].style.display = "none";
        }
        var c=event.target.id
        document.getElementById(c+"p").style.display = "block";
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

    show(){
        window.scrollTo({
            top: document.getElementById("home").offsetTop, // Scroll to the top of the element
            behavior: 'smooth' // Optional: Add smooth scrolling animation
          });
    
        document.getElementById(this.main.id).style.display='block'
    }
    hide(){
        document.getElementById(this.main.id).style.display='none'
    }

}


