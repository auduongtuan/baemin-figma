import React from "react";

const MenuItem = ({ children, className = "", ...rest }) => {
  return (
    <button className={`menu-item ${className}`} {...rest}>
      {children}
    </button>
  );
};

export default MenuItem;