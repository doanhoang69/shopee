import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import ReviewProductItem from "./ReviewProductItem";
import type { UnreviewedProducts } from "@/services/reviewApi";

interface ReviewProductDialogProps {
  unreviewedProducts: UnreviewedProducts[];
}

const ReviewProductDialog = ({
  unreviewedProducts,
}: ReviewProductDialogProps) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (unreviewedProducts.length === 0) {
      setOpen(false);
    }
  }, [unreviewedProducts.length]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <span className="w-30 bg-primary hover:bg-primary/80 h-10 flex items-center justify-center text-white rounded-sm cursor-pointer duration-150">
          Đánh giá
        </span>
      </DialogTrigger>
      <DialogContent className="sm:max-w-150 sm:h-156 flex flex-col px-6">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            Đánh giá sản phẩm
          </DialogTitle>
        </DialogHeader>

        <div className="grow overflow-auto scrollbar-hide space-y-10">
          {unreviewedProducts.map((item) => (
            <ReviewProductItem key={item.id} product={item} />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewProductDialog;
