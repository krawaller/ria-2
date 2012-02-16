///<reference path="References.js" />

if (window.Yoyo === undefined)
{
    window.Yoyo = {};   
}

//Declaration of requestAnimFrame()
if (!Yoyo.requestAnimFrame)
{    
    var f_function;
    
        if (window.requestAnimationFrame)
        {
            f_function = window.requestAnimationFrame;
        }
        else if (window.webkitRequestAnimationFrame)
        {
            f_function = window.webkitRequestAnimationFrame;
        }
        else if (window.mozRequestAnimationFrame)
        {
            f_function = window.mozRequestAnimationFrame;
        }
        else if(window.mozRequestAnimationFrame)
        {
            f_function = window.mozRequestAnimationFrame;
        }
        else if (window.oRequestAnimationFrame)
        {
            f_function = window.oRequestAnimationFrame;
        }
        else if (window.msRequestAnimationFrame)
        {
            f_function = window.msRequestAnimationFrame;
        }
        else
        {
            f_function = function(callback){
                window.setTimeout(callback, 1000 / 60);
                };
        }   
    
    Yoyo.requestAnimFrame = f_function;     
}
