import React, { useEffect, useRef } from "react";

function ContextMenu({options, cordinates, contextMenu, setContextMenu}) {
  const contextMenuRef = useRef(null)
  useEffect(()=>{
    const handleOutSideClick = (e) =>{
      if(e.target.id  !== "context-opener"){
        if(contextMenuRef.current && !contextMenuRef.current.contains(e.target)){
          setContextMenu(false)
        }
      }
    }

    document.addEventListener("click", handleOutSideClick)
    return ()=>{
      document.removeEventListener("click", handleOutSideClick)
    }
  },[])

  
  const handleClick= (e, callback) => {
    e.stopPropagation
    setContextMenu(false)
    callback()

  }


  return <div className={`bg-dropdown-background fixed py-2 z-[100]  shadow-x1`} ref={contextMenuRef} style={{
    top: cordinates.y,
    left: cordinates.x
  }}>
    <ul>
      {
        options.map(({name,callback}) => (
          <li key={name} onClick={(e)=> handleClick(e,callback)} className="px-5 py-2 cursor-pointer hover:bg-black">
            <span className="text-white">{name}</span>
          </li>
        ) )
      }
    </ul>
    </div>;
}

export default ContextMenu;
