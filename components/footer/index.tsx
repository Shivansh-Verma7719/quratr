import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 py-8 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6 text-center text-gray-600">
        <p>&copy; {new Date().getFullYear()} Quratr. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
