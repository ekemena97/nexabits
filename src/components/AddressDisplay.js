// AddressDisplay.js
import React, { useState } from "react";
import { FiCopy } from "react-icons/fi";

const AddressDisplay = ({ address }) => {
  const [copyNotification, setCopyNotification] = useState(false);

  const truncatedAddress = address
    ? `${address.slice(0, 15)}....${address.slice(-15)}`
    : "N/A";

  const handleCopy = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopyNotification(true);
      setTimeout(() => setCopyNotification(false), 2000);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <span className="whitespace-nowrap">{truncatedAddress}</span>
      <FiCopy
        onClick={handleCopy}
        style={{ color: "lime", cursor: "pointer", fontSize: "0.8rem" }}
      />
      {copyNotification && (
        <span className="text-green-500 ml-2">Address copied!</span>
      )}
    </div>
  );
};

export default AddressDisplay;
