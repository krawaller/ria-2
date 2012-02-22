///<reference path="References.js" />

if (window.Yoyo === undefined)
{
    window.Yoyo = {};   
}

Yoyo.Camera = function(a_cameraPosition, a_xangle, a_yangle , a_width, a_height)
{
    ///<summary> Creates the camera and sets matrixes </summary>
    ///<param type="vec3" name="a_cameraPosition" > The position the camera has </param>
    ///<param type="float" name="a_xangle" > Angle along x axis in radians </param>
    ///<param type="float" name="a_yangle" > Angle along y axis in radians </param>
    ///<param type="int" name="a_width" > Width of viewport </param>
    ///<param type="int" name="a_height" > Height of the viewport </param>

    this.m_projectionMatrix = undefined;
    this.m_viewMatrix = undefined;

    this.m_projViewMatrix = mat4.create();

    //The "up" vector in mat4.lookAt creation
    this.m_vectorUp = vec3.create([0,1,0]);
    this.m_cameraPosition = a_cameraPosition;
    this.m_lookAtPoint = vec3.create([0,0,0]);

    this.m_cameraDir; //= vec3.create(vec3.subtract(this.m_lookAtPoint, this.m_cameraPosition) );
    //vec3.normalize(this.m_cameraDir);

    //Perspective matrix stuff!
    this.m_fov;
    this.m_width;
    this.m_height;
    this.m_aspectRatio;

    //Rotation around axises, used to set m_cameraDir
    this.m_yaxis = a_yangle;
    this.m_xaxis = a_xangle;

    this.SetCameraDirection();
    this.SetViewMatrix();
    this.SetProjectionMatrix(90, a_width, a_height);

    //control stuff like camera speed
    
}

Yoyo.Camera.prototype.SetViewMatrix = function()
{
    this.m_viewMatrix = mat4.lookAt(this.m_cameraPosition, this.m_lookAtPoint, this.m_vectorUp  );

    this.SetViewProjMatrix();
}

Yoyo.Camera.prototype.SetProjectionMatrix = function(a_fov, a_width, a_height)
{
    this.m_fov = a_fov;
    this.m_width = a_width;
    this.m_height = a_height;

    this.m_aspectRatio = this.m_width / this.m_height;

    this.UpdateProjectionMatrix();
}

Yoyo.Camera.prototype.UpdateProjectionMatrix = function()
{
    this.m_projectionMatrix = mat4.perspective(this.m_fov, this.m_aspectRatio, 0.5,100);

    this.SetViewProjMatrix();
}

Yoyo.Camera.prototype.SetViewProjMatrix = function()
{
    if (this.m_viewMatrix !== undefined && this.m_projectionMatrix !== undefined)
    {            
         mat4.multiply(this.m_viewMatrix, this.m_projectionMatrix, this.m_projViewMatrix); 
    }
}

Yoyo.Camera.prototype.SetCameraDirection = function()
{
    ///<summary>Sets the m_cameraDir vector based on x axis rotation and y rotation</summary>
    //xa = x-axis  ya = y-axis
    //x = sin (xa) * cos (ya)
    //y = sin (xa) * sin (ya)
    //z = cos(xa)

    this.m_cameraDir = vec3.create([Math.sin(this.m_xaxis) * Math.cos(this.m_yaxis) ,Math.sin(this.m_xaxis) * Math.sin(this.m_yaxis)  , Math.cos(this.m_xaxis) ]);

    vec3.add(this.m_cameraPosition, this.m_cameraDir, this.m_lookAtPoint);

}

Yoyo.Camera.prototype.RotateVertical = function(a_ymoved)
{
    var f_radians = this.ConvertMouseMovementToRadian(a_ymoved);

    this.m_yaxis += f_radians;    
}

Yoyo.Camera.prototype.RotateHorizontal = function(a_xmoved)
{
    var f_radians = this.ConvertMouseMovementToRadian(a_xmoved);

    this.m_xaxis += f_radians;    
}

Yoyo.Camera.prototype.ConvertMouseMovementToRadian = function(a_value)
{
    //x / 200
    return a_value * 0.005;
}

Yoyo.Camera.prototype.MoveLeft = function(a_elapsedTime)
{
    //Camera Direction + 90 degrees
    
    
}