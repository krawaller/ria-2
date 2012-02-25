///<reference path="References.js" />

if (window.Yoyo === undefined)
{
    window.Yoyo = {};   
}

Yoyo.ModelFolderPath = "Models/";
Yoyo.TextureFolderPath = "Textures/";

//Should remove all linebreaks
Yoyo.RemoveRLinebreakRegex = /(\r)/g;
/*
    Table of Contents:

    ShaderStuff
        GetShader( a_gl, a_tagid )
        GetTextureNumber( a_gl, a_id)
    requestAnimFrame
    Add & Remove event
    Stop event


*/
Yoyo.KnownModelFileExtensions = { "Object" : "obj", "Txt" : "txt" };

Yoyo.GetModelImporterTech = function(a_fileExtension)
{
    switch (a_fileExtension)
    {
        //Fallthrough to object
        case Yoyo.KnownModelFileExtensions.Txt:
        case Yoyo.KnownModelFileExtensions.Object:
            return Yoyo.ModelImportersTechs.Object;
        default:
            return null;
    }
}


//*********************************
//          ShaderStuff
//*********************************


//****************
//GetShader(a_gl, a_tagid)
//****************
Yoyo.GetShader = function(a_gl, a_tagid) 
{
    ///<summary>Gets shader source code from tag ID from a script tag. Then checks the script type to make it vertex or fragment shader </summary>

    var shaderScript = document.getElementById(a_tagid);

    var shader;
    var theSource = "";
    var currentChild = shaderScript.firstChild;
  
    // Didn't find an element with the specified ID; abort.  
    if (!shaderScript) 
    {
        return null;
    }
  
    // Walk through the source element's children, building the
    // shader source string.  
    while(currentChild) 
    {
        if (currentChild.nodeType == 3) 
        {
            theSource += currentChild.textContent;
        }    
        currentChild = currentChild.nextSibling;
    }
  
    // Now figure out what type of shader script we have,
    // based on its MIME type.
    if (shaderScript.type == "x-shader/x-fragment") 
    {
        shader = a_gl.createShader(a_gl.FRAGMENT_SHADER);
    } 
    else if (shaderScript.type == "x-shader/x-vertex") 
    {
        shader = a_gl.createShader(a_gl.VERTEX_SHADER);
    } 
    else 
    {
        return null;  // Unknown shader type
    }
  
    // Send the source to the shader object  
    a_gl.shaderSource(shader, theSource);
  
    // Compile the shader program  
    a_gl.compileShader(shader);
    
    // See if it compiled successfully  
    if (!a_gl.getShaderParameter(shader, a_gl.COMPILE_STATUS)) 
    {
        throw "Yoyo.GetShader: An error occurred compiling the shaders: " + a_gl.getShaderInfoLog(shader) ;        
    }
 
    return shader;
}

//********************************
// GetTextureNumber(a_gl, a_id)
//********************************
Yoyo.GetTextureNumber = function(a_gl, a_id)
{
    ///<summary>Used in shaders draw function to get a texture slot for it's STO </summary>

    if (a_id < 0 || a_id > 24)
    {
       console.log("a_id is not within 0 -> 24");
       return null;
    }

    switch(a_id)
    {
        case 0:
            return a_gl.TEXTURE0;
        case 1:
            return a_gl.TEXTURE1;
        case 2:
            return a_gl.TEXTURE2;
        case 3:
            return a_gl.TEXTURE3;   
    }
}

//Declaration of requestAnimFrame()
if (!Yoyo.requestAnimFrame)
{    
    var f_function;
    
        if (window.requestAnimationFrame)
        {
            f_function = window.requestAnimationFrame;
        }
        else if (window.webkitRequestAnimationFrame)
        {
            f_function = window.webkitRequestAnimationFrame;
        }
        else if (window.mozRequestAnimationFrame)
        {
            f_function = window.mozRequestAnimationFrame;
        }
        else if(window.mozRequestAnimationFrame)
        {
            f_function = window.mozRequestAnimationFrame;
        }
        else if (window.oRequestAnimationFrame)
        {
            f_function = window.oRequestAnimationFrame;
        }
        else if (window.msRequestAnimationFrame)
        {
            f_function = window.msRequestAnimationFrame;
        }
        else
        {
            f_function = function(callback){
                window.setTimeout(callback, 1000 / 60);
                };
        }   
    
    Yoyo.requestAnimFrame = function(a_scene)
    {
        f_function(function(a_elapsedTime) { a_scene.Render(a_elapsedTime); });   
    }  
}

//*********************
//Add & Remove event
//**********************
function addEvent( obj, type, fn ) {
  if ( obj.attachEvent ) {
    obj['e'+type+fn] = fn;
    obj[type+fn] = function(){obj['e'+type+fn]( window.event );}
    obj.attachEvent( 'on'+type, obj[type+fn] );
  } else
    obj.addEventListener( type, fn, false );
}
function removeEvent( obj, type, fn ) {
  if ( obj.detachEvent ) {
    obj.detachEvent( 'on'+type, obj[type+fn] );
    obj[type+fn] = null;
  } else
    obj.removeEventListener( type, fn, false );
}

//*********************
//Stop event
//**********************

function stop_event(e) {
   if(!e) {
      e = window.event;
   }
   if (e.stopPropagation) e.stopPropagation();
   e.cancelBubble = true;
   if (e.preventDefault) e.preventDefault();
   e.returnValue = false;
   return false;
}


