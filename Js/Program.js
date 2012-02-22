///<reference path="References.js" />

if (window.Yoyo === undefined)
{
    window.Yoyo = {};   
}

window.onload = function()
{    
    var ApplicationModel = Backbone.Model.extend(
    {
        m_scene: null,

        InitilizeScene: function(a_canvas) 
        {        
            this.m_scene = new Yoyo.Scene(a_canvas);                     
        }
    } );
    
    var m_program = new ApplicationModel();
    m_program.InitilizeScene(document.getElementById("glcanvas") );
    //m_program.m_scene.Render();

    m_program.m_scene.LoadModel("testobject",Yoyo.ModelImportersTechs.Object);
    m_program.m_scene.SetModelShader(Yoyo.Shadertype.Normal);
    
    var m_viewerControls = new Yoyo.ViewerControls();
    m_viewerControls.InitilizeScene(m_program.m_scene);
    
    Yoyo.requestAnimFrame(m_program.m_scene);   
     
}

