import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = ({ children, theme, toggleTheme }) => {
  return (
    <>
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default Layout;
