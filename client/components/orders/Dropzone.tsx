import { useCallback, useRef, useState } from "react";
import { Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface LocalFileItem {
  id: string;
  file: File;
  previewUrl?: string;
}

interface DropzoneProps {
  label: string;
  description?: string;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  files: LocalFileItem[];
  onChange: (files: LocalFileItem[]) => void;
}

export function Dropzone({ label, description, accept, multiple = true, disabled, files, onChange }: DropzoneProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const onFilesSelected = useCallback(
    (list: FileList | null) => {
      if (!list) return;
      const items: LocalFileItem[] = Array.from(list).map((f) => ({
        id: `${f.name}-${f.size}-${f.lastModified}-${Math.random().toString(36).slice(2)}`,
        file: f,
        previewUrl: f.type.startsWith("image/") ? URL.createObjectURL(f) : undefined,
      }));
      const next = multiple ? [...files, ...items] : items.slice(0, 1);
      onChange(next);
    },
    [files, multiple, onChange],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      if (disabled) return;
      onFilesSelected(e.dataTransfer.files);
    },
    [disabled, onFilesSelected],
  );

  const handleRemove = (id: string) => {
    const next = files.filter((f) => f.id !== id);
    onChange(next);
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-[#333132] mb-2">{label}</label>
      {description ? (
        <p className="text-xs text-[#666666] mb-2">{description}</p>
      ) : null}
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled}
        onClick={() => !disabled && inputRef.current?.click()}
        onDragEnter={(e) => {
          e.preventDefault();
          if (!disabled) setIsDragging(true);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setIsDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setIsDragging(false);
        }}
        onDrop={handleDrop}
        className={cn(
          "flex flex-col items-center justify-center gap-2 rounded-xl border border-[#D9D9D9] bg-white p-6 text-center transition outline-none",
          isDragging && "ring-2 ring-[#C69B4B]",
          disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:bg-[#fafafa]",
        )}
      >
        <Upload className="h-6 w-6 text-[#C69B4B]" aria-hidden="true" />
        <p className="text-sm text-[#333132]">
          Drag and drop files here or <span className="text-[#C69B4B] font-medium">browse</span>
        </p>
        <p className="text-xs text-[#666666]">Accepted: {accept ?? "Any"}</p>
        <input
          ref={inputRef}
          type="file"
          className="sr-only"
          multiple={multiple}
          accept={accept}
          disabled={disabled}
          onChange={(e) => onFilesSelected(e.target.files)}
          aria-label={label}
        />
      </div>

      {files.length > 0 ? (
        <ul className="mt-4 space-y-2" aria-live="polite">
          {files.map((item) => (
            <li key={item.id} className="flex items-center justify-between rounded-lg border border-[#D9D9D9] bg-white p-3">
              <div className="flex items-center gap-3 min-w-0">
                {item.previewUrl ? (
                  <img src={item.previewUrl} alt={item.file.name} className="h-10 w-10 rounded object-cover" />
                ) : (
                  <div className="h-10 w-10 rounded bg-[#E8E8E8] flex items-center justify-center text-xs text-[#666666]">FILE</div>
                )}
                <div className="truncate">
                  <p className="text-sm text-[#333132] truncate" title={item.file.name}>{item.file.name}</p>
                  <p className="text-xs text-[#666666]">{Math.round(item.file.size / 1024)} KB</p>
                </div>
              </div>
              {!disabled ? (
                <button
                  type="button"
                  className="ml-2 rounded-md p-2 hover:bg-[#F5F5F5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C69B4B]"
                  aria-label={`Remove ${item.file.name}`}
                  onClick={() => handleRemove(item.id)}
                >
                  <X className="h-4 w-4 text-[#666666]" />
                </button>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
