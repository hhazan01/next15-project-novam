import React from "react";

export default function Spinner() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="container">
        <div className="loader"></div>
        <div className="loader"></div>
        <div className="loader"></div>
      </div>
    </div>
  );
}
