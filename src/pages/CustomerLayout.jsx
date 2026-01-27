import { Outlet } from "react-router-dom";
import "../styles/customer.css";

export default function CustomerLayout() {
  return (
    <div className="cf-page">
      <main className="cf-mainFull">
        <Outlet />
      </main>
    </div>
  );
}
