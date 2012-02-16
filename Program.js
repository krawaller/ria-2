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
            m_scene = new Yoyo.Scene(a_canvas);
            console.log(m_scene);
        }
    } );

    var m_program = new ApplicationModel();
    //m_program.InitilizeScene(document.getElementById("glcanvas") );
    
    m_program.m_scene = new Yoyo.Scene(document.getElementById("glcanvas"));
    m_program.m_scene.Render();
    //m_program.m_scene = new Yoyo.Scene();

    //console.log (m_program.m_scene);
   
}

