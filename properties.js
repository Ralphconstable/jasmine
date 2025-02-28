class Utility {
    static colorToID(a){ return a[0] | (a[1] << 8) | (a[2] << 16); }
    
    static idToColor(v){ //With 3 bytes, the max value is 16777215;
		var a = new Float32Array(3);
    
		a[0] = (v & 0xff) / 255.0;
		a[1] = ((v & 0xff00) >> 8) / 255.0;
		a[2] = ((v & 0xff0000) >> 16) / 255.0;
		return a;
    }

    static hexToRGB(hex) {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      // return {r, g, b} 
      return [r/256, g/256, b/256 ];
    }

    static rgbToHex(r, g, b) {
        return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1);
    }
  
    static ndcToScreen(gl, ndcX, ndcY) {
        const canvas = gl.canvas;
        const width = canvas.width;
        const height = canvas.height;
        const screenX = (ndcX * 0.5 + 0.5) * width;
        const screenY = (ndcY * -0.5 + 0.5) * height; // Invert Y-axis
        return { x: screenX, y: screenY };
    }


    static screenToNDC(gl, screenX, screenY) {
        const canvas = gl.canvas;
        const width = canvas.width;
        const height = canvas.height;
        const ndcX = ((screenX / width) - 0.5) * 2;
        const ndcY = (((height - screenY) / height) - 0.5) * 2; // Invert Y-axis
        return { x: ndcX, y: ndcY };
    }
}

///////////////////////////////////////////////
class  PropBox2{
  constructor(obj){
    this.target=obj
    this.properiesArray=[]
    this.materialsArray=[]
    this.div=document.createElement("div")
    this.div.className="w3-card-4 w3-white propbox"

    this.header =document.createElement('textarea')
    this.header.style.padding='0px'

    this.header.className="w3-container w3-blue"

  this.header.addEventListener('change',this.changeName.bind(this),false)
    this.header.innerHTML=obj.name
    this.header.style.width="100%"
    this.header.style.height="4.5vh"
    this.div.appendChild(this.header)
    document.body.appendChild(this.div);
    this.div.style.display="block"
    this.addProperties(obj)

    this.addMaterial(obj)

  }

  changeName(){
    this.target.setName(this.header.value)
    this.target.li.innerHTML=this.target.name
  }

  addProperties(obj){
    this.entryArray = Object.entries(obj)
    this.div2=document.createElement("div")
    this.div.appendChild(this.div2)
    this.div2.className="w3-blue-grey"
    var h4= document.createElement("h4")
    h4.innerHTML="Properties"
    h4.style.margin="0"
    this.div2.appendChild(h4)
    if(obj==null)return
    var container=document.createElement("div")
    this.div2.appendChild(container)  

      for(var i=0;i<obj.display.length;i++){

        try{
          var editor= createEditor(obj,obj.display[i])
          container.appendChild(editor.part)
          editor.update()
        }catch(e){}
      }
    }
  

  addMaterial(obj){
    if (obj.sections[0].uniforms.length==0)return //no uniforms
    for(var i=0;i<obj.sections.length;i++){

      var panel = this.createAccordian(this.div,obj.sections[i].name)
      for(var k=0;k<obj.sections[i].uniforms.length;k++){
        this.addMaterialRow(panel,obj.sections[i].uniforms[k],obj,i)
      }
    }
  }

  addMaterialRow(panel,uniform,obj,i){ 
      var container=document.createElement("div")

      panel.appendChild(container)  ;    

        try{    

          var editor= createEditor(obj,uniform)
          container.appendChild(editor.part)
          editor.update()
        }catch(e){}

  }


createAccordian(parent,name){ 
    var button = document.createElement("div")
    button.innerHTML=name
    button.className="accordion"
     button.addEventListener("click", this.toggleAccordian.bind(this))
     parent.appendChild(button)
     var panel=document.createElement("div")
     panel.className="panel"
     panel.style.height='45px'
     parent.appendChild(panel)
     return panel
    }


   toggleAccordian(){
          this.classList.toggle("active");
          var panel = this.nextElementSibling;
          if (panel.style.display === "block") {
            panel.style.display = "none";
          } else {
            panel.style.display = "block";
          }
        }


    show(){
      this.div.style.display = "block";
       return this
    }

    hide(){
      this.div.style.display = "none";
      return this;
    }

}


/*
           var pic =obj.getUniform(prop,section).pic
          if(!pic)
          obj.getUniform(prop,section).pic='resources\UV_Grid_Lrg.jpg'
          document.getElementById('imgTex').src= pic

          var texid=BOTEX.loadTexture('texture',document.getElementById("imgTex"))
;          obj.getUniform(prop,section).textureid=texid.id  
;          if(obj.getUniform(prop,section).unit==-1 ){
              obj.getUniform(prop,section).unit=obj.textures
            } 
          _Gallery[0].target={"object":this.target,"name":prop,"content":content.children[0]}
          content.addEventListener("click",this.showGallery.bind(this))
        
*/

class Editor {

  constructor(obj,display){   
    this.display=display
    this.obj=obj
    this.l=document.createElement("div")
    this.l.innerHTML=display.caption
    this.l.className='grid-item left-justified';
    this.r =document.createElement("div")
    this.r.className='grid-item centered'
    this.part=document.createElement("div")
    this.part.className= "w3-white  double"         
    this.part.appendChild(this.l)
    this.part.appendChild(this.r)

    this.editor=document.getElementById(display.editor).cloneNode(true); 
    this.r.appendChild(this.editor)
  
    }
  update(){
      this.value=this.display.value
      if(this.display.value==null)this.value=this.obj[this.display.name]
       this.editor.children[0].addEventListener("input",this.onclicked.bind(this))
  }
  onclicked(){}
  }
  class BoolEditor extends Editor{
    constructor(obj,display){        
      super(obj,display)
    }
    update(){
      super.update()
      this.editor.children[0].checked=this.value
      this.editor.children[0].addEventListener("input",this.onclicked.bind(this))

    }
    onclicked(){
      if(this.display.value==null)this.obj[this.display.name]= this.editor.children[0].checked
    }
  }

  class NumberEditor extends Editor{
    constructor(obj,display){
      super(obj,display)
    }

    update(){
      super.update()
      this.editor.children[0].value=this.value
      this.editor.children[0].addEventListener("input",this.onclicked.bind(this))

    }
  }

  class ColorEditor extends Editor{
    constructor(obj,display){
      super(obj,display)
    }
    update(){
      super.update()
      this.editor.children[0].value=Utility.rgbToHex(this.value[0]*255,this.value[1]*255,this.value[2]*255)
      this.editor.children[0].addEventListener("input",this.onclicked.bind(this))

    }
    onclicked(){
      var value=this.editor.children[0].value
      this.display.value=Utility.hexToRGB(value)
    }
  }

  class RangeEditor extends Editor{
    constructor(obj,display){
      super(obj,display)
    }
    update(){
      super.update()
      this.editor.children[0].value=this.display.value
      this.editor.children[0].addEventListener("input",this.onclicked.bind(this))

    }
    onclicked(){
      var value=this.editor.children[0].value
      this.display.value=value/100
    }
  }




  function createEditor(obj,ar){
    switch(ar.editor){
      case 'boolean': return new BoolEditor(obj,ar)
      case 'number': return new NumberEditor(obj,ar)
      case 'color': return new ColorEditor(obj,ar)
      case 'tripplepos': return new TripplePos(obj,ar)
      case 'range': return new RangeEditor(obj,ar)
      case 'edit': return new Editor(obj,ar)
    }

  }