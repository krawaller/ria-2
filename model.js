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

    //this.m_hasTexture = false;

    this.m_vertexBuffer;
    this.m_textureCoordinates;
    this.m_normalBuffer;
}

Yoyo.Model.prototype.SetShader = function(a_shader)
{
    this.m_shader = a_shader;
}

Yoyo.Model.prototype.Draw = function(a_gl, a_camera)
{
    this.m_shader.Draw(a_gl, this, a_camera);
}

Yoyo.Model.prototype.CreateFromObj = function(a_path, a_gl)
{
    ///<summary>Creates vertex buffers e.t.c. from an wavefront .obj file </summary>

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

        
        for (i = 0; i < f_objData.length; i++) 
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

                    //* 3 because it's 3 vertexes per ID (xyz) and -3 because the ID starts on 1 in the .obj file
                    f_id = parseInt(f_additionalData[0] * 3, 10) - 3;
                    f_verticeIndexBuffer.push(f_vertexBuffer[f_id++]);
                    f_verticeIndexBuffer.push(f_vertexBuffer[f_id++]);
                    f_verticeIndexBuffer.push(f_vertexBuffer[f_id]);

                    if (f_additionalData.length === 2)
                    {
                        //Texture index === [1]
                        f_id = parseInt(f_additionalData[1] * 2, 10) - 2;
                        f_textureIndex.push(f_textCoords[f_id++] );
                        f_textureIndex.push(f_textCoords[f_id] );
                    }
                    else if (f_additionalData.length === 3)
                    {
                        //Normal index = [1]
                        //Texture index === [2]

                        f_id = parseInt(f_additionalData[2] * 2, 10) - 2;
                        f_textureIndex.push(f_textCoords[f_id++] );
                        f_textureIndex.push(f_textCoords[f_id] );
                    }
                }
            }
            //Reason for no else is that if some bad value would come in it doesn't get read and potentially crashes! 
        }//End for loop

        try
        {
            //Creates the vertex buffer that is to be used!
            m_that.m_vertexBuffer = a_gl.createBuffer();
            a_gl.bindBuffer(a_gl.ARRAY_BUFFER, m_that.m_vertexBuffer);
            a_gl.bufferData(a_gl.ARRAY_BUFFER, new Float32Array(f_verticeIndexBuffer), a_gl.STATIC_DRAW);
            m_that.m_vertexBuffer.itemSize = 3;
            m_that.m_vertexBuffer.numItems = f_verticeIndexBuffer.length / 3;

            //If it has any texture info
            if (f_textureIndex.length > 0)
            {
                m_that.m_textureCoordinates = a_gl.createBuffer();
                a_gl.bindBuffer(a_gl.ARRAY_BUFFER, m_that.m_textureCoordinates);
                a_gl.bufferData(a_gl.ARRAY_BUFFER, new Float32Array(f_textureIndex), a_gl.STATIC_DRAW);

                m_that.m_textureCoordinates.itemSize = 2;
                m_that.m_textureCoordinates.numItems = f_textureIndex.length * 0.5;                
            }
            m_that.m_loaded = true;

        }
        catch (e)
        {
            throw "Yoyo.Model.CreateFromObj: When setting buffers error: " + e.message;
        }        

        


    }, false);
}

