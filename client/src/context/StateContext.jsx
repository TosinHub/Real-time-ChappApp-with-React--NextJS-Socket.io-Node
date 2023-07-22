/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/prop-types */
import { createContext, useContext, useReducer } from "react";


export const StateContext = createContext()

export const StateProvider = ({ initialState, reducer, children }) => {
    return(
           <StateContext.Provider value={useReducer(reducer, initialState)}>
        {children}
    </StateContext.Provider>
    )

}

export const useStateProvider = () => useContext(StateContext)

