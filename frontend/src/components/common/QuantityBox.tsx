import { Minus, Plus } from "lucide-react";

interface QuantityBoxProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

const QuantityBox = ({ value, onChange, min = 1, max }: QuantityBoxProps) => {
  const handleDecrease = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleIncrease = () => {
    if (max === undefined || value < max) {
      onChange(value + 1);
    }
  };

  return (
    <div className="inline-flex items-center border border-gray-300 rounded-sm h-8 w-fit">
      <button
        type="button"
        onClick={handleDecrease}
        disabled={value <= min}
        className="w-8 h-full flex items-center justify-center border-r border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
      >
        <Minus className="w-3.5 h-3.5" />
      </button>

      <span className="w-10 text-center text-sm text-primary">{value}</span>

      <button
        type="button"
        onClick={handleIncrease}
        disabled={max !== undefined && value >= max}
        className="w-8 h-full flex items-center justify-center cursor-pointer border-l border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

export default QuantityBox;
