import { useState, useEffect } from "react";
import {
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
} from "@mui/material";
import { useLocation } from "../../context/locationContext";
import axios from "axios";
import { useDebounce } from "use-debounce";
import Loader from "../Loader";
import marker from "../../assets/marker.jpg";

const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org/search?";
const params = {
  format: "json",
  addressdetails: 1,
  polygon_geojson: 1,
};

const SearchBox = () => {
  const [inputSearch, setInputSearch] = useState("");
  const [debouncedInputSearch] = useDebounce(inputSearch, 500);
  const [listPlace, setListPlace] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { setSelectLocation, setCoordinates } = useLocation();

  useEffect(() => {
    const handleGetData = async () => {
      if (debouncedInputSearch) {
        try {
          setIsLoading(true);
          const { data } = await axios.get(
            `${NOMINATIM_BASE_URL}${new URLSearchParams({
              ...params,
              q: debouncedInputSearch,
            }).toString()}`
          );

          const filteredData = data.filter(
            (item) => item.geojson?.type === "Polygon"
          );

          setListPlace(filteredData);

          setIsLoading(false);
        } catch (error) {
          console.error("Error fetching data:", error);
          setIsLoading(false);
        }
      } else {
        setListPlace([]);
      }
    };

    handleGetData();
  }, [debouncedInputSearch]);

  const handleItemClick = (item) => {
    setSelectLocation({
      lat: parseFloat(item.lat),
      lon: parseFloat(item.lon),
    });
    if (item?.geojson?.coordinates) {
      setCoordinates(item?.geojson?.coordinates);
    }
  };

  return (
    <div className="absolute top-20 left-0 z-[9999999] flex gap-3 border-separate">
      <div className="size-fit flex items-center gap-4">
        <TextField
          id="outlined-password-input"
          label="Search"
          className="flex-1"
          variant="filled"
          sx={{ backgroundColor: "#fff", width: 300 }}
          value={inputSearch}
          onChange={(e) => setInputSearch(e.target.value)}
        />
      </div>
      <List className="bg-white w-full" sx={{ padding: 0 }}>
        {isLoading ? (
          <div className="w-full flex items-center justify-center">
            <Loader />
          </div>
        ) : (
          listPlace.map((item) => (
            <ListItem
              key={item.osm_id}
              button
              onClick={() => {
                handleItemClick(item);
              }}
            >
              <ListItemIcon className="size-10 z-[99999999]">
                <img src={marker} alt="marker" />
              </ListItemIcon>
              <ListItemText primary={item.display_name} />
            </ListItem>
          ))
        )}
      </List>
    </div>
  );
};

export default SearchBox;
