import { useNavigate } from "react-router-dom";

interface LogoProps {
  className: string;
}

const Logo = ({ className }: LogoProps) => {
  const navigate = useNavigate();

  const handleGoToHomepage = () => {
    navigate("/");
  };

  return (
    <div className="flex items-end cursor-pointer" onClick={handleGoToHomepage}>
      <img src="/shopee_logo.svg" alt="shopee_logo" className="w-12" />
      <p className={`text-primary font-medium text-2xl ${className}`}>Shopee</p>
    </div>
  );
};

export default Logo;
