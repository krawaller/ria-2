///<reference path="References.js" />

if (window.Yoyo === undefined)
{
    window.Yoyo = {};   
}

Yoyo.Camera = function(a_cameraPosition, a_lookAtPoint)
{
    this.m_projectionMatrix = undefined;
    this.m_viewMatrix = undefined;

    this.m_projViewMatrix;

    this.m_cameraPosition = a_cameraPosition;
    this.m_lookAtPoint = a_lookAtPoint;

    this.m_fov;
    this.m_width;
    this.m_height;
    this.m_aspectRatio;
}

Yoyo.Camera.prototype.SetViewMatrix = function()
{
    this.m_viewMatrix = mat4.lookAt(this.m_cameraPosition, this.m_lookAtPoint, vec3.create([0,1,0]) );
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
    this.m_projectionMatrix = mat4.perspective(this.m_foc, this.m_aspectRatio, 1,100);

    this.SetViewProjMatrix();
}

Yoyo.Camera.prototype.SetViewProjMatrix = function()
{
    if (this.m_viewMatrix !== undefined && this.projectionMatrix !== undefined)
    {
            
        //this.m_projViewMatrix = this.m_viewMatrix * this.m_projMatrix; 
    }
}