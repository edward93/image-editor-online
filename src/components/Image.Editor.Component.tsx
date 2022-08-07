import { PhotoCamera } from "@mui/icons-material";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import { Button, CircularProgress, IconButton } from "@mui/material";

import { ChangeEvent, SyntheticEvent, useState } from "react";
import { post } from "../services/httpClient";
import { Buffer } from "buffer";

import "../styles/imageEditor.scss";

type FileInfo = {
  name: string;
  size?: number;
  lastModified?: number;
  preview: string;
  file: File | Blob;
  width?: number;
  height?: number;
};

const ImageEditorComponent = () => {
  const [selectedFile, setSelectedFile] = useState<FileInfo | null>(null);
  const [finalFile, setFinalFile] = useState<FileInfo | null>(null);
  const [processing, setProcessing] = useState<boolean>(false);
  const [imgParams, setImgParams] = useState<
    | {
        paperWidth?: string;
        paperHeight?: string;
        color?: string;
      }
    | undefined
  >(undefined);

  //#region original image
  /**
   * Handle image upload
   *
   * @param event - Change event
   */
  const onFileUploaded = (event: ChangeEvent<HTMLInputElement>) => {
    const newFile = event?.target?.files?.[0];

    if (newFile) {
      const file = {
        name: newFile.name,
        size: newFile.size,
        type: newFile.type,
        file: newFile,
        lastModified: newFile.lastModified,
        preview: URL.createObjectURL(newFile),
      };

      setSelectedFile(file);
      // remove the final photo
      setFinalFile(null);
    }
  };

  /**
   * Add image details and revoke object url
   *
   * @param event - Synthetic event
   */
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
  //#endregion

  //#region final image
  /**
   * Send an api request to the server to process (add frame) the uploaded image
   *
   * @param event - Click event
   */
  const onProcessClick = async (event: any) => {
    setProcessing(true);

    const formData = new FormData();
    if (selectedFile) formData.append("file", selectedFile?.file);
    else throw Error("No file was uploaded");

    // add frame
    const result = await post("api/frame", imgParams, undefined, formData);

    // update the state
    const blob = new Blob([Buffer.from(result.data[0], "base64")], {
      type: "image/png",
    });

    // create FileInfo object
    const file = {
      name: selectedFile.name,
      file: blob,
      preview: URL.createObjectURL(blob),
    };

    setFinalFile(file);
    setProcessing(false);
  };

  /**
   * Add final image details and revoke object url
   *
   * @param event - Synthetic event
   */
  const finalImageLoaded = (event: SyntheticEvent<HTMLImageElement>) => {
    const img = event.currentTarget;
    if (finalFile) {
      // add image details
      const file = {
        ...finalFile,
        width: img.naturalWidth,
        height: img.naturalHeight,
      };

      // Revoke data uri after image is loaded
      // URL.revokeObjectURL(finalFile.preview);

      setFinalFile(file);
    }
  };
  //#endregion

  //#region image params
  const onPaperWidthChange = (event: any) => {
    const value = event.target.value;

    const param = { ...imgParams, paperWidth: value };
    setImgParams(param);
  };

  const onPaperHeightChange = (event: any) => {
    const value = event.target.value;

    const param = { ...imgParams, paperHeight: value };
    setImgParams(param);
  };

  const onColorChange = (event: any) => {
    const value = event.target.value;

    const param = { ...imgParams, color: value };
    setImgParams(param);
  };
  //#endregion
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
                <div className="ieo-image-editor-img-properties">
                  <label>Resolution</label>
                  <div>
                    {selectedFile.height} x {selectedFile.width}
                  </div>
                </div>
                <div className="ieo-image-editor-img-properties">
                  <label>Name</label>
                  <div>{selectedFile.name}</div>
                </div>
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
          <div className="ieo-image-editor-final-actions">
            <Button
              variant="outlined"
              component="label"
              size="large"
              color="inherit"
              disabled={processing}
              onClick={onProcessClick}
            >
              Process
            </Button>
            <IconButton
              aria-label="upload picture"
              component="label"
              size="large"
              color="inherit"
              disabled={processing}
              onClick={onProcessClick}
            >
              <PlayCircleOutlineIcon />
            </IconButton>
          </div>
          <div className="ieo-image-editor-final-params">
            <input
              placeholder="Paper Width"
              value={imgParams?.paperWidth}
              onChange={onPaperWidthChange}
            />
            <input
              placeholder="Paper Height"
              value={imgParams?.paperHeight}
              onChange={onPaperHeightChange}
            />
            <input
              placeholder="Color"
              value={imgParams?.color}
              onChange={onColorChange}
            />
          </div>
          {processing ? (
            <div className="ieo-image-editor-final-spinner">
              <CircularProgress color="inherit" />
            </div>
          ) : (
            finalFile && (
              <>
                <div className="ieo-image-editor-final-details">
                  {`Resolution ${finalFile.height} x ${finalFile.width}`}
                </div>
                <div className="ieo-image-editor-final-preview">
                  <img
                    src={finalFile.preview}
                    alt="Final"
                    className="ieo-image-editor-final-img"
                    onLoad={finalImageLoaded}
                  />
                </div>
              </>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageEditorComponent;
