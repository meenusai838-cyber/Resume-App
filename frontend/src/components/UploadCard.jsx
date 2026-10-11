import { useRef, useState } from "react";

// Drop zone / file picker for the resume PDF.
export default function UploadCard({ file, onSelect, disabled }) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  const openPicker = () => {
    if (!disabled) inputRef.current?.click();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    if (!disabled) onSelect(e.dataTransfer.files[0]);
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        hidden
        onChange={(e) => onSelect(e.target.files[0])}
      />

      <div
        className={`upload-card glass${dragging ? " dragover" : ""}`}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled}
        onClick={openPicker}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openPicker();
          }
        }}
        onDragEnter={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={(e) => {
          e.preventDefault();
          setDragging(false);
        }}
        onDrop={handleDrop}
      >
        <div className="upload-icon" aria-hidden="true">📄</div>
        {file ? (
          <>
            <p className="upload-title">{file.name}</p>
            <p className="upload-hint">
              Ready to analyze · <span className="link">choose a different file</span>
            </p>
          </>
        ) : (
          <>
            <p className="upload-title">Drop your resume here</p>
            <p className="upload-hint">
              PDF only · <span className="link">browse files</span>
            </p>
          </>
        )}
      </div>
    </>
  );
}
