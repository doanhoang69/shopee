const UnauthorizedPage = () => {
  return (
    <div className="h-screen flex flex-col gap-2 justify-center items-center">
      <p className="text-4xl text-primary font-bold">403 Forbidden</p>
      <p className="text-gray-500 text-base">
        You are not authorized to access this page
      </p>
    </div>
  );
};

export default UnauthorizedPage;
