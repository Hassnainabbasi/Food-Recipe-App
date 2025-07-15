import React from "react";

const originalCreateElement = React.createElement;

React.createElement = function (type, props, ...children) {
  children.forEach((child) => {
    if (
      typeof child === "object" &&
      child !== null &&
      !Array.isArray(child) &&
      !React.isValidElement(child)
    ) {
      console.error(
        "🚨 Invalid React child!",
        "\nComponent:",
        type?.name || type,
        "\nInvalid child object:",
        child
      );
    }
  });

  return originalCreateElement(type, props, ...children);
};
