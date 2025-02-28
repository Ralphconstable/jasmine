_ModelsGallery=[
    {"category":"Primatives","model":"Plane","class":"Plane","icon":null,"object":"new Modal2('quad',Primatives.Quad.createMesh(gl)).setShader(pShader)"},
    {"category":"Primatives","model":"Cube","class":"Cube","icon":null,"object":"new Modal2('cube',Primatives.Cube.createMesh(gl,1,1,1,0,0,0)).setShader(pShader)"},
    {"category":"Primatives","model":"Line","class":"Line","icon":null,"object":"new Modal2('cube',Primatives.Line.createMesh(gl,new Vector3(0,0,0),new Vector3(1,0.5,0))).setShader(pShader)"},


]
_ShaderDictionary=[
    {"category":"Lighting","model":"SimpleDiffuse","class":"Ambient","icon":null,
        "main":	 '#version 300 es\n' +
        'precision mediump float;' +
        'out vec4 finalColor;' +
        'void main(void){ finalColor = vec4(1.,1.,0.0,1.0); }'


      }
      
      /*"in vec3 Normal;\n "+ 
        "in vec3 FragPos;\n "+ 
        "uniform vec3 lightPos;\n "+
        "uniform vec3 lightColor;\n"+
        "uniform vec3 objectColor;\n"+
        
        "void main(){\n"+
            // ambient
            "float ambientStrength = 0.1;\n"+
            "vec3 ambient = ambientStrength * lightColor;\n"+
              
            // diffuse 
            "vec3 norm = normalize(Normal);\n"+
            "vec3 lightDir = normalize(lightPos - FragPos);\n"+
            "float diff = max(dot(norm, lightDir), 0.0);\n"+
            "vec3 diffuse = diff * lightColor;\n"+
                    
            "vec3 result = (ambient + diffuse) * objectColor;\n"+
            "FragColor = vec4(result, 1.0);} "
    }*/

]
