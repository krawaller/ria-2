///<reference path="References.js" />

if (window.Yoyo === undefined)
{
    window.Yoyo = {};   
}

Yoyo.Shadertype = { "Normal" : 0 };

Yoyo.Shader = function()
{
    this.m_vertexShader;
    this.m_fragmentShader;

    this.m_loaded = false;

    //Shader texture objects
    this.m_stos = [];

    this.m_shaderProgram;    
}

Yoyo.Shader.prototype.InitShader = function(a_gl) {}

Yoyo.Shader.prototype.CheckIfReady = function() {};

Yoyo.Shader.prototype.LoadVertexShader = function(a_gl){}

Yoyo.Shader.prototype.LoadFragmentShader = function(a_gl){}

Yoyo.Shader.prototype.AddTexture = function(a_gl, a_path, a_samplerName) {};

Yoyo.Shader.prototype.Draw = function(a_gl, a_model, a_camera) {};

Yoyo.Shader.prototype.SetMatrixUniforms = function(a_gl, a_camera, a_model) {};


//ShaderTexture Object

Yoyo.ShaderTextureObject = function(a_path, a_sampler ,a_gl)
{
    if (!a_path)
    {
        throw("Yoyo.ShaderTextureObject: a_path is not defined");
    }
    else if (!a_path.length || a_path.length < 3)
    {
        throw("Yoyo.ShaderTextureObject: a_path must be 3 letters or longer eg: *.* ");
    }
    else if (!a_sampler)
    {
        throw("Yoyo.ShaderTextureObject: a_sampler is undefined");
    }
    else if (!a_gl)
    {
        throw("Yoyo.ShaderTextureObject: a_gl is undefined");
    }

    this.m_loaded = false; 
    //The texture when drawing
    this.m_texture = a_gl.createTexture();

    //Used in drawing, say normalSampler has normalTexture
    this.m_sampler = a_sampler;

    //Image loading
    var f_that = this;
    var m_image = new Image();
    m_image.src = a_path;

    m_image.onload = function()
    {
        var m_that = f_that;
        m_that.LoadTexture(m_image, a_gl);        
    }
}

Yoyo.ShaderTextureObject.prototype.LoadTexture = function(a_image, a_gl)
{
    ///<summary>Loads a texture in a ShaderTextureObject (sto) </summary>

    a_gl.bindTexture(a_gl.TEXTURE_2D, this.m_texture);
    //Flips it cause it's upside down, so this is a -fix- so it's no need to flip it in the shader
    a_gl.pixelStorei(a_gl.UNPACK_FLIP_Y_WEBGL, true);
    a_gl.texImage2D(a_gl.TEXTURE_2D, 0, a_gl.RGBA, a_gl.RGBA, a_gl.UNSIGNED_BYTE, a_image);
    a_gl.texParameteri(a_gl.TEXTURE_2D, a_gl.TEXTURE_MAG_FILTER, a_gl.LINEAR);
    a_gl.texParameteri(a_gl.TEXTURE_2D, a_gl.TEXTURE_MIN_FILTER, a_gl.LINEAR_MIPMAP_NEAREST);
    a_gl.generateMipmap(a_gl.TEXTURE_2D);
    a_gl.bindTexture(a_gl.TEXTURE_2D, null);

    this.m_loaded = true;
}

