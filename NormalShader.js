///<reference path="References.js" />
if (window.Yoyo === undefined)
{
    window.Yoyo = {};   
}

Yoyo.NormalShader = function()
{
    Yoyo.Shader.call(this);

    this.m_uProjMatrix;
    this.m_uMVMatrix;
}

//Makes NormalShader inherit from Yoyo.Shader!
Yoyo.NormalShader.prototype = new Yoyo.Shader();

Yoyo.NormalShader.prototype.LoadVertexShader = function(a_gl)
{    
    this.m_vertexShader = Yoyo.GetShader(a_gl, "vertexShader");
}

Yoyo.NormalShader.prototype.LoadFragmentShader = function(a_gl)
{
    this.m_fragmentShader = Yoyo.GetShader(a_gl, "fragmentShader");
}

Yoyo.NormalShader.prototype.InitShader = function(a_gl)
{  
    if (a_gl === undefined || a_gl === null)
    {
        throw "Yoyo.Shader.InitShader: Needs a_gl object!";
    }
    
    this.LoadVertexShader(a_gl);
    this.LoadFragmentShader(a_gl);    
    
    this.m_shaderProgram = a_gl.createProgram();
    a_gl.attachShader(this.m_shaderProgram, this.m_vertexShader);
    a_gl.attachShader(this.m_shaderProgram, this.m_fragmentShader);
    a_gl.linkProgram(this.m_shaderProgram);
  
    // If creating the shader program failed, alert  
    if (!a_gl.getProgramParameter(this.m_shaderProgram, a_gl.LINK_STATUS)) 
    {
        throw "Yoyo.Shader.InitShader: Unable to initialize the shader program!";
    }
  
    a_gl.useProgram(this.m_shaderProgram);
  
    this.m_vertexPositionAttribute = a_gl.getAttribLocation(this.m_shaderProgram, "aVertexPosition");
    a_gl.enableVertexAttribArray(this.m_vertexPositionAttribute);

    this.m_textureCoordAttribute = a_gl.getAttribLocation(this.m_shaderProgram, "aTextureCoord");
    a_gl.enableVertexAttribArray(this.m_textureCoordAttribute);
    
    this.m_uProjMatrix = a_gl.getUniformLocation(this.m_shaderProgram, "uProjMatrix");
    
    this.m_uMVMatrix = a_gl.getUniformLocation(this.m_shaderProgram, "uMVMatrix");             
}

Yoyo.NormalShader.prototype.SetMatrixUniforms = function(a_scene)
{
    //var pUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
    a_scene.m_gl.uniformMatrix4fv(this.m_uProjMatrix, false, a_scene.m_camera.m_projectionMatrix);

    a_scene.m_gl.uniformMatrix4fv(this.m_uMVMatrix, false, a_scene.m_camera.m_viewMatrix);
}