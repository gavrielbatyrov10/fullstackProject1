import { Outlet } from "react-router-dom";

import Navbar from "./Navbar";

import "./Root.less";
import Footer from "./Footer";

export default function Root() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
