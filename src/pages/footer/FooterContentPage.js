import { Navigate } from "react-router-dom";
import StaticPageLayout from "../../components/StaticPageLayout";
import footerPages from "./footerContent";

function FooterContentPage({ pageKey }) {
  const page = footerPages[pageKey];

  if (!page) {
    return <Navigate to="/" replace />;
  }

  return (
    <StaticPageLayout title={page.title} subtitle={page.subtitle}>
      {page.content}
    </StaticPageLayout>
  );
}

export default FooterContentPage;
