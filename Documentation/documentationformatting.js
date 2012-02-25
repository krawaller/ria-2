if (window.Documentation === undefined)
{
    window.Documentation = {};
}

Documentation.SetupToC = function()
{
    ///<summary>Gets a table of content div (toc) and writes a lot of links to it based on what's in the content div (content) </summary>
    var m_tocDiv = document.getElementById("toc");
    var m_contentDiv = document.getElementById("content");    

    var f_parentTag = m_tocDiv;    

    var f_found = false;
    var f_left;

    var f_lookNextTag = false;

    var f_elements;

    var f_deleted;

    for (var i = 0; i < m_contentDiv.childNodes.length; i++)
    {
        var f_node = m_contentDiv.childNodes[i];
        
        f_found = false;

        if (f_node.tagName === "H1")
        {
            f_parentTag = m_tocDiv;
            f_found = true;
            f_left = "0px";
            f_lookNextTag = false;
        }
        else if (f_node.tagName === "H2")
        {
            f_found = true;
            f_left = "25px";
            f_lookNextTag = false;
        }
        else if (f_node.tagName === "H3")
        {
            //f_found = true;
            //f_left = "50px";
            f_parentTag = f_node;
            f_lookNextTag = true;
        }
        else if (f_node.tagName !== undefined && f_lookNextTag)
        {
            //console.log("'" + f_node.tagName + "'");
            if (f_node.tagName === "P")
            {   

                if (f_node.innerHTML === "Void")
                {
                    f_deleted = f_parentTag.childNodes.length - 1;
                    f_deleted += f_node.childNodes.length;

                    m_contentDiv.removeChild(f_node);
                    m_contentDiv.removeChild(f_parentTag);                    

                    i -= f_deleted;
                }
                else if (f_node.innerHTML.length < 1 )
                {
                    f_deleted = f_parentTag.childNodes.length - 1;
                    f_deleted += f_node.childNodes.length;

                    m_contentDiv.removeChild(f_node);
                    m_contentDiv.removeChild(f_parentTag);
                    

                    i -= f_deleted;
                }
            }
            else if (f_node.tagName === "UL")
            {
                
                f_elements = f_node.getElementsByTagName("li");
                if (f_elements.length < 1)
                {
                    
                    f_deleted = f_parentTag.childNodes.length - 1;
                    f_deleted += f_node.childNodes.length;

                    m_contentDiv.removeChild(f_node);
                    m_contentDiv.removeChild(f_parentTag);

                    i-= f_deleted
                    
                }
            }
            f_lookNextTag = false;
        }

        if (f_found)
        {
            f_node.id = f_node.innerHTML;
            var f_aTag = document.createElement("a");

            f_aTag.setAttribute("href","#" + f_node.id);
            f_aTag.innerHTML = f_node.id;

            m_tocDiv.appendChild(f_aTag);
            m_tocDiv.appendChild(document.createElement("br") );
            //f_parentTag = f_aTag;
            f_aTag.style.left = f_left;
        }
        

    }
}

window.addEventListener("load", Documentation.SetupToC, false);


