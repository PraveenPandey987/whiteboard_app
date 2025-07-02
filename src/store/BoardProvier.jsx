import { useCallback, useReducer } from 'react'
import BoardContext from './board-context'
import rough from 'roughjs'
import { BOARD_ACTIONS, TOOL_ACTION_TYPES, TOOL_ITEMS } from '../constants'
import { createElement } from '../utils/element'
import { getSvgPathFromStroke } from '../utils/element'
import { getStroke } from 'perfect-freehand';
import { isPointNearElement } from '../utils/element'
const gen = rough.generator();
const BoardProvier = ({ children }) => {

  const [boardState, dispactBoardActions] = useReducer((state, action) => {

    switch (action.type) {
      case BOARD_ACTIONS.CHANGE_TOOL:
        return {
          ...state,
          activeToolItem: action.payload,
        };
      case BOARD_ACTIONS.CHANGE_ACTION_TYPE:

        return {
          ...state,
          toolActionType: action.payload.actionType,
        } 
      case BOARD_ACTIONS.DRAW_DOWN: {

        const { clientX, clientY, stroke, fill, size } = action.payload;

        let newElement = createElement(
          state.elements.length,
          clientX,
          clientY,
          clientX,
          clientY,
          {
            type: state.activeToolItem,
            stroke,
            fill,
            size,
          }
        );

        return {
          ...state,
          elements: [...state.elements, newElement],
          toolActionType: state.activeToolItem === TOOL_ITEMS.TEXT ? TOOL_ACTION_TYPES.WRITING : TOOL_ACTION_TYPES.DRAWING,
        }
      }

      case BOARD_ACTIONS.DRAW_MOVE: {
        const newElement = [...state.elements];
        const index = state.elements.length - 1;
        const { type } = newElement[index];
        const { clientX, clientY } = action.payload;
        switch (type) {
          case TOOL_ITEMS.LINE:
          case TOOL_ITEMS.RECTANGLE:
          case TOOL_ITEMS.CIRCLE:
          case TOOL_ITEMS.ARROW:


            let prev_x = newElement[index].x1;
            let prev_y = newElement[index].y1;



            newElement[index] = createElement(
              index,
              prev_x,
              prev_y,
              clientX,
              clientY,
              {
                type: state.activeToolItem,
                stroke: newElement[index].stroke,
                fill: newElement[index].fill,
                size: newElement[index].size,

              }
            );

            return {
              ...state, elements: newElement,

            }

          


          case TOOL_ITEMS.BRUSH:
            newElement[index].points = [...newElement[index].points, { x: clientX, y: clientY }];
            newElement[index].path = new Path2D(getSvgPathFromStroke(getStroke(newElement[index].points)));
            return {
              ...state,
              elements: newElement
            }


          default:
            break;
        }





      }


      case BOARD_ACTIONS.ERASE: {
        const { clientX, clientY } = action.payload;
        let newElements = [...state.elements];
        let old_size = newElements.length;
        newElements = newElements.filter((element) => {
          return !isPointNearElement(element, clientX, clientY);
        });
         let newone =newElements.length;


            const newHistory =state.history.slice(0,state.index+1);
            let delta =0;
            if(newone !== old_size){
            newHistory.push(newElements);
            delta=1;
            }
        return {
          ...state,
          elements: newElements,
          history:newHistory,
          index: state.index+delta,
        }

      }

      case BOARD_ACTIONS.CHANGE_TEXT: {
        const index = state.elements.length - 1;
        const newElements = [...state.elements];
        newElements[index].text = action.payload.text;
        const newHistory =state.history.slice(0,state.index+1);
            newHistory.push(newElements);
        return {
          ...state,
          toolActionType: TOOL_ACTION_TYPES.NONE,
          elements: newElements,
          history:newHistory,
          index: state.index+1,

        }
      }

      case BOARD_ACTIONS.DRAW_UP:{

          const elementCopy = [...state.elements];
            const newHistory =state.history.slice(0,state.index+1);
            newHistory.push(elementCopy);
          return {
            ...state,
            history:newHistory,
            index: state.index+1, 
          }
      }
      case BOARD_ACTIONS.UNDO:{
        
           if(state.index<=0) return state;
        return {
          ...state,
          elements: state.history[state.index-1],
          index:state.index-1,
        };
      }
      case BOARD_ACTIONS.REDO:{
        if(state.index>= state.history.length-1) return state;
        return {
          ...state,
          elements: state.history[state.index+1],
          index:state.index+1,
        };
      }

      
      default:
        return state;
    }
  }
    , {
      activeToolItem: TOOL_ITEMS.BRUSH,
      elements: [],
      history:[[]],
      index:0,
      toolActionType: TOOL_ACTION_TYPES.NONE,


    });

  const changeToolHandler = (tool) => {
    dispactBoardActions({
      type: BOARD_ACTIONS.CHANGE_TOOL,
      payload: tool,
    })

  }
  const boardMouseDownHandler = (event, toolboxState) => {
       
    if (boardState.toolActionType === TOOL_ACTION_TYPES.WRITING) {
      return;
    }


    const { clientX, clientY } = event;

    if (boardState.activeToolItem === TOOL_ITEMS.ERASER) {



      dispactBoardActions({
        type: BOARD_ACTIONS.CHANGE_ACTION_TYPE,
        payload: {
          actionType: TOOL_ACTION_TYPES.ERASING,
        }
      }
      )
      return;
    }
    dispactBoardActions({
      type: BOARD_ACTIONS.DRAW_DOWN,
      payload: {
        clientX,
        clientY,
        stroke: toolboxState[boardState.activeToolItem]?.stroke,
        fill: toolboxState[boardState.activeToolItem]?.fill,
        size: toolboxState[boardState.activeToolItem]?.size,

      },
    })

  }
  const boardMouseMoveHandler = (event) => {


    if (boardState.toolActionType === TOOL_ACTION_TYPES.WRITING) {
      return;
    }

    const { clientX, clientY } = event;

    if (boardState.toolActionType === TOOL_ACTION_TYPES.DRAWING) {


      dispactBoardActions({
        type: BOARD_ACTIONS.DRAW_MOVE,
        payload: {
          clientX,
          clientY,
        },
      })
    }


    else if (boardState.toolActionType === TOOL_ACTION_TYPES.ERASING) {

      dispactBoardActions({
        type: BOARD_ACTIONS.ERASE,
        payload: {
          clientX,
          clientY,
        },
      })


    }
  }
  const boardMouseUpHandler = (event) => {

   
    if (boardState.toolActionType === TOOL_ACTION_TYPES.WRITING) return;
    if (boardState.toolActionType === TOOL_ACTION_TYPES.DRAWING){

      dispactBoardActions({
        type: BOARD_ACTIONS.DRAW_UP,
      })
    } 

    dispactBoardActions({
      type: BOARD_ACTIONS.CHANGE_ACTION_TYPE,
      payload: {
        actionType: TOOL_ACTION_TYPES.NONE,
      }
    })

  }

  const textAreaBlurHandler = (text) => {

    dispactBoardActions({
      type: BOARD_ACTIONS.CHANGE_TEXT,
      payload: {
        text,
      }
    })
  }

  const boardUndoHandler = useCallback(()=>{
    dispactBoardActions({
      type: BOARD_ACTIONS.UNDO,
    })

  },[]);
    const boardRedoHandler = useCallback(()=>{
     dispactBoardActions({
      type: BOARD_ACTIONS.REDO,
    })
  },[]);
  
  const boardContextValue = {
    activeToolItem: boardState.activeToolItem,
    elements: boardState.elements,
    changeToolHandler,
    boardMouseDownHandler,
    boardMouseMoveHandler,
    toolActionType: boardState.toolActionType,
    boardMouseUpHandler,
    textAreaBlurHandler,
    undo: boardUndoHandler,
    redo: boardRedoHandler,
   
  }

  return (
    <BoardContext.Provider value={boardContextValue} >{children}</BoardContext.Provider>
  )
}

export default BoardProvier;