import React, { useContext, useState } from "react";

const LocationContext = React.createContext();

export function useLocation() {
  return useContext(LocationContext);
}


export const LocationProvider = ({children}) => {
  const [selectLocation, setSelectLocation] = useState(null);
  const [coordinates, setCoordinates] = useState([]);

  const value = { selectLocation, setSelectLocation, coordinates, setCoordinates };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};
