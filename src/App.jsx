import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import AnalyticsTracker from "./components/AnalyticsTracker";
import Home from "./pages/Home";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import EntityPage from "./components/EntityPage";
import { getEntityPage } from "./content/entityPages";
import "./App.css";

export default function App() {
  const entityRoutes = [
    "/nestor-hire",
    "/nestor-core",
    "/recruitment-services",
    "/hr-operations-payroll",
  ];

  return (
    <BrowserRouter>
      <AnalyticsTracker />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        {entityRoutes.map((route) => (
          <Route
            key={route}
            path={route}
            element={<EntityRoute slug={route.slice(1)} />}
          />
        ))}
      </Routes>
    </BrowserRouter>
  );
}

function EntityRoute({ slug }) {
  const page = getEntityPage(slug);
  return page ? <EntityPage page={page} /> : null;
}
