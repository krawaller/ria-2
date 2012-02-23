///<reference path="References.js" />

if (window.Yoyo === undefined)
{
    window.Yoyo = {};   
}

Yoyo.Texturetype = { "Diffuse" : 0, "Normal" : 1, "Specular" : 2,"Other" : 3 };

Yoyo.TextureObject = function(a_textureType, a_path)
{
    if (a_path === undefined || a_path.length < 3)
    {
        console.log("a_path needs a valid path");
    }
    
    this.m_path = a_path;
    this.m_textureType = a_textureType;        
}

Yoyo.ModelListItem = Backbone.Model.extend(
{
    m_name:"",
    m_path:"",
    m_thumbnailpath:"",
    m_shaderType:null,
    m_textures:[],    
} );

Yoyo.ModelListItem.prototype.Initilize = function(a_name, a_path, a_thumbnailpath ,a_shaderType,a_textures)
{
    if (a_name.length === undefined || a_name.length < 1)
    {
        console.log("Yoyo.ModelListItem.Initilize: a_name is not a valid name");
    }
    else if (a_path.length === undefined || a_path.length < 3)
    {
        console.log("Yoyo.ModelListItem.Initilize: a_path is not a valid path");
    }
    else if (a_thumbnailpath.length === undefined || a_thumbnailpath.length < 3)
    {
        console.log("Yoyo.ModelListItem.Initilize: a_thumbnailPath is not a valid path");
    }
    else if (a_shaderType === undefined)
    {
        console.log("Yoyo.ModelListItem.Initilize: a_shadertype is required");
    }

    this.m_name = a_name;
    this.m_path = a_path;
    this.m_thumbnailpath = a_thumbnailpath;
    this.m_shaderType = a_shaderType;
    this.m_textures = a_textures;
}

