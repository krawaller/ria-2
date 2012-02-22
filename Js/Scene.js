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
    
    //Any rotation on the model
    this.m_rotationMatrix = mat4.create();   

    //Inits the m_gl object
    this.InitWebGL();
    
    this.m_gl.enable(this.m_gl.DEPTH_TEST);
    this.m_camera =  new Yoyo.Camera( vec3.create([0,2,-3]), 0,0, this.m_canvas.width, this.m_canvas.height );
    
    this.m_lastRender;      
}

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
        mat4.identity(this.m_rotationMatrix);
        //Creates a new model
        this.m_currentModel = new Yoyo.Model(a_modelname);

        switch (a_modelImporterTech)
        {
            case Yoyo.ModelImportersTechs.Object:          
                this.m_currentModel.CreateFromObj(Yoyo.ModelFolderPath + a_modelname + ".obj", this.m_gl);
                break;
            default:
                throw "Yoyo.Scene.LoadModel: Not an existing model importer technique.";
        }    
    }    
}

Yoyo.Scene.prototype.SetModelShader = function(a_shadertype)
{
    if (this.m_currentModel === null)
    {
        throw "Yoyo.Scene.SetModelShader: m_currentModel is not set";
    }    
    
    var f_shader = null;

    switch (a_shadertype)
    {
        case Yoyo.Shadertype.Normal: 
            f_shader = new Yoyo.NormalShader();
            f_shader.InitShader(this.m_gl);
            break;
        default:
            throw "Yoyo.Scene.SetModelShader: Not known shadertype";
    }    
    
    this.m_currentModel.SetShader(f_shader);    
}

Yoyo.Scene.prototype.Render = function(a_timeElapsed)
{
    /// <summary>Renders the scene</summary>    

    //Just to get a black canvas! so it's not white! 
    this.m_gl.viewport(0, 0, this.m_camera.m_width, this.m_camera.m_height);
    this.m_gl.clearColor(0.0, 0, 0.0, 1.0); 
    this.m_gl.clear(this.m_gl.COLOR_BUFFER_BIT | this.m_gl.DEPTH_BUFFER_BIT);     
    
    if (this.m_currentModel !== null && this.m_currentModel.m_loaded)
    {
        //Doing the check here which possibly isn't optimal but it's easiest to recall Render here if not loaded!
        if (!this.m_currentModel.m_shader.m_loaded)
        {
            this.m_currentModel.m_shader.CheckIfReady();
            Yoyo.requestAnimFrame(this);
        }
        else
        {
            //try catch isn't really neccesary but it's hard to catch opengl errors otherwise
            try
            {
                this.m_currentModel.Draw(this.m_gl, this.m_camera);
            }
            catch (e)
            {
                throw "Yoyo.Scene.Render: Error when drawing model error: " + e.message;
            }

            //Yoyo.requestAnimFrame(this);
        }       
        
    }

    //var f_render = this.Render;

    //var f_this = this;

    //setTimeout(function() { f_this.Render(); }, 16);
    //this.Render();
}