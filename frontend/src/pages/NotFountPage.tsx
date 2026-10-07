import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const NotFountPage = () => {
  const navigate = useNavigate();

  const handleGoToHomepage = () => {
    navigate("/");
  };

  return (
    <div className="h-screen flex flex-col gap-2 justify-center items-center">
      <p className="text-4xl text-primary font-bold">404 Not Found</p>
      <p className="text-gray-500 text-base">Page not found</p>
      <Button className="h-11 w-25" onClick={handleGoToHomepage}>
        Trang chủ
      </Button>
    </div>
  );
};

export default NotFountPage;
