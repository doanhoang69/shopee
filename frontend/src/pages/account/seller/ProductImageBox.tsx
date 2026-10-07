import { ACCEPTED_AVATAR_TYPES, MAX_AVATAR_SIZE } from "@/constants";
import { cn } from "@/utils";
import { Plus, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface ProductImageBoxProps {
  value: File | null | undefined;
  onChange: (file: File | undefined) => void;
  error?: string;
  className?: string;
}

const ProductImageBox = ({
  value,
  onChange,
  error,
  className,
}: ProductImageBoxProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string>("");

  useEffect(() => {
    if (!value) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(value);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [value]);

  const handleChooseImage = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ACCEPTED_AVATAR_TYPES.includes(file.type)) {
      setLocalError("Chỉ hỗ trợ định dạng .jpeg, .png, .webp");
      e.target.value = "";
      return;
    }

    if (file.size > MAX_AVATAR_SIZE) {
      setLocalError("Dung lượng file tối đa 1 MB");
      e.target.value = "";
      return;
    }

    setLocalError("");
    onChange(file);
    e.target.value = "";
  };

  const handleRemove = () => {
    onChange(undefined);
    setLocalError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="flex flex-col items-center gap-1.5 w-full">
      <label className="text-sm font-medium text-slate-700">
        Hình ảnh sản phẩm
      </label>

      {preview ? (
        <div
          className={cn(
            "group relative size-full rounded-lg border border-slate-200",
            className,
          )}
        >
          <img src={preview} alt="product_image" className="object-cover" />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -right-2 -top-2 flex size-5 items-center justify-center rounded-full bg-black/60 hover:bg-black text-white cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>
      ) : (
        <div
          onClick={handleChooseImage}
          className={`flex size-50 flex-col items-center justify-center gap-1 rounded-lg border border-dashed text-slate-400 transition hover:border-primary hover:text-primary cursor-pointer ${
            error || localError ? "border-red-400" : "border-slate-300"
          }`}
        >
          <Plus className="size-5" />
          <span className="text-sm">Chọn ảnh</span>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />

      <p className="text-xs text-slate-400">Tối đa 1 MB</p>

      {(error || localError) && (
        <p className="text-xs text-red-500">{error || localError}</p>
      )}
    </div>
  );
};

export default ProductImageBox;
