import React, { useState, useRef } from "react";

function App() {
  const [image, setImage] = useState(null);
  const [maskedImage, setMaskedImage] = useState(null);
  const [brushSize, setBrushSize] = useState(10);
  const [isEraser, setIsEraser] = useState(false);
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const originalImageRef = useRef(null);
  const maskRef = useRef(null);
  const isDrawing = useRef(false);



    // Handle image upload and display on canvas
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      const img = new Image();
      img.src = imageURL;
      img.onload = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        setImage(imageURL);
        originalImageRef.current = img;


                // Create mask canvas
 
        const maskCanvas = document.createElement("canvas");
        const maskCtx = maskCanvas.getContext("2d");
        maskCanvas.width = img.width;
        maskCanvas.height = img.height;
        maskCtx.fillStyle = "black";
        maskRef.current = maskCanvas;
      };
    }
  };


    // Handle brush size change
  const handleBrushSizeChange = (e) => {
    setBrushSize(e.target.value);
  };

    // Handle mouse events for drawing on the canvas

  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    isDrawing.current = true;
    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (isEraser) {
      ctx.clearRect(e.nativeEvent.offsetX - brushSize / 2, e.nativeEvent.offsetY - brushSize / 2, brushSize, brushSize);
      markMask(e.nativeEvent.offsetX, e.nativeEvent.offsetY, true);
    } else {
      ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      ctx.lineWidth = brushSize;
      ctx.strokeStyle = "black";
      ctx.lineCap = "round";
      ctx.stroke();
      markMask(e.nativeEvent.offsetX, e.nativeEvent.offsetY, false);
    }
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  const toggleEraser = () => {
    setIsEraser(!isEraser);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setImage(null);
    setMaskedImage(null);
    markClearMask();
  };

  const markMask = (x, y, isErase) => {
    const maskCanvas = maskRef.current;
    const maskCtx = maskCanvas.getContext("2d");
    maskCtx.beginPath();
    if (isErase) {
      maskCtx.clearRect(x - brushSize / 2, y - brushSize / 2, brushSize, brushSize);
    } else {
      maskCtx.arc(x, y, brushSize / 2, 0, 2 * Math.PI);
      maskCtx.fill();
    }
  };

    // Function to clear the mask completely
 
  const markClearMask = () => {
    const maskCanvas = maskRef.current;
    const maskCtx = maskCanvas.getContext("2d");
    maskCtx.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
  };

  const exportMask = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const maskCanvas = maskRef.current;
    const maskCtx = maskCanvas.getContext("2d");

    const tempCanvas = document.createElement("canvas");
    const tempCtx = tempCanvas.getContext("2d");

    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;

    tempCtx.drawImage(originalImageRef.current, 0, 0, canvas.width, canvas.height);

    const maskImageData = maskCtx.getImageData(0, 0, maskCanvas.width, maskCanvas.height);
    const tempImageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);

    const maskPixels = maskImageData.data;
    const tempPixels = tempImageData.data;

    const blurredData = tempCtx.createImageData(tempCanvas.width, tempCanvas.height);

    for (let i = 0; i < maskPixels.length; i += 4) {
      if (maskPixels[i] === 0 && maskPixels[i + 1] === 0 && maskPixels[i + 2] === 0) {
        blurredData.data[i] = tempPixels[i];
        blurredData.data[i + 1] = tempPixels[i + 1];
        blurredData.data[i + 2] = tempPixels[i + 2];
        blurredData.data[i + 3] = 0;
      } else {
        blurredData.data[i] = tempPixels[i];
        blurredData.data[i + 1] = tempPixels[i + 1];
        blurredData.data[i + 2] = tempPixels[i + 2];
        blurredData.data[i + 3] = tempPixels[i + 3];
      }
    }

    tempCtx.putImageData(blurredData, 0, 0);

    tempCtx.filter = 'blur(800px)';
    tempCtx.drawImage(tempCanvas, 0, 0);

    ctx.drawImage(originalImageRef.current, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(tempCanvas, 0, 0);

    const finalImage = canvas.toDataURL("image/png");
    setMaskedImage(finalImage);
  };

  const downloadMaskedImage = () => {
    const link = document.createElement("a");
    link.href = maskedImage;
    link.download = "masked_image.png";
    link.click();
  };

  return (
    <div className="container mx-auto p-6">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-800">Image Inpainting Tool</h1>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="border p-2 rounded-md bg-blue-100 mt-4"
        />
      </div>

      <div className="flex justify-center">
        <canvas
          ref={canvasRef}
          width="600"
          height="400"
          className="border rounded-md"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        />
      </div>

      <div className="mt-6 flex justify-center">
        <button onClick={toggleEraser} className="bg-gray-700 text-white px-4 py-2 rounded-md mr-4">
          {isEraser ? "Use Brush" : "Use Eraser"}
        </button>
        <button onClick={clearCanvas} className="bg-red-500 text-white px-4 py-2 rounded-md">
          Clear
        </button>
      </div>

      <div className="mt-6 flex justify-center">
        <input
          type="range"
          min="5"
          max="30"
          value={brushSize}
          onChange={handleBrushSizeChange}
          className="w-40"
        />
      </div>

      <div className="mt-6 flex justify-center">
        <button onClick={exportMask} className="bg-blue-500 text-white px-4 py-2 rounded-md mr-4">
          Apply Mask
        </button>
        <button onClick={downloadMaskedImage} className="bg-green-500 text-white px-4 py-2 rounded-md">
          Download Image
        </button>
      </div>

      <div className="mt-6 flex justify-center">
        {maskedImage && (
          <>
            <div className="mr-6">
              <h3 className="text-center text-xl font-semibold mb-2">Original Image</h3>
              <img src={image} alt="Original" className="border rounded-md" />
            </div>
            <div>
              <h3 className="text-center text-xl font-semibold mb-2">Masked Image</h3>
              <img src={maskedImage} alt="Masked" className="border rounded-md" />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
