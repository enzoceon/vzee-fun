
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-darkBlack text-white p-4 text-center">
      <div className="max-w-md">
        <h1 className="text-4xl font-bold mb-4 text-premiumRed">404</h1>
        <p className="text-xl text-lightGray mb-6">Oops! Page not found</p>
        <p className="text-muted-foreground mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <a
          href="/"
          className="btn-premium inline-block"
        >
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
