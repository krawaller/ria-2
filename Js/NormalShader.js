///<reference path="References.js" />
if (window.Yoyo === undefined)
{
    window.Yoyo = {};   
}

Yoyo.NormalShader = function()
{
    Yoyo.Shader.call(this);

    this.m_vertexPositionAttribute;
    this.m_textureCoordAttribute;

    //Holds [u]niform location in the shader
    this.m_uProjMatrix;
    this.m_uMVMatrix; 
    this.m_uWorldMatrix;

    this.m_uLightDir;
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
        throw "Yoyo.NormalShader.InitShader: Unable to initialize the shader program!";
    }
  
    a_gl.useProgram(this.m_shaderProgram);

    //Get shader variables!  
    this.m_vertexPositionAttribute = a_gl.getAttribLocation(this.m_shaderProgram, "aVertexPosition");
    a_gl.enableVertexAttribArray(this.m_vertexPositionAttribute);
    
    this.m_textureCoordAttribute = a_gl.getAttribLocation(this.m_shaderProgram, "aTextureCoord");
    a_gl.enableVertexAttribArray(this.m_textureCoordAttribute);
    
    this.m_uProjMatrix = a_gl.getUniformLocation(this.m_shaderProgram, "uProjMatrix");
    
    this.m_uMVMatrix = a_gl.getUniformLocation(this.m_shaderProgram, "uMVMatrix"); 

    this.m_uWorldMatrix = a_gl.getUniformLocation(this.m_shaderProgram, "uWorldMatrix");

    this.m_uLightDir = a_gl.getUniformLocation(this.m_shaderProgram, "uLightDir");


    //Textures
    this.AddTexture(a_gl, Yoyo.TextureFolderPath + "testtexture.png", "uDiffuseSampler");

    this.AddTexture(a_gl, Yoyo.TextureFolderPath + "TestNormalMap.png", "uNormalSampler");
    
    //this.CheckIfReady();            
}

Yoyo.NormalShader.prototype.CheckIfReady = function()
{
    var i = 0;

    var f_loaded = true;

    for (var i = 0; i < this.m_stos.length; i++) 
    {
        if (!this.m_stos[i].m_loaded)
        {
            f_loaded = false;
        }
    }

    this.m_loaded = f_loaded;
}

Yoyo.NormalShader.prototype.AddTexture = function(a_gl, a_path, a_samplerName)
{   
    var f_sampler = a_gl.getUniformLocation(this.m_shaderProgram, a_samplerName);       

    var f_sto = new Yoyo.ShaderTextureObject(a_path, f_sampler, a_gl);

    this.m_stos.push(f_sto);
}

Yoyo.NormalShader.prototype.SetMatrixUniforms = function(a_gl,a_camera,a_model)
{
    a_gl.uniformMatrix4fv(this.m_uProjMatrix, false, a_camera.m_projectionMatrix);

    a_gl.uniformMatrix4fv(this.m_uMVMatrix, false, a_camera.m_viewMatrix);

    a_gl.uniformMatrix4fv(this.m_uWorldMatrix, false, a_model.m_worldMatrix);

    a_gl.uniform3f(this.m_uLightDir, a_camera.m_cameraDir[0], a_camera.m_cameraDir[1], a_camera.m_cameraDir[2]);
}

Yoyo.NormalShader.prototype.Draw = function(a_gl, a_model, a_camera)
{    
    ///<summary> Draws a model using the shader code e.t.c. </summary>
    try
    {
        var i;

        //Binds the vertex info!
        a_gl.bindBuffer(a_gl.ARRAY_BUFFER , a_model.m_vertexBuffer);
        a_gl.vertexAttribPointer(this.m_vertexPositionAttribute, a_model.m_vertexBuffer.itemSize, a_gl.FLOAT, false, 0 , 0);

        //Texture stuff
        a_gl.bindBuffer(a_gl.ARRAY_BUFFER, a_model.m_textureCoordinates);
        a_gl.vertexAttribPointer(this.m_textureCoordAttribute, a_model.m_textureCoordinates.itemSize, a_gl.FLOAT, false, 0, 0);

        for (i = 0; i < this.m_stos.length; i++) 
        {              
            //Sets a texture slot from 0 -> 4 a.t.m.
            a_gl.activeTexture(Yoyo.GetTextureNumber(a_gl,i));
            //Sets correct texture
            a_gl.bindTexture(a_gl.TEXTURE_2D, this.m_stos[i].m_texture);
            //binds sampler, and with what texture ID! had 0 before so could not use 2 or more textures
            a_gl.uniform1i(this.m_stos[i].m_sampler, i);
        }

        this.SetMatrixUniforms(a_gl,a_camera,a_model);
        a_gl.drawArrays(a_gl.TRIANGLES, 0 , a_model.m_vertexBuffer.numItems);
    }
    catch (e)
    {
        throw ("Yoyo.NormalShader.Draw: Unexpected error: " + e.message);
    }   
}