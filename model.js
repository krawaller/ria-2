///<reference path="References.js" />

if (window.Yoyo === undefined)
{
    window.Yoyo = {};   
}

Yoyo.ModelImportersTechs = { "Object" : 0 };

Yoyo.Model = function(a_name)
{
    if (!a_name)
    {
        throw "Yoyo.Model: a_name is not a name!"; 
    } 

    this.m_name = a_name;
    this.m_shader = null;

    this.m_loaded = false;
}

Yoyo.Model.prototype.SetShader = function(a_shader)
{
    this.m_shader = a_shader;
}

Yoyo.Model.prototype.CreateFromObj = function(a_path, a_gl)
{
    if (a_path === undefined || a_path.length === undefined || a_path.length < 1)
    {
        throw "Needs a path to create a model";
    }
    else if (!a_gl)
    {
        throw "Needs a gl object";
    }

    var f_that = this;


    //Reading the file synchronously, possibly bad if it's big big models...
    //So possible optimization later on: Make it asynchronous and throw events when you click!
    new Yoyo.Ajax.ReadFile(a_path, function(a_objFile)
    {
        var m_that = f_that;

        var f_objData = a_objFile.split("\n");
        var f_lineData;
        var f_data;
        //Used at like when you need to split even more like at f_linedata = f 13/14 15/16
        //so f_data would be 13/14, 15/16. So need f_additionalData to get 13, 14  and 15,16!
        var f_additionalData;

        //Used when reading the IDs from faces
        var f_id;
        
        var i, j;
        
        //Will hold the values of vertexbuffer
        var f_vertexBuffer = [];
        //Will read IDs from face and fill it with data from f_vertexBuffer
        var f_verticeIndexBuffer = [];
        
        //Value from vt x y
        var f_textCoords = [];
        //Will read IDs from face and fill it with data from f_textCoords
        var f_textureIndex = [];

        //Possible Normal buffer & normalIndexes


        for (i = 0; i < f_objData; i++) 
        {
            f_lineData = f_objData[i];            
            
            f_data = f_lineData.split(" ");
            
            //First vertices, then texture cordinates, then normal cordinates, then faces ids!'
            //v x y z
            if (f_data[0] ==="v")
            {
                f_vertexBuffer.push(parseFloat(f_data[1]) );
                f_vertexBuffer.push(parseFloat(f_data[2]) );
                f_vertexBuffer.push(parseFloat(f_data[3]) );
            }
            //vt x y
            else if (f_data[0] === "vt")
            {
                f_textCoords.push(parseFloat(f_data[1]) ); 
                f_textCoords.push(parseFloat(f_data[2]) );  
            }
            //vn x y z
            else if (f_data[0] === "vn")
            {
                
            }
            //f vID  || vID/vtID  || vID/vnID/vtID  || vID//vtID   
            else if (f_data[0] === "f")
            {
                //Needed mainly cause of f_additionalData split, to be noted tho: obj model 
                for (j = 1; j < f_data.length; j++) 
                {
                    f_additionalData = f_data[j].split("/");

                    if (f_additionalData.length === 2)
                    {
                        //Texture index === [1]
                    }
                    else if (f_additionalData.length === 3)
                    {
                        //Normal index = [1]
                        //Texture index === [2]
                    }
                }
            }
            //Reason for no else is that if some bad value would come in it doesn't get read and potentially crashes! 
        }//End for loop


    }, false);
}

