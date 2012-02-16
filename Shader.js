///<reference path="References.js" />

if (window.Yoyo === undefined)
{
    window.Yoyo = {};   
}

Yoyo.Shader = function()
{
    this.m_vertexShader;
    this.m_fragmentShader;

    this.m_shaderProgram;

    this.m_vertexPositionAttribute;
    this.m_textureCoordAttribute;
}

Yoyo.Shader.prototype.InitShader = function(a_gl) {}

Yoyo.Shader.prototype.LoadVertexShader = function(a_gl){}

Yoyo.Shader.prototype.LoadFragmentShader = function(a_gl){}

Yoyo.Shader.prototype.SetMatrixUniforms = function(a_scene) {};

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
