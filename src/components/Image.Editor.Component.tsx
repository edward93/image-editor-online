import { ChangeEvent, SyntheticEvent, useRef, useState } from "react";

import { PhotoCamera } from "@mui/icons-material";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import { Button, CircularProgress, IconButton } from "@mui/material";

import { Buffer } from "buffer";

import { HexColorPicker } from "react-colorful";

import { post } from "../services/httpClient";

import "../styles/imageEditor.scss";
import useClickOutside from "../services/hooks/useClickOutside";

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
  const [imgParams, setImgParams] = useState<{
    paperWidth?: string;
    paperHeight?: string;
    color?: string;
  }>({ paperHeight: "4", paperWidth: "6", color: "#ffffff" });

  const [isOpen, toggle] = useState<boolean>(false);

  const popover = useRef<HTMLDivElement>(null);

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
    // enable the spinner
    setProcessing(true);

    // revoke object url of already existing file if there is any
    if (finalFile) URL.revokeObjectURL(finalFile.preview);

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

    // disable the spinner
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

      setFinalFile(file);
    }
  };
  //#endregion

  //#region image params
  /**
   * Called when paper width input is changed
   *
   * @param event - Input event
   */
  const onPaperWidthChange = (event: any) => {
    const value = event.target.value;

    const param = { ...imgParams, paperWidth: value };
    setImgParams(param);
  };

  /**
   * Called when paper Height input is changed
   *
   * @param event - Input event
   */
  const onPaperHeightChange = (event: any) => {
    const value = event.target.value;

    const param = { ...imgParams, paperHeight: value };
    setImgParams(param);
  };

  /**
   * Called when color input is changed
   * This has to be a valid hex color string (not quotes are needed)
   *
   * @param event - Input event
   */
  const onColorInputChange = (event: any) => {
    const color = event.target.value;
    updateColor(color);
  };

  /**
   * Updates the color value
   *
   * @param color - Hex color string
   */
  const updateColor = (color: string) => {
    const param = { ...imgParams, color };
    setImgParams(param);
  };
  /**
   * Opens the color picker popover
   *
   * @param event - Click event
   */
  const onColorInputClick = (event: any) => {
    toggle(true);
  };

  /**
   * Closes the color picker popover
   */
  const closePopover = () => {
    toggle(false);
  };

  //#endregion

  useClickOutside(popover, closePopover);

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
                  <label>Resolution (h x w)</label>
                  <div>
                    {selectedFile.height} x {selectedFile.width}
                  </div>
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

        <div className="ieo-image-editor-final-image-content">
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
            <div className="ieo-image-editor-final-param">
              <label>Paper Width (in/cm)</label>
              <input
                placeholder="Paper Width"
                value={imgParams?.paperWidth}
                onChange={onPaperWidthChange}
              />
            </div>
            <div className="ieo-image-editor-final-param">
              <label>Paper Height (in/cm)</label>
              <input
                placeholder="Paper Height"
                value={imgParams?.paperHeight}
                onChange={onPaperHeightChange}
              />
            </div>
            <div
              className="ieo-image-editor-final-param ieo-image-final-param-color-picker"
              ref={popover}
            >
              <label>Color (hex value)</label>
              {isOpen && (
                <div className="ieo-image-editor-color-picker-popover">
                  <HexColorPicker
                    color={imgParams.color}
                    onChange={updateColor}
                  />
                </div>
              )}
              <input
                placeholder="Color"
                value={imgParams?.color}
                onClick={onColorInputClick}
                onChange={onColorInputChange}
              />
            </div>
          </div>
          {processing ? (
            <div className="ieo-image-editor-final-spinner">
              <CircularProgress color="inherit" />
            </div>
          ) : (
            finalFile && (
              <>
                <div className="ieo-image-editor-final-details">
                  {`Resolution (h x w) ${finalFile.height} x ${finalFile.width}`}
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
