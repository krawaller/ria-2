///<reference path="References.js" />

if (window.Yoyo === undefined)
{
    window.Yoyo = {};   
}

/*
keycodes:

w=87
q=81
E=69
a=65
s=83
d=68

*/
Yoyo.ViewerControls = Backbone.View.extend( 
{
    //the scene to modify with the controlls, also has the canvas in it
    m_scene: null,
    m_canvasFocused: false,   

    //Keycodes for moving different directions
    m_strafeRightKey:69,
    m_strafeLeftKey:81,
    m_forwardKey:87,
    m_backwardsKey:83,
    m_turnLeftKey:65,
    m_turnRightKey:68,
    
    m_strafeLeftPressed:false,
    m_strafeRightPressed:false,
    m_forwardPressed:false,
    m_backwardsPressed:false,
    m_turnLeftPressed:false,    
    m_turnRightPressed:false,

    m_lastKeyPress: null,
    
    m_keysPressed:0,
    m_keyPressTimerID:null,       
    
    //Is checked each 16 ms when setTimeout is active, if it's false twice it stops updating mouse movement!
    m_mouseMoved:false,
    m_mousePressed:false,

    //Used in each mousemove event to get how much mouse moved!
    m_lastmouseX:0,
    m_lastmouseY:0,
    //How much mouse moved in x & y since last "call"
    m_totalmouseX:0,
    m_totalmouseY:0,
    
    InitilizeScene: function(a_scene) 
    {        
        var f_that = this;
        this.m_scene = a_scene;        
        
        var f_body = document.getElementsByTagName("body")[0];

        this.SetControlKeys();        

        //When clicking on a key to move camera around
        addEvent(f_body, "keydown", function(e)
        {
            //if (f_that.m_canvasFocused)
            //{
                var f_pressed = false;
                if (e.keycode === f_that.m_strafeLeftKey)
                {
                    f_that.m_strafeLeftPressed = true;
                    f_that.m_keysPressed++;
                    f_pressed = true;
                }

                //If a key is pressed and timer isn't already running
                if (f_pressed && f_that.m_keyPressedTimerID === null)
                {
                    f_that.m_lastKeyPress = new Date();
                    f_that.m_keyPressedTimerID = setTimeout(function() { f_that.ViewerControlEvent(); }, 0);
                }
            //}
            
        } );

        //When letting go of a key
        addEvent(f_body, "keyup", function(e)
        {           
            //Only does stuff if canvas is focused with keyups or the m_keysPressed can get messed up
            //if (f_that.m_canvasFocused)
            //{
                if (e.keycode === f_that.m_strafeLeftKey)
                {
                    f_that.m_strafeLeftPressed = false;
                    f_that.m_keysPressed--;
                }
            
                if (f_that.m_keysPressed < 1 && f_that.m_keyPressedTimerID !== null)
                {
                    clearTimeout(f_that.m_keyPressTimerID);
                }       
            //}                           
            
        } );
        
        //If you click outside the canvas with mouse you deselect the scene to stop using keybindings e.t.c.
        addEvent(f_body, "mousemove", function(e)
        {
                if (f_that.m_mousePressed)
                {                     
                    f_that.m_totalmouseX = e.screenX - f_that.m_oldmouseX;
                    f_that.m_totalmouseY = e.screenY - f_that.m_oldmouseY;   
                
                    f_that.m_oldmouseX = e.screenX;
                    f_that.m_oldmouseY = e.screenY;
                }
                else
                {
                    
                }              
        } ); 
        
        addEvent(f_body, "mousedown", function(e) 
        {           
            if (!f_that.m_mousePressed)
            {                
                f_that.m_mousePressed = true;
                f_that.m_keysPressed++;

                f_that.m_totalmouseX = 0;
                f_that.m_totalmouseY = 0;
                
                f_that.m_oldmouseX = e.pageX;
                f_that.m_oldmouseY = e.pageY;

                if (f_that.m_keyPressTimerID === null)
                {   
                    f_that.m_lastKeyPress = new Date();                 
                    f_that.m_keyPressTimerID = setTimeout(function() { f_that.ViewerControlEvent(); }, 0);
                }
            }            
            
        } );  
        
        addEvent(f_body, "mouseup", function(e) 
        {
            f_that.m_mousePressed = false;
            f_that.m_keysPressed--;              
        } );                                
    }    
} );

Yoyo.ViewerControls.prototype.ViewerControlEvent = function()
{
    var f_that = this;  
    
    var f_noRender = false; 
    
    if (this.m_keysPressed > 0 )//|| this.m_movingMouse)
    {          
        var f_elapsedTime = new Date() - this.m_lastKeyPress;

        if (this.m_strafeLeftPressed)
        {
            this.m_scene.m_camera.MoveLeft(f_elapsedTime);
        }
        
        //if (this.m_movingMouse)
        if (this.m_mousePressed)
        {
            if (this.m_totalmouseX !== 0 || this.m_totalmouseY !== 0)
            {
                f_mouseMoved = true;
                //If havn't moved mouse
                //this.m_mouseMoved = true;                    
                
                if (this.m_totalmouseY !== 0)
                {                    
                    this.m_scene.m_camera.RotateVertical(this.m_totalmouseY);                    
                }                

                if (this.m_totalmouseX !== 0)
                {                    
                    this.m_scene.m_camera.RotateHorizontal(-this.m_totalmouseX);
                }
                
                this.m_scene.m_camera.SetCameraDirection();                                           
            }
            else 
            {
                //As mouse didn't move and only mouse is pressed, there is no need to render
                if (this.m_keysPressed)
                {
                    f_noRender = true;
                }
            }           
                
            //Should have 16 milliseonds to move mouse
            this.m_totalmouseX = 0;
            this.m_totalmouseY = 0;                   
                        
        }        

        if (!f_noRender)
        {
            this.m_scene.m_camera.SetViewMatrix();
            this.m_scene.Render();
        }
        
        this.m_keyPressTimerID = setTimeout(function(){ f_that.ViewerControlEvent(); }, 16);
    }
    else
    {
        this.m_keyPressTimerID = null;
    }
}   

Yoyo.ViewerControls.prototype.SetControlKeys = function()
{    
    this.m_strafeRightKey = 69;
    this.m_strafeLeftKey = 81;
    this.m_forwardKey = 87;
    this.m_backwardsKey = 83;
    this.m_turnLeftKey = 65;
    this.m_turnRightKey = 68; 
}

Yoyo.ViewerControls.prototype.UnsetPressedKeys = function()
{
    this.m_keysPressed = 0;

    this.m_strafeLeftPressed = false;
    this.m_strafeRightPressed = false;
    this.m_forwardPressed = false;
    this.m_backwardsPressed = false;
    this.m_turnLeftPressed = false;   
    this.m_turnRightPressed = false;

    this.m_movingMouse = false;
    this.m_totalmouseX = 0;
    this.m_totalmouseY = 0;       

    if (this.m_keyPressTimerID !== null)
    {
        clearTimeout(this.m_keyPressTimerID);
        this.m_keyPressTimerID = null;
    }
}
