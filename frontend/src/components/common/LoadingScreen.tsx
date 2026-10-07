const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 w-screen h-screen bg-neutral-100 flex items-center justify-center z-50">
      <img
        src="/shopee_logo.svg"
        alt="Shopee_logo"
        className="size-20 animate-pulse"
      />
    </div>
  );
};

export default LoadingScreen;
