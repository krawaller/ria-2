///<reference path="References.js" />
if (window.Yoyo === undefined)
{
    window.Yoyo = {};   
}

Yoyo.ModelListView = Backbone.View.extend(
{
    m_collection:null,
    m_modellistDiv:document.getElementById("modellist"),
    m_scene:null,
    m_currentlySelected:null,
    m_firstElement:false,
        
} );


Yoyo.ModelListView.prototype.Initilize = function(a_scene)
{
    this.m_scene = a_scene;
    this.m_collection = new Yoyo.ModelListHandler();

    this.m_collection.Initilize(this);
    //document.getElementsByTagName
    //var f_aTags = this.m_modellistDiv.getElementsByTagName("a");

    //console.log(f_aTags);
    //f_aTags[0].click();
}

//TODO in future: Remove ModelListHandler and just make it a read function to initiate the ModelList..

Yoyo.ModelListView.prototype.RenderItem = function(a_modellistItem)
{
    var f_that = this;

    var f_aTag = document.createElement("a");
    f_aTag.setAttribute("href", "#");
    addEvent(f_aTag, "click", function(e)
    {
        if (this !== f_that.m_currentlySelected )
        {   
            if (f_that.m_currentlySelected !== null)
            {         
                f_that.m_currentlySelected.childNodes[0].setAttribute("class","");
            }

            f_that.m_currentlySelected = this;
            var f_modelItem = a_modellistItem;
            var f_this = f_that;

            this.childNodes[0].setAttribute("class", "selected");

            f_this.m_scene.AddModel(f_modelItem);
        }

        stop_event(e);
    } );
    
    var f_image = new Image();
    f_image.src = a_modellistItem.m_thumbnailpath;
    
    f_aTag.appendChild(f_image);
    this.m_modellistDiv.appendChild(f_aTag);

    if (!this.m_firstElement)
    {
        f_aTag.click();
        this.m_firstElement = true;
    }
}