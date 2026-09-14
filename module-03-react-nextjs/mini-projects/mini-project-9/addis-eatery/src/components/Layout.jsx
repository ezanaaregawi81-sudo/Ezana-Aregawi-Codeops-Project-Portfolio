import { Outlet } from "react-router-dom";
import Header from "./Header";

export default function Layout() {
  return (
    <div className="layout-container">
      <Header />
      <main className="main-content">
        <Outlet />
      </main>
      <footer className="footer">
        <p>© {new Date().getFullYear()} Addis Eatery. Fresh from Addis to your door.</p>
      </footer>
    </div>
  );
}