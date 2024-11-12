import React, {createContext, useContext, useState} from "react";

const VisibilityContext = createContext();

export const useVisibility = () => useContext(VisibilityContext);

export const VisibilityProvider = ({ children }) => {
    const [visibilityState, setVisibilityState] = useState({});
    
    const setComponentVisibility = (componentId, isVisible) => {
        setVisibilityState(prevState => ({
            ...prevState,
            [componentId]: isVisible
        }));
    };

    return (
        <VisibilityContext.Provider value={{visibilityState, setComponentVisibility}}>
            {children}
        </VisibilityContext.Provider>
    )
}