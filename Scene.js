///<reference path="References.js" />

if (window.Yoyo === undefined)
{
    window.Yoyo = {};   
}

Yoyo.Scene = function(a_canvas)
{
    if (a_canvas === undefined )
    {
        throw "Yoyo.Scene a_canvas is not a canvas";
    }

    //The canvas that 3D stuff is drawn to
    this.m_canvas = a_canvas;
    //The gl object that is doing the opengl stuff!
    this.m_gl = null;
    //Camera object which handles rotation, view and projection matrix
    this.m_camera = null;

    //The model that is drawn
    this.m_currentModel = null;

    //The current shaderProgram
    
    //Any rotation on the model
    this.m_rotationMatrix;

    //Inits the m_gl object
    this.InitWebGL();
    
    this.m_gl.enable(this.m_gl.DEPTH_TEST); 
    

     
}

Yoyo.Scene.ModelFolderPath = "Models/";

Yoyo.Scene.prototype.InitWebGL = function() 
{   
    ///<summary>Initiates the webgl object</summary>  
    try 
    {
        this.m_gl = this.m_canvas.getContext("experimental-webgl") 
        if (this.m_gl === null)
        {
            this.m_gl = this.m_canvas.getContext("webgl");
        }        
    }
    catch(e) 
    {
    }
    
    // If we don't have a GL context, give up now
  
    if (!this.m_gl) 
    {
        alert("Unable to initialize WebGL. Your browser may not support it");
        throw "Yoyo.Scene.InitWebGL: Unable to initialize WebGL. Your browser may not support it.";
    }    
}

Yoyo.Scene.prototype.LoadModel = function(a_modelname, a_modelImporterTech)
{
    /// <summary>Loads a model from model file and sets m_currentModel as the model.</summary>
    /// <param name="a_modelname" type="string">The name of the model, no file extension</param>
    /// <param name="a_modelImporterTech" type="ModelImporterTechs">a model importer technique, like object which tries to create model from an object file.</param>   
    
    if (this.m_currentModel === null || this.m_currentModel.m_name !== a_modelname)
    {
        //Reset the rotation matrix so new model doesn't have some odd rotation!   
        this.m_rotationMatrix = mat4.identity();
        //Creates a new model
        this.m_currentModel = new Yoyo.Model(a_modelname);

        switch (a_modelImporterTech)
        {
            case Yoyo.ModelImportersTechs.Object:          
                this.m_currentModel.CreateFromObj(Yoyo.Scene.ModelFolderPath + a_modelname + ".obj", this.m_gl);
                break;
            default:
                throw "Yoyo.Scene.LoadModel: Not an existing model importer technique.";
        }    
    }    
}

Yoyo.Scene.prototype.SetModelShader = function(a_shaderType)
{
    if (this.m_currentModel === null)
    {
        throw "Yoyo.Scene.SetModelShader: m_currentModel is not set";
    }
    var f_shader = null;

    f_shader = new Yoyo.NormalShader();
    f_shader.InitShader(this.m_gl);

    this.m_currentModel.SetShader(f_shader);

    
}

Yoyo.Scene.prototype.Render = function()
{
    /// <summary>Renders the scene</summary>    

    //Just to get a black canvas! so it's not white! 
    this.m_gl.viewport(0, 0, this.m_gl.viewportWidth, this.m_gl.viewportHeight);
    this.m_gl.clearColor(0.0, 0, 0.0, 1.0); 
    this.m_gl.clear(this.m_gl.COLOR_BUFFER_BIT | this.m_gl.DEPTH_BUFFER_BIT);     
    
    if (this.m_currentModel !== null)
    {
        
    }
}