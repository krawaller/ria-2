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

    //Inits the m_gl object
    this.InitWebGL();
    
    this.m_gl.enable(this.m_gl.DEPTH_TEST);

    this.m_gl.enable(this.m_gl.CULL_FACE);
    this.m_gl.cullFace(this.m_gl.BACK);
    
    this.m_camera =  new Yoyo.Camera( vec3.create([0,2,4]),Math.PI * -0.5 , 0 , this.m_canvas.width, this.m_canvas.height );

    this.m_directionalLight = new Yoyo.DirectionalLight(vec3.create([1,-5,-5]) , vec3.create([0.7,0.7,0.7] ) );
    
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
        console.log( "Yoyo.Scene.InitWebGL: Unable to initialize WebGL. Your browser may not support it." );
    }    
}

//Adds a model.. called that incase I some day wants more than 1 model!
Yoyo.Scene.prototype.AddModel = function(a_modelListItem)
{
    if (this.m_currentModel === null || this.m_currentModel.m_path !== a_modelListItem.m_path)
    {
        this.m_currentModel = new Yoyo.Model(a_modelListItem.m_name, a_modelListItem.m_path);
        this.m_currentModel.LoadModel(this.m_gl);

        this.SetModelShader(a_modelListItem.m_shaderType, a_modelListItem.m_textures);

        this.Render(0);
    }
}

Yoyo.Scene.prototype.SetModelShader = function(a_shadertype, a_textures)
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
            f_shader.InitShader(this.m_gl, a_textures);
            break;
        default:
            throw "Yoyo.Scene.SetModelShader: Not known shadertype";
    }    
    
    this.m_currentModel.SetShader(f_shader);    
}

Yoyo.Scene.prototype.Render = function(a_elapsedTime)
{
    /// <summary>Renders the scene</summary>    

    //Just to get a black canvas! so it's not white! 
    this.m_gl.viewport(0, 0, this.m_camera.m_width, this.m_camera.m_height);
    this.m_gl.clearColor(0.0, 0, 0.0, 1.0); 
    this.m_gl.clear(this.m_gl.COLOR_BUFFER_BIT | this.m_gl.DEPTH_BUFFER_BIT);     
    
    if (this.m_currentModel !== null)
    {
        if (this.m_currentModel.m_loaded)
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
                    this.m_currentModel.Draw(this.m_gl, this.m_camera, this.m_directionalLight);
                }
                catch (e)
                {
                    console.log("Yoyo.Scene.Render: Error when drawing model error: " + e.message);
                }                
            }
        }
        else
        {
            Yoyo.requestAnimFrame(this);  
        }      
        
    }

    //var f_render = this.Render;

    //var f_this = this;

    //setTimeout(function() { f_this.Render(); }, 16);
    //this.Render();
}