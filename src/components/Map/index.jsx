import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  ImageOverlay,
  Polygon,
  useMap,
} from "react-leaflet";
import "../../App.css";
import "leaflet/dist/leaflet.css";
import { useLocation } from "../../context/locationContext";
import { useEffect, useState } from "react";
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

const center = [21.130605906609222, 105.8270048137921];
const widthImage = 10532.0;
const heightImage = 7415.0;
let ratio = 1 / 37350;

// Set default marker icon
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
});

L.Marker.prototype.options.icon = DefaultIcon;

const imageBounds = [
  [center[0] - (heightImage / 2) * ratio, center[1] - (widthImage / 2) * ratio],
  [center[0] + (heightImage / 2) * ratio, center[1] + (widthImage / 2) * ratio],
];

// Function component to reset map center view
function ResetCenterView({ selectLocation }) {
  const map = useMap();

  useEffect(() => {
    if (selectLocation) {
      map.setView(
        L.latLng(selectLocation.lat, selectLocation.lon),
        map.getZoom(),
        {
          animate: true,
        }
      );
    }
  }, [selectLocation, map]);
}

export default function Map({ opacity, image }) {
  const { selectLocation, coordinates } = useLocation();
  const [polygon, setPolygon] = useState(null);
  const location = selectLocation
    ? [selectLocation.lat, selectLocation.lon]
    : center;

  useEffect(() => {
    if (coordinates && coordinates.length > 0) {
      // Map coordinates to Leaflet format [lat, lng]
      const leafletCoordinates = coordinates[0].map((coord) => [
        coord[1], // lat
        coord[0], // lng
      ]);
      setPolygon(leafletCoordinates);
    } else {
      setPolygon(null); // Reset polygon if no coordinates
    }
  }, [coordinates]);

  return (
    <div className="w-full h-full">
      <MapContainer
        center={center}
        zoom={12}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Render Marker with Popup */}
        <Marker position={location}>
          <Popup>This is a popup</Popup>
        </Marker>

        {/* Render Polygon if coordinates are available */}
        {polygon && <Polygon positions={polygon} />}

        {/* Render Image Overlay */}
        <ImageOverlay url={image} bounds={imageBounds} opacity={opacity} />

        {/* Component to reset map center view */}
        <ResetCenterView selectLocation={selectLocation} />
      </MapContainer>
    </div>
  );
}
