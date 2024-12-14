import React from "react";

function Canvas({ canvasRef, maskRef, handleMouseDown, handleMouseMove, handleMouseUp, brushSize, isEraser, markMask }) {
  return (
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
  );
}

export default Canvas;
