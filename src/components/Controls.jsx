import React from "react";

function Controls({
  toggleEraser,
  clearCanvas,
  brushSize,
  handleBrushSizeChange,
  exportMask,
  downloadMaskedImage,
  maskedImage
}) {
  return (
    <div className="mt-6 flex justify-center">
      <button onClick={toggleEraser} className="bg-gray-700 text-white px-4 py-2 rounded-md mr-4">
        {maskedImage ? "Use Brush" : "Use Eraser"}
      </button>
      <button onClick={clearCanvas} className="bg-red-500 text-white px-4 py-2 rounded-md">
        Clear
      </button>

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
    </div>
  );
}

export default Controls;
