///<reference path="References.js" />

if (window.Yoyo === undefined)
{
    window.Yoyo = {};   
}

Yoyo.Camera = function(a_cameraPosition, a_yawAngle, a_pitchAngle , a_width, a_height)
{
    ///<summary> Creates the camera and sets matrixes </summary>
    ///<param type="vec3" name="a_cameraPosition" > The position the camera has </param>
    ///<param type="float" name="a_yawAngle" > Angle along x axis in radians </param>
    ///<param type="float" name="a_pitchAngle" > Angle along y axis in radians </param>
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
    //The strafe to left direction
    this.m_cameraLeftDir = vec3.create();
    //vec3.normalize(this.m_cameraDir);

    //Perspective matrix stuff!
    this.m_fov;
    this.m_width;
    this.m_height;
    this.m_aspectRatio;

    //Rotation around axises, used to set m_cameraDir
    this.m_yaw = a_yawAngle;
    this.m_pitch = a_pitchAngle;
    this.m_roll;

    this.m_rotateSpeed = 167;
    this.m_moveSpeed = 3;

    //When a vec3 is needed to store values so one doesn't have to be created all the time!
    this.m_tempVec3 = vec3.create();

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
    
   
    this.m_cameraDir = vec3.create([Math.cos(this.m_yaw) * Math.cos(this.m_pitch) ,Math.sin(this.m_pitch)  , Math.sin(this.m_yaw) * Math.cos(this.m_pitch) ]);    

    vec3.add(this.m_cameraPosition, this.m_cameraDir, this.m_lookAtPoint);

    vec3.cross(this.m_cameraDir, this.m_vectorUp, this.m_cameraLeftDir);
    vec3.normalize(this.m_cameraLeftDir);
    
    vec3.cross(this.m_cameraLeftDir, this.m_cameraDir, this.m_vectorUp);
    vec3.normalize(this.m_vectorUp);
    

}

Yoyo.Camera.prototype.RotateVertical = function(a_radian)
{
    var f_radians = this.ConvertMouseMovementToRadian(a_radian);

    this.m_pitch += f_radians;    
}

Yoyo.Camera.prototype.RotateHorizontal = function(a_radian)
{
    var f_radians = this.ConvertMouseMovementToRadian(a_radian);

    this.m_yaw += f_radians;    
}

Yoyo.Camera.prototype.ConvertMouseMovementToRadian = function(a_value)
{
    //1050 / 6.28 = 167~
    return a_value / (this.m_rotateSpeed * 0.5);
}

Yoyo.Camera.prototype.MoveLeft = function(a_elapsedTime)
{
    //Camera Direction + 90 degrees
    vec3.scale(this.m_cameraLeftDir, a_elapsedTime * -this.m_moveSpeed, this.m_tempVec3);
    vec3.add(this.m_cameraPosition, this.m_tempVec3);
    vec3.add(this.m_lookAtPoint, this.m_tempVec3);   
    
}

Yoyo.Camera.prototype.MoveRight = function(a_elapsedTime)
{
    //Camera Direction + 90 degrees
    vec3.scale(this.m_cameraLeftDir, a_elapsedTime * this.m_moveSpeed, this.m_tempVec3);
    vec3.add(this.m_cameraPosition, this.m_tempVec3);
    vec3.add(this.m_lookAtPoint, this.m_tempVec3);   
    
}

Yoyo.Camera.prototype.MoveForward = function(a_elapsedTime)
{
    
    vec3.scale(this.m_cameraDir, a_elapsedTime * this.m_moveSpeed, this.m_tempVec3);
    vec3.add(this.m_cameraPosition, this.m_tempVec3);
}

Yoyo.Camera.prototype.MoveBackwards = function(a_elapsedTime)
{
    vec3.scale(this.m_cameraDir, a_elapsedTime * -this.m_moveSpeed, this.m_tempVec3);
    vec3.add(this.m_cameraPosition, this.m_tempVec3);
}

Yoyo.Camera.prototype.TurnUpwards = function(a_elapsedTime)
{
    this.RotateVertical(this.m_rotateSpeed * a_elapsedTime);
}

Yoyo.Camera.prototype.TurnDownwards = function(a_elapsedTime)
{
    this.RotateVertical(-this.m_rotateSpeed * a_elapsedTime);
}

Yoyo.Camera.prototype.TurnLeft = function(a_elapsedTime)
{
    this.RotateHorizontal(-this.m_rotateSpeed * a_elapsedTime);
}

Yoyo.Camera.prototype.TurnRight = function(a_elapsedTime)
{
    this.RotateHorizontal(this.m_rotateSpeed * a_elapsedTime);
}
