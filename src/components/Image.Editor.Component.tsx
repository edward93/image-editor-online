import { PhotoCamera } from "@mui/icons-material";
import { Button, IconButton } from "@mui/material";
import { ChangeEvent, SyntheticEvent, useState } from "react";

import "../styles/imageEditor.scss";

type FileInfo = {
  name: string;
  size: number;
  lastModified: number;
  preview: string;
  width?: number;
  height?: number;
};

const ImageEditorComponent = () => {
  const [selectedFile, setSelectedFile] = useState<FileInfo | null>(null);

  const onFileUploaded = (event: ChangeEvent<HTMLInputElement>) => {
    const newFile = event?.target?.files?.[0];

    if (newFile) {
      const file = {
        name: newFile.name,
        size: newFile.size,
        type: newFile.type,
        lastModified: newFile.lastModified,
        preview: URL.createObjectURL(newFile),
      };

      setSelectedFile(file);
    }
  };

  const imageLoaded = (event: SyntheticEvent<HTMLImageElement>) => {
    const img = event.currentTarget;
    if (selectedFile) {
      // add image details
      const file = {
        ...selectedFile,
        width: img.naturalWidth,
        height: img.naturalHeight,
      };

      // Revoke data uri after image is loaded
      URL.revokeObjectURL(selectedFile.preview);

      setSelectedFile(file);
    }
  };

  return (
    <div className="ieo-image-editor-wrapper">
      <div className="ieo-image-editor-images-area-wrapper">
        <div className="ieo-image-editor-original-image-content">
          <div className="ieo-image-editor-title">Original Image</div>
          <div className="ieo-image-editor-original-actions">
            <Button
              variant="outlined"
              component="label"
              size="large"
              color="inherit"
            >
              Upload
              <input
                hidden
                accept="image/*"
                type="file"
                name="file-uploader"
                className="ieo-image-editor-file-upload"
                onChange={onFileUploaded}
              />
            </Button>
            <IconButton
              aria-label="upload picture"
              component="label"
              size="large"
              color="inherit"
            >
              <PhotoCamera />
              <input
                hidden
                accept="image/*"
                type="file"
                name="file-uploader"
                className="ieo-image-editor-file-upload"
                onChange={onFileUploaded}
              />
            </IconButton>
          </div>
          {selectedFile && (
            <>
              <div className="ieo-image-editor-original-details">
                {`Resolution ${selectedFile.height} x ${selectedFile.width} Name: ${selectedFile.name}`}
              </div>
              <div className="ieo-image-editor-original-preview">
                <img
                  src={selectedFile.preview}
                  alt="original"
                  className="ieo-image-editor-original-img"
                  onLoad={imageLoaded}
                />
              </div>
            </>
          )}
        </div>

        <div className="ieo-image-editor-edited-image-content">
          <div className="ieo-image-editor-title">Final Image</div>
        </div>
      </div>
    </div>
  );
};

export default ImageEditorComponent;
