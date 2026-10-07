import { Rating } from "@/components/ui/rating";

interface RatingStarProps {
  value: number;
  onChange?: (value: number) => void;
  readonly?: boolean;
}

const RatingStar = ({ value, onChange, readonly = false }: RatingStarProps) => {
  return (
    <Rating
      size={16}
      value={value}
      onValueChange={onChange}
      aria-label="Rating Yellow"
      readOnly={readonly}
    />
  );
};

export default RatingStar;
