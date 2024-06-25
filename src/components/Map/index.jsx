import { MapContainer, Marker, Popup, TileLayer, ImageOverlay } from "react-leaflet";
import "../../App.css";

const center = [21.148, 105.848];
const mapBounds = [
  [21.1, 105.7],
  [21.25, 105.95],
];

const imageBounds = [
  [21.01 - 0.011, 105.68 - 0.025],
  [21.27 - 0.011, 105.98 - 0.025],
];

export default function Map({ opacity, image }) {


  return (
    <div className="map-container">
      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom={false}
        maxBounds={mapBounds}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={center}>
          <Popup>This is a popup</Popup>
        </Marker>
        <ImageOverlay
          url={image}
          bounds={imageBounds}
          opacity={opacity}
          className="image"
        />
      </MapContainer>
    </div>
  );
}
