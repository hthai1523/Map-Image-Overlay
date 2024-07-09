import { useEffect, useRef, useState } from "react";
import "./App.css";
import Map from "./components/Map";
import SearchBox from "./components/SearchBox";
import UploadImage from "./components/UploadImage";
import { Button } from "@mui/material";
import L from "leaflet";
import Resizer from "react-image-file-resizer";
import { useLocation } from "./context/locationContext";
import base64StringToBlob from "./function/b64toBlob";
import Loader from "./components/Loader";
const initialCenter = [21.136663, 105.7473446];
let ratio = 1 / 25000;

function App() {
  const [image, setImage] = useState(null);
  const [opacity, setOpacity] = useState(1);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState(initialCenter);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [currentSize, setCurrentSize] = useState({ width: 0, height: 0 });
  const [corners, setCorners] = useState({});
  const [mapZoom, setMapZoom] = useState(14);
  const [isLoading, setIsLoading] = useState(false);

  const { selectLocation, bounds } = useLocation();

  const mapRef = useRef();
  const imgRef = useRef();

  const [centerInput, setCenterInput] = useState(initialCenter);
  const [cornerInputs, setCornerInputs] = useState({
    ne: { lat: "", lng: "" },
    nw: { lat: "", lng: "" },
    se: { lat: "", lng: "" },
    sw: { lat: "", lng: "" },
  });
  const [sizeInputs, setSizeInputs] = useState({ width: "", height: "" });

  useEffect(() => {
    if (selectLocation && selectLocation?.lat && selectLocation?.lon) {
      setPosition([selectLocation.lat, selectLocation.lon]);
    }
  }, [selectLocation]);

  // const getImageSize = (input) => {
  //   return new Promise((resolve, reject) => {
  //     let blob;

  //     if (typeof input === "string") {
  //       // If input is a base64 string, convert it to Blob
  //       blob = base64StringToBlob(input);
  //     } else if (input instanceof Blob) {
  //       // If input is already a Blob, use it directly
  //       blob = input;
  //     } else {
  //       reject(new Error("Invalid input type"));
  //       return;
  //     }

  //     const reader = new FileReader();
  //     reader.onload = function (e) {
  //       const image = new Image();
  //       image.src = e.target.result;
  //       image.onload = function () {
  //         resolve({ width: this.width, height: this.height });
  //       };
  //       image.onerror = reject;
  //     };
  //     reader.onerror = reject;
  //     reader.readAsDataURL(blob);
  //   });
  // };

  // const resizeImage = (file, width, height) => {
  //   return new Promise((resolve, reject) => {
  //     Resizer.imageFileResizer(
  //       file,
  //       width,
  //       height,
  //       "JPEG",
  //       100,
  //       0,
  //       (uri) => {
  //         resolve(uri);
  //       },
  //       "base64",
  //       undefined,
  //       undefined,
  //       (error) => {
  //         reject(error);
  //       }
  //     );
  //   });
  // };

  const handleDrop = async (acceptedFiles) => {
    // console.log(acceptedFiles);
    // const file = acceptedFiles[0];
    // try {
    //   setIsLoading(true);
    //   // Get the original dimensions of the image
    //   const imageDimension = await getImageSize(file);
    //   console.log(
    //     "Original imageDimension: " +
    //       imageDimension?.width +
    //       " " +
    //       imageDimension?.height
    //   );
    //   // Calculate half dimensions
    //   const halfWidth = imageDimension.width / 2;
    //   const halfHeight = imageDimension.height / 2;
    //   console.log("half width: " + halfWidth + " half height: " + halfHeight);
    //   // Resize the image to half its original dimensions
    //   const resizedImage = await resizeImage(file, halfWidth, halfHeight);
    //   console.log("Resized image: ", resizedImage);
    //   const img = new Image();
    //   img.src = resizedImage;
    //   img.onload = () => {
    //     setImage(resizedImage);
    //     setImageSize({
    //       width: img.width,
    //       height: img.height,
    //     });
    //     setCurrentSize({ width: img.width, height: img.height });
    //   };
    //   setIsLoading(false);
    // } catch (error) {
    //   console.log(error);
    //   setIsLoading(false);
    // }
  };

  const handleInputFileChange = async (e) => {
    const file = e.target.files[0];
    console.log("File", file);
    if (!file) return;

    const validImageTypes = ["image/jpeg", "image/png", "image/gif"];

    if (!validImageTypes.includes(file.type)) {
      console.error("Invalid file type. Please select an image file.");
      return;
    }

    try {
      setIsLoading(true);

      const img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(img.src);
        setImage(img);
        setImageSize({
          width: img.width,
          height: img.height,
        });
        setCurrentSize({ width: img.width, height: img.height });
        setIsLoading(false);
      };

      img.onerror = (error) => {
        console.error("Error loading image:", error);
        setIsLoading(false);
      };

      img.src = URL.createObjectURL(file);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    const [section, coord] = name.split("_");

    if (section === "center") {
      setCenterInput({ ...centerInput, [coord]: parseFloat(value) });
    } else if (section === "size") {
      setSizeInputs({ ...sizeInputs, [coord]: parseInt(value, 10) });
    } else {
      setCornerInputs({
        ...cornerInputs,
        [section]: { ...cornerInputs[section], [coord]: parseFloat(value) },
      });
    }

    // Calculate new currentSize based on scale and input changes
    setCurrentSize((prev) => {
      return {
        width: sizeInputs.width || prev.width,
        height: sizeInputs.height || prev.height,
      };
    });
    console.log("current size: " + currentSize.width);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();

    // Use previous values if the current input is empty
    const updatedCenter = {
      lat: centerInput.lat || position[0],
      lng: centerInput.lng || position[1],
    };

    const updatedCorners = {
      ne: {
        lat: cornerInputs.ne.lat || corners.ne.lat,
        lng: cornerInputs.ne.lng || corners.ne.lng,
      },
      nw: {
        lat: cornerInputs.nw.lat || corners.nw.lat,
        lng: cornerInputs.nw.lng || corners.nw.lng,
      },
      se: {
        lat: cornerInputs.se.lat || corners.se.lat,
        lng: cornerInputs.se.lng || corners.se.lng,
      },
      sw: {
        lat: cornerInputs.sw.lat || corners.sw.lat,
        lng: cornerInputs.sw.lng || corners.sw.lng,
      },
    };

    const updatedSize = {
      width: sizeInputs.width || currentSize.width,
      height: sizeInputs.height || currentSize.height,
    };

    setPosition([updatedCenter.lat, updatedCenter.lng]);
    setCorners({
      ne: L.latLng(updatedCorners.ne.lat, updatedCorners.ne.lng),
      nw: L.latLng(updatedCorners.nw.lat, updatedCorners.nw.lng),
      se: L.latLng(updatedCorners.se.lat, updatedCorners.se.lng),
      sw: L.latLng(updatedCorners.sw.lat, updatedCorners.sw.lng),
    });
    setCurrentSize({
      width: updatedSize.width * scale,
      height: updatedSize.height * scale,
    });
  };

  useEffect(() => {
    if (imageSize.width && imageSize.height) {
      const map = mapRef.current.target;
      const mapWidth = map._container.offsetWidth;
      const mapHeight = map._container.offsetHeight;
      const mapAspectRatio = mapWidth / mapHeight;
      const imageAspectRatio = imageSize.width / imageSize.height;

      let newWidth, newHeight;
      if (mapAspectRatio > imageAspectRatio) {
        newWidth = mapWidth;
        newHeight = mapWidth / imageAspectRatio;
      } else {
        newWidth = mapHeight * imageAspectRatio;
        newHeight = mapHeight;
      }

      setCurrentSize({
        width: newWidth * scale,
        height: newHeight * scale,
      });
    }
  }, [scale, imageSize]);

  useEffect(() => {
    if (position && currentSize.width && currentSize.height) {
      const bounds = calculateImageBounds(position, currentSize);
      setCorners(bounds);
    }
  }, [position, currentSize]);

  useEffect(() => {
    if (imageSize.width && imageSize.height) {
      setCurrentSize({
        width: imageSize.width * scale,
        height: imageSize.height * scale,
      });
    }
  }, [scale, imageSize]);

  const calculateImageBounds = (center, size) => {
    const halfWidth = size.width / 2;
    const halfHeight = size.height / 2;

    const ne = L.latLng(
      center[0] + halfHeight * ratio,
      center[1] + halfWidth * ratio
    );
    const nw = L.latLng(
      center[0] + halfHeight * ratio,
      center[1] - halfWidth * ratio
    );
    const se = L.latLng(
      center[0] - halfHeight * ratio,
      center[1] + halfWidth * ratio
    );
    const sw = L.latLng(
      center[0] - halfHeight * ratio,
      center[1] - halfWidth * ratio
    );

    return { ne, nw, se, sw };
  };

  return (
    <div className="relative w-screen h-screen">
      <div className="bg-white rounded-md size-fit p-5 flex flex-col absolute top-3 right-3 z-[999999]">
        <label htmlFor="range">Change Opacity </label>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          onChange={(e) => setOpacity(e.target.value)}
        />
        {/* <label htmlFor="">Change Scale</label> */}
        {/* <input
          type="range"
          min={0}
          max={4}
          step={0.01}
          value={scale}
          onChange={(e) => setScale(e.target.value)}
        /> */}
        <input type="file" onChange={(e) => handleInputFileChange(e)} />
      </div>

      <Map
        opacity={opacity}
        image={image}
        mapRef={mapRef}
        scale={scale}
        position={position}
        setPosition={setPosition}
        currentSize={currentSize}
      />
      {isLoading ? (
        <div className="bg-white rounded-md flex items-center justify-center p-5 cursor-progress z-[99999] w-fit absolute top-0 left-0 ">
          <Loader />
        </div>
      ) : (
        <>
          {/* <UploadImage onDrop={handleDrop} /> */}
          <SearchBox />
        </>
      )}
      <form
        onSubmit={handleFormSubmit}
        className="size-fit absolute z-[99999] bottom-0 left-0 bg-white p-5 rounded-md space-y-2"
      >
        <div className="">
          <label htmlFor="">Vi tri trung tam </label>
          <input
            type="number"
            name="center_lat"
            value={centerInput.lat}
            onChange={handleInputChange}
            step="any"
          />
          <input
            type="number"
            name="center_lng"
            value={centerInput.lng}
            onChange={handleInputChange}
            step="any"
          />
        </div>
        <div>
          <label>Góc đông bắc:</label>
          <input
            type="number"
            step="any"
            name="ne_lat"
            value={cornerInputs.ne.lat}
            onChange={handleInputChange}
          />
          <input
            type="number"
            step="any"
            name="ne_lng"
            value={cornerInputs.ne.lng}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Góc tây bắc:</label>
          <input
            type="number"
            step="any"
            name="nw_lat"
            value={cornerInputs.nw.lat}
            onChange={handleInputChange}
          />
          <input
            type="number"
            step="any"
            name="nw_lng"
            value={cornerInputs.nw.lng}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Góc đông nam:</label>
          <input
            type="number"
            step="any"
            name="se_lat"
            value={cornerInputs.se.lat}
            onChange={handleInputChange}
          />
          <input
            type="number"
            step="any"
            name="se_lng"
            value={cornerInputs.se.lng}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Góc tây nam:</label>
          <input
            type="number"
            step="any"
            name="sw_lat"
            value={cornerInputs.sw.lat}
            onChange={handleInputChange}
          />
          <input
            type="number"
            step="any"
            name="sw_lng"
            value={cornerInputs.sw.lng}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Kích thước ảnh (width x height): </label>
          <input
            type="number"
            name="size_width"
            step="any"
            value={sizeInputs.width}
            onChange={handleInputChange}
          />
          <input
            type="number"
            name="size_height"
            step="any"
            value={sizeInputs.height}
            onChange={handleInputChange}
          />
        </div>
        <Button type="submit" variant="contained">
          Cap nhap
        </Button>
        <p>Khi click vào đâu trên bản đồ thì tâm ảnh nằm ở đó</p>
        <p>
          Kích thước ban đầu: {imageSize.width} x {imageSize.height}
        </p>
        <p>
          Kích thước hiện tại: {parseInt(currentSize.width)} x {parseInt(currentSize.height)}
        </p>
        <p>
          Vị trí trung tâm: {position[0]}, {position[1]}
        </p>
        {corners.ne && (
          <div>
            <p>
              Góc đông bắc: {corners.ne.lat}, {corners.ne.lng}
            </p>
            <p>
              Góc tây bắc: {corners.nw.lat}, {corners.nw.lng}
            </p>
            <p>
              Góc đông nam: {corners.se.lat}, {corners.se.lng}
            </p>
            <p>
              Góc tây nam: {corners.sw.lat}, {corners.sw.lng}
            </p>
          </div>
        )}

        {selectLocation?.boundingbox && (
          <div className="">
            <p className="text-red-400">Bounds image overlay - openstreetmap</p>
            <p>
              North (Bắc): Góc trên bên trái: {selectLocation?.boundingbox[0]}, {selectLocation?.boundingbox[2]}
            </p>
            <p>
              South (Nam): Góc dưới bên phải: {selectLocation?.boundingbox[1]}, {selectLocation?.boundingbox[3]}
            </p>
          </div>
        )}
      </form>
    </div>
  );
}

export default App;
