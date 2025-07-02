import { createContext } from "react";


const BoardContext = createContext({
    activeToolItem: "",
    elements: [],
    history:[[]],
    index: 0,
    toolActionType: "",
    changeToolHandler: ()=> {},
    boardMouseDownHandler: ()=>{},
    boardMouseMoveHandler: ()=>{},
    boardMouseUpHandler:()=>{},
    textAreaBlurHandler: ()=>{},
 
    
})
export default BoardContext;