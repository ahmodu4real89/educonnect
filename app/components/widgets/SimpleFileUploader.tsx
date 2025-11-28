"use client"
import React, { useCallback, useRef, useState } from 'react';

type Props = {
  name?: string;
  multiple?: boolean;
  accept?: string;
  onChange?: (file: File | null) => void;
  maxFileSizeBytes?: number;
};

export default function SimpleFileUploader({ name = 'file', multiple = false, accept, onChange, maxFileSizeBytes = 3 * 1024 * 1024 }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [hover, setHover] = useState(false);
  const [selected, setSelected] = useState<File | null>(null);

  const openFilePicker = () => inputRef.current?.click();

  const handleFiles = useCallback((files: FileList | null) => {
    const file = files?.[0] ?? null;
    const maxBytes = typeof maxFileSizeBytes === 'number' ? maxFileSizeBytes : 3 * 1024 * 1024;
    if (file && file.size > maxBytes) {
      // reject large files
      setSelected(null);
      onChange?.(null);
      // show inline error (could also bubble via onChange or toast)
      alert(`File too large. Maximum allowed size is ${Math.round(maxBytes / 1024 / 1024)} MB.`);
      return;
    }

    setSelected(file);
    onChange?.(file);
  }, [onChange, maxFileSizeBytes]);

  return (
    <div>
      <div
        onClick={openFilePicker}
        onDragOver={(e) => { e.preventDefault(); setHover(true); }}
        onDragLeave={() => setHover(false)}
        onDrop={(e) => { e.preventDefault(); setHover(false); handleFiles(e.dataTransfer.files); }}
        role="button"
        tabIndex={0}
        className={`w-full p-6 rounded-lg border-2 border-dashed cursor-pointer text-center ${hover ? 'border-blue-400 bg-blue-50' : 'border-gray-300 bg-white'}`}
      >
        {selected ? (
          <div>
            <strong>{selected.name}</strong>
            <div className="text-sm text-gray-500">Click to change</div>
          </div>
        ) : (
          <div>
            <div className="text-lg font-semibold">Click or drag file to this area to upload</div>
            <div className="text-sm text-gray-500">Supported: ZIP, PDF, TXT (MAX 3MB)</div>
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        name={name}
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}
