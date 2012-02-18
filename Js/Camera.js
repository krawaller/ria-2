///<reference path="References.js" />

if (window.Yoyo === undefined)
{
    window.Yoyo = {};   
}

Yoyo.Camera = function(a_cameraPosition, a_lookAtPoint, a_width, a_height)
{
    this.m_projectionMatrix = undefined;
    this.m_viewMatrix = undefined;

    this.m_projViewMatrix = mat4.create();

    this.m_cameraPosition = a_cameraPosition;
    this.m_lookAtPoint = a_lookAtPoint;

    this.m_cameraDir = vec3.create(vec3.subtract(this.m_lookAtPoint, this.m_cameraPosition) );

    this.m_fov;
    this.m_width;
    this.m_height;
    this.m_aspectRatio;

    this.SetViewMatrix();
    this.SetProjectionMatrix(90, a_width, a_height);
}

Yoyo.Camera.prototype.SetViewMatrix = function()
{
    this.m_viewMatrix = mat4.lookAt(this.m_cameraPosition, this.m_lookAtPoint, vec3.create([0,1,0]) );

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