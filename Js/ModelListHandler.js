/// <reference path="References.js" />

if (window.Yoyo === undefined)
{
    window.Yoyo = {};   
}

Yoyo.ModelListPath = "Models.txt";

//Holds strings that is used in ModelListPath file
Yoyo.ModelListItemCommands = { "Name": "name", "Path" : "path" ,"ThumbnailPath" : "thumbnail", "Shader" : "shader", "Diffusemap" : "diffusemap" ,
                            "Normalmap" : "normalmap" , "Specularmap" : "specularmap", "Texture" : "texture"};

//Holds a string with names from the txt file
Yoyo.ModelListShadertypes = { "Normal" : "normal" };

Yoyo.ModelListHandler = Backbone.Collection.extend(
{
    model:Yoyo.ModelListItem,
    //Array of the items
    m_items:null,
    
} );  

Yoyo.ModelListHandler.prototype.Initilize = function(a_renderer)
{
    ///<summary>Takes a ModelListView as parameter to render each object as they load </summary>
    var f_that = this;
    Yoyo.Ajax.ReadFile(Yoyo.ModelListPath, function(a_modelList)
    {
        //First item is comments
        var f_modellistitems = a_modelList.split(';');
        var i = 0;

        var f_name;
        var f_path;
        var f_thumbnailpath;
        var f_shaderType;
        var f_textures = [];

        var j = 0;

        //f_modellistitems[i] is what f_item is, a whole ModelItemList
        var f_item = "";
        //Is f_item split on "\n" , each line in the modelItemList
        var f_itempart = "";

        //Each segment in f_itempart
        var f_partinfo = "";

        //The item to be added to collection
        var f_listitem = null;

        //As written before, first item is not needed!
        for (i = 1; i < f_modellistitems.length; i++) 
        {
            f_textures = [];
            f_item = f_modellistitems[i];
            //Removes \r
            f_item = f_item.replace(Yoyo.RemoveRLinebreakRegex,"")
            f_thumbnailpath = "";
            f_path = "";
            f_itempart = f_item.split("\n");
            

            for (j = 0; j < f_itempart.length; j++)
            {
                f_partinfo = f_itempart[j].split(" ");
                    
                switch(f_partinfo[0].toLowerCase() )
                {
                    case Yoyo.ModelListItemCommands.Texture:
                        f_textures.push(new Yoyo.TextureObject(Yoyo.Texturetype.Other, f_partinfo[1]) );
                        break;                        
                    case Yoyo.ModelListItemCommands.Normalmap:
                        f_textures.push(new Yoyo.TextureObject(Yoyo.Texturetype.Normal, f_partinfo[1]) );
                        break;
                    case Yoyo.ModelListItemCommands.Specularmap:
                        f_textures.push(new Yoyo.TextureObject(Yoyo.Texturetype.Specular, f_partinfo[1]) );
                        break;
                    case Yoyo.ModelListItemCommands.Diffusemap:
                        f_textures.push(new Yoyo.TextureObject(Yoyo.Texturetype.Diffuse, f_partinfo[1]) );
                        break;
                    case Yoyo.ModelListItemCommands.Path:
                        f_path = f_partinfo[1];
                        break;
                    case Yoyo.ModelListItemCommands.ThumbnailPath:
                        f_thumbnailpath = f_partinfo[1];
                        break;
                    case Yoyo.ModelListItemCommands.Shader:
                        f_shaderType = f_that.GetShadertype(f_partinfo[1]);
                        break;                       
                    case Yoyo.ModelListItemCommands.Name:
                        f_name = f_partinfo[1];
                        break;
                    //Can be comment or random letter!
                    default:
                        break;
                }
            }            

            f_listitem = new Yoyo.ModelListItem();
            f_listitem.Initilize(f_name, f_path, f_thumbnailpath ,f_shaderType, f_textures);

            f_that.add(f_listitem);

            a_renderer.RenderItem(f_listitem);

            
        }            
    
    } , true);   
}
Yoyo.ModelListHandler.prototype.GetShadertype = function(a_shadername)
{   
    var f_lowershadername = a_shadername.toLowerCase();    

    switch (f_lowershadername)
    {
        case Yoyo.ModelListShadertypes.Normal:
            return Yoyo.Shadertype.Normal;             
        default:
            console.log("Yoyo.ModelListHandler.GetShadertype: a_shadername is bad shadertype: '" + f_lowershadername + "'");
            return null;
    }
}  
