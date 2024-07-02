import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

export default function UploadImage({onDrop}) {
  const handleDrop = useCallback(
    (acceptedFiles) => {
      onDrop(acceptedFiles);
    },
    [onDrop]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept: "image/*"
  });

  return (
    <div
      {...getRootProps()}
      className="bg-white rounded-md text-center p-5 cursor-pointer z-[99999] w-fit absolute top-0 left-0 "
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <p>Drag and drop some files here, or click to select files</p>
      )}
    </div>
  );
}
