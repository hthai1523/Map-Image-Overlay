import { Button } from "@mui/material";
import { useState, useEffect } from "react";

const initialCenter = {
  lat: 21.136663,
  lng: 105.7473446,
};

const Form = ({ onSubmit, image, imageSize, currentSize }) => {
  const [centerInput, setCenterInput] = useState(initialCenter);
  const [cornerInputs, setCornerInputs] = useState({
    ne: { lat: "", lng: "" },
    nw: { lat: "", lng: "" },
    se: { lat: "", lng: "" },
    sw: { lat: "", lng: "" },
  });
  const [sizeInputs, setSizeInputs] = useState({ width: "", height: "" });

  useEffect(() => {
    if (imageSize) {
      setSizeInputs(imageSize);
    }
  }, [imageSize]);

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
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const corners = {
      ne: { lat: cornerInputs.ne.lat, lng: cornerInputs.ne.lng },
      nw: { lat: cornerInputs.nw.lat, lng: cornerInputs.nw.lng },
      se: { lat: cornerInputs.se.lat, lng: cornerInputs.se.lng },
      sw: { lat: cornerInputs.sw.lat, lng: cornerInputs.sw.lng },
    };
    const size = {
      width: sizeInputs.width,
      height: sizeInputs.height,
    };
    onSubmit(centerInput, corners, size);
  };

  return (
    <form className="size-fit absolute z-[99999] bottom-0 left-0 bg-white p-5 rounded-md" onSubmit={handleFormSubmit}>
      <div>
        <label>Vị trí trung tâm:</label>
        <input
          type="number"
          step="any"
          name="center_lat"
          value={centerInput.lat}
          onChange={handleInputChange}
        />
        <input
          type="number"
          step="any"
          name="center_lng"
          value={centerInput.lng}
          onChange={handleInputChange}
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
        <label>Kích thước ảnh (width x height):</label>
        <input
          type="number"
          name="size_width"
          value={sizeInputs.width}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="size_height"
          value={sizeInputs.height}
          onChange={handleInputChange}
        />
      </div>
      <Button variant="contained" type="submit">Cập nhật</Button>
    </form>
  );
};

export default Form;
