import Navbar from "./navBar";
import Footer from "./footer";

function StaticPageLayout({ title, subtitle, children }) {
  return (
    <div className="trackly-page static-page">
      <Navbar />
      <div className="trackly-page-content static-page-content">
        <header className="static-page-header">
          <h1 className="static-page-title">{title}</h1>
          {subtitle && <p className="static-page-subtitle text-muted">{subtitle}</p>}
        </header>
        <div className="card static-page-card border-0 shadow-sm">{children}</div>
      </div>
      <Footer />
    </div>
  );
}

export default StaticPageLayout;
