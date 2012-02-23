///<reference path="References.js" />

if (window.Yoyo === undefined)
{
    window.Yoyo = {};   
}

Yoyo.Ajax = {};

Yoyo.Ajax.GetXHR = function()
{
    /// <summary>Returns a XML Http Request object</summary>
    var xhr = null;
    try 
    {
        xhr = new XMLHttpRequest();
    } 
    catch (error)
    {
        try 
        {
            xhr = new ActiveXObject("Microsoft.XMLHTTP");
        } 
        catch (error)
        {
            throw new Error("No XHR object available");
        }
    }
    return xhr;
}



Yoyo.Ajax.ReadFile = function(a_url, a_callback,isAsynchronous)
{	
/// <summary>Opens a file based on url. Invokes callback when it's ready. Does it asynchronously or synchronously</summary>
/// <param name="a_url" type="string">The url to file path</param>
/// <param name="a_callback" type="function">Function that is invoked when ready</param>
/// <param name="isAsynchronous" type="bool"> Is asynchronous until false is given. Then it's synchronous </param>

    var READY_STATE_UNINITIALIZED = 0;
	var READY_STATE_OPENED = 1;
	var READY_STATE_SENT = 2;
	var READY_STATE_LOADING = 3;
	var READY_STATE_COMPLETE = 4;

	var xhr = Yoyo.Ajax.GetXHR();

    var m_isAsynchronous = true;

    if (isAsynchronous === false)
    {
        m_isAsynchronous = false;
    }    

	xhr.onreadystatechange = function() 
    {		
		if(xhr.readyState === READY_STATE_COMPLETE)
		{
			if(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)
			{
				a_callback(xhr.responseText);				
			}
			else
			{
				console.log("Läsfel, status:"+xhr.status);	
			}
		}
	}
    
	xhr.open("get", a_url, m_isAsynchronous);

	//xhr.setRequestHeader('If-Modified-Since', 'Mon, 01 Sep 2007 00:00:00 GMT');
	
	xhr.send(null);
}

