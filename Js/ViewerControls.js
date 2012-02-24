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
    m_strafeRightKey:68,
    m_strafeLeftKey:65,
    m_forwardKey:87,
    m_backwardsKey:83,
    m_turnUpwardsKey:38,
    m_turnDownwardsKey:40,
    m_turnLeftKey:37,
    m_turnRightKey:39,

    m_arrowUpKey:38,
    m_arrowDownKey:40,
    
    m_strafeLeftPressed:false,
    m_strafeRightPressed:false,
    m_forwardPressed:false,
    m_backwardsPressed:false,
    m_turnUpwardsPressed:false,
    m_turnDownwardsPressed:false,
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

    m_wholepageDiv:null,
    
    Initilize: function(a_scene) 
    {     
        this.m_wholepageDiv = document.getElementById("wholepage");
           
        var f_that = this;
        this.m_scene = a_scene;        
        
        var f_body = document.getElementsByTagName("body")[0];

        this.SetControlKeys();        

        //When clicking on a key to move camera around
        addEvent(f_body, "keydown", function(e)
        {
            //console.log(e);
            var f_pressed = false;
            if (e.keyCode === f_that.m_strafeLeftKey && !f_that.m_strafeLeftPressed)
            {
                f_that.m_strafeLeftPressed = true;
                f_that.m_keysPressed++;
                f_pressed = true;
            }
            if (e.keyCode === f_that.m_strafeRightKey && !f_that.m_strafeRightPressed)
            {
                f_that.m_strafeRightPressed = true;
                f_that.m_keysPressed++
                f_pressed = true;
            }

            if (e.keyCode === f_that.m_forwardKey && !f_that.m_forwardPressed)
            {
                f_that.m_forwardPressed = true;
                f_that.m_keysPressed++;
                f_pressed = true;
            }
            
            if (e.keyCode === f_that.m_backwardsKey && !f_that.m_backwardsPressed)
            {
                f_that.m_backwardsPressed = true;
                f_that.m_keysPressed++;
                f_pressed = true;
            }
             
            if (e.keyCode === f_that.m_turnUpwardsKey && !f_that.m_turnUpwardsPressed )
            {                    
                f_that.m_turnUpwardsPressed = true;
                f_that.m_keysPressed++;
                f_pressed = true;
            }

            if (e.keyCode === f_that.m_turnDownwardsKey && !f_that.m_turnDownwardsPressed )
            {                    
                f_that.m_turnDownwardsPressed = true;
                f_that.m_keysPressed++;
                f_pressed = true;
            }    

            if (e.keyCode === f_that.m_turnLeftKey && !f_that.m_turnLeftPressed )
            {                    
                f_that.m_turnLeftPressed = true;
                f_that.m_keysPressed++;
                f_pressed = true;
            }

            if (e.keyCode === f_that.m_turnRightKey && !f_that.m_turnRightPressed )
            {                    
                f_that.m_turnRightPressed = true;
                f_that.m_keysPressed++;
                f_pressed = true;
            }
            
            //If a key is pressed and timer isn't already running
            if (f_pressed && f_that.m_keyPressTimerID === null)
            {
                f_that.m_lastKeyPress = new Date();
                f_that.m_keyPressTimerID = setTimeout(function() { f_that.ViewerControlEvent(); }, 0);
            }
         
            if (e.keyCode === f_that.m_arrowUpKey || e.keyCode === f_that.m_arrowDownKey)
            {
                stop_event(e);
            }
            
        } );

        //When letting go of a key
        addEvent(f_body, "keyup", function(e)
        {           
            
            if (e.keyCode === f_that.m_strafeLeftKey && f_that.m_strafeLeftPressed)
            {
                f_that.m_strafeLeftPressed = false;
                f_that.m_keysPressed--;
            }

            if (e.keyCode === f_that.m_strafeRightKey && f_that.m_strafeRightPressed)
            {
                f_that.m_strafeRightPressed = false;
                f_that.m_keysPressed--;
            }

            if (e.keyCode === f_that.m_forwardKey && f_that.m_forwardPressed)
            {                
                f_that.m_forwardPressed = false;
                f_that.m_keysPressed--;
            }

            if (e.keyCode === f_that.m_backwardsKey && f_that.m_backwardsPressed)
            {
                f_that.m_backwardsPressed = false;
                f_that.m_keysPressed--;                
            }

            if (e.keyCode === f_that.m_turnUpwardsKey && f_that.m_turnUpwardsPressed )
            {                    
                f_that.m_turnUpwardsPressed = false;
                f_that.m_keysPressed--;                              
            }

            if (e.keyCode === f_that.m_turnDownwardsKey && f_that.m_turnDownwardsPressed )
            {                    
                f_that.m_turnDownwardsPressed = false;
                f_that.m_keysPressed--;                
            }

            if (e.keyCode === f_that.m_turnLeftKey && f_that.m_turnLeftPressed)
            {
                f_that.m_turnLeftPressed = false;
                f_that.m_keysPressed--;                    
            }
            
            if (e.keyCode === f_that.m_turnRightKey && f_that.m_turnRightPressed )
            {                    
                f_that.m_turnRightPressed = false;
                f_that.m_keysPressed--;                
            }
                                                
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
                                  
        } ); 

        addEvent(window, "mouseout", function(e)
        {
            
            if (f_that.m_mousePressed)
            {
                f_that.m_mousePressed = false;
                f_that.m_keysPressed--;
                f_that.m_totalmouseX = 0;
                f_that.m_totalmouseY = 0;
                f_that.m_wholepageDiv.setAttribute("class",""); 
            }
        } );
        
        addEvent(f_body, "mousedown", function(e) 
        {    
            //Removed mouse cause it's too buggy a.t.m.!              
            /*if (!f_that.m_mousePressed)
            {                
                f_that.m_mousePressed = true;
                f_that.m_keysPressed++;

                f_that.m_totalmouseX = 0;
                f_that.m_totalmouseY = 0;
                
                f_that.m_oldmouseX = e.pageX;
                f_that.m_oldmouseY = e.pageY;

                f_that.m_wholepageDiv.setAttribute("class","noselect");
                

                if (f_that.m_keyPressTimerID === null)
                {   
                    f_that.m_lastKeyPress = new Date();                 
                    f_that.m_keyPressTimerID = setTimeout(function() { f_that.ViewerControlEvent(); }, 0);
                }
            } */           
            
        } );  
        
        addEvent(f_body, "mouseup", function(e) 
        {
            if (f_that.m_mousePressed)
            {
                f_that.m_mousePressed = false;
                f_that.m_keysPressed--;
                f_that.m_totalmouseX = 0;
                f_that.m_totalmouseY = 0;
                f_that.m_wholepageDiv.setAttribute("class",""); 
            }           
            
        } );                                
    }    
} );

Yoyo.ViewerControls.prototype.ViewerControlEvent = function()
{
    var f_that = this;  
    
    var f_noRender = false; 
    var f_setCameraDirection = false;
    
    if (this.m_keysPressed > 0 )
    {          
        var f_elapsedTime = new Date() - this.m_lastKeyPress;
        f_elapsedTime *= 0.001;        

        if (this.m_strafeLeftPressed)
        {
            this.m_scene.m_camera.MoveLeft(f_elapsedTime);
        }

        if (this.m_strafeRightPressed)
        {
            this.m_scene.m_camera.MoveRight(f_elapsedTime);
        }

        if (this.m_forwardPressed)
        {
            this.m_scene.m_camera.MoveForward(f_elapsedTime);
            //f_setCameraDirection = true;            
        }

        if (f_that.m_backwardsPressed)
        {
            this.m_scene.m_camera.MoveBackwards(f_elapsedTime);
            //f_setCameraDirection = true;           
        }

        if (this.m_turnUpwardsPressed)
        {
            this.m_scene.m_camera.TurnUpwards(f_elapsedTime);           
            f_setCameraDirection = true;
        }

        if (this.m_turnDownwardsPressed)
        {
            this.m_scene.m_camera.TurnDownwards(f_elapsedTime);            
            f_setCameraDirection = true;
        }

        if (this.m_turnLeftPressed)
        {
            this.m_scene.m_camera.TurnLeft(f_elapsedTime);           
            f_setCameraDirection = true;
        }

        if (this.m_turnRightPressed)
        {
            this.m_scene.m_camera.TurnRight(f_elapsedTime);            
            f_setCameraDirection = true;
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
                    this.m_scene.m_camera.RotateVertical(-this.m_totalmouseY);     
                                   
                }                

                if (this.m_totalmouseX !== 0)
                {                    
                    this.m_scene.m_camera.RotateHorizontal(this.m_totalmouseX);
                    //this.m_scene.m_camera.SetCameraDirection(); 
                }
                
                f_setCameraDirection = true;
                                                          
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
        
        //This was a bad idea, it caused camera to roll
        if (f_setCameraDirection)
        {
            this.m_scene.m_camera.SetCameraDirection(); 
        }    

        if (!f_noRender)
        {
            this.m_scene.m_camera.SetViewMatrix();
            this.m_scene.Render();
        }

        this.m_lastKeyPress = new Date();
        this.m_keyPressTimerID = setTimeout(function(){ f_that.ViewerControlEvent(); }, 16);
    }
    else
    {
        this.m_keyPressTimerID = null;
    }
}   

//INcase of different browsers or something, might need different keys!
Yoyo.ViewerControls.prototype.SetControlKeys = function()
{    
    this.m_strafeLeftKey = 65;
    this.m_strafeRightKey = 68;    
    this.m_forwardKey = 87;
    this.m_backwardsKey = 83;
    this.m_turnUpwards = 38;
    this.m_turnDownwards = 40;
    this.m_turnLeftKey = 37;
    this.m_turnRightKey = 39; 

    this.m_arrowUpKey = 38;
    this.m_arrowDownKey = 40;
}
/*
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
*/