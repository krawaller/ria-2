/// <reference path="References.js" />

if (window.Yoyo === undefined)
{
    window.Yoyo = {};   
}

Yoyo.PointLight = function(a_lightPosition, a_lightColor, a_radius)
{
    ///<summary> Struct of a pointlight (Spherical lightning) </summary>
    ///<param type="vec3" name="a_lightPosition" >Position of the light</param>
    ///<param type="vec3" name="a_lightColor" >Color of the light</param>
    ///<param type="float" name="a_radius" >The spherical radius of how far the light reaches</param>
    this.m_lightPosition = a_lightPosition;
    this.m_lightColor = a_lightColor;
    this.m_radius = a_radius;
    
}

Yoyo.DirectionalLight = function(a_lightDirection, a_lightColor)
{
    ///<summary> Struct of a directional light, normally only 1 of these active </summary>    
    ///<param type="vec3" name="a_lightColor" >Color of the light</param>
    ///<param type="vec3" name="a_lightDirection" >Direction of the light</param>
    this.m_lightDirection = vec3.normalize(a_lightDirection);
    this.m_lightColor = a_lightColor;
}

