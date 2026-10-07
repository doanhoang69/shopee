import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar";

const MyAccount = () => {
  return (
    <div className="mt-30 flex gap-6">
      <Sidebar />

      <Outlet />
    </div>
  );
};

export default MyAccount;
