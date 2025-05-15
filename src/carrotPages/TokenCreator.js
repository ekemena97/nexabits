import React, { useState } from "react";

const TokenCreator = () => {
  const [formData, setFormData] = useState({
    name: "",
    symbol: "",
    description: "",
    imageUrl: "",
    imageFile: null,
    decimals: 9,
    totalSupply: "",
    fixedSupply: false,
  });

  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false); // Example for wallet connection state

  const validateImageUrl = async (url) => {
    try {
      const response = await fetch(url, { method: "HEAD" });
      const contentType = response.headers.get("Content-Type");
      return contentType && contentType.startsWith("image/");
    } catch (error) {
      console.error("Error validating image URL:", error);
      return false;
    }
  };

  const handleSubmit = async () => {
    const { name, symbol, description, imageUrl, imageFile, decimals, totalSupply, fixedSupply } = formData;

    // Clear previous messages
    setMessage({ type: "", text: "" });

    // Validation checks: All fields are required
    if (!name || !symbol || !description || !totalSupply || (!imageUrl && !imageFile)) {
      setMessage({ type: "error", text: "All fields are required. Please complete the form." });
      return;
    }

    // Validate image URL if provided
    if (imageUrl) {
      const isValidImageUrl = await validateImageUrl(imageUrl);
      if (!isValidImageUrl) {
        setMessage({ type: "error", text: "The provided URL does not point to a valid image." });
        return;
      }
    }

    if (!walletConnected) {
      setMessage({ type: "error", text: "Please connect your wallet first." });
      return;
    }

    try {
      setLoading(true);

      const moduleAddress = "YourModuleAddress::Token"; // Replace with your deployed Move module address
      const image = imageFile || imageUrl;

      // Create the transaction block
      const tx = new TransactionBlock();

      // Call the create_token function in your Move module
      tx.moveCall({
        target: `${moduleAddress}::create_token`,
        arguments: [
          tx.pure(name),
          tx.pure(symbol),
          tx.pure(description),
          tx.pure(image),
          tx.pure(decimals),
          tx.pure(totalSupply),
          tx.pure(fixedSupply),
        ],
      });

      // Add a transfer of 2 SUI to your wallet (service fee)
      tx.transferSui({
        recipient: "your-wallet-address", // Replace with your wallet address
        amount: tx.pure(2000000000), // 2 SUI in MIST
      });

      // Set the gas budget
      tx.setGasBudget(2000000000); // 2 SUI in MIST

      // Sign and execute the transaction block
      const result = await wallet.signAndExecuteTransactionBlock({
        transactionBlock: tx,
      });

      console.log("Transaction Success:", result);
      setMessage({ type: "success", text: "Token deployed successfully!" });
    } catch (error) {
      console.error("Transaction Failed:", error);
      setMessage({ type: "error", text: "Deployment failed. Ensure your wallet is funded and connected." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Create and Deploy Your Token</h1>

      {message.text && (
        <div
          className={`mb-4 p-3 rounded ${
            message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="space-y-4"
      >
        {/* Token Name */}
        <div>
          <label className="block text-sm font-medium">Token Name</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        {/* Token Symbol */}
        <div>
          <label className="block text-sm font-medium">Symbol</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={formData.symbol}
            onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            className="w-full p-2 border rounded"
            rows="3"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium">Image Upload (Required)</label>
          <input
            type="file"
            accept="image/*"
            className="w-full p-2 border rounded"
            onChange={(e) => setFormData({ ...formData, imageFile: e.target.files[0], imageUrl: "" })}
          />
        </div>

        {/* Image URL */}
        <div>
          <label className="block text-sm font-medium">Or Enter Image URL</label>
          <input
            type="text"
            placeholder="https://example.com/image.png"
            className="w-full p-2 border rounded"
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value, imageFile: null })}
            disabled={!!formData.imageFile}
          />
        </div>

        {/* Decimals */}
        <div>
          <label className="block text-sm font-medium">Decimals</label>
          <input
            type="number"
            className="w-full p-2 border rounded"
            value={formData.decimals}
            onChange={(e) => setFormData({ ...formData, decimals: e.target.value })}
            min="0"
          />
        </div>

        {/* Total Supply */}
        <div>
          <label className="block text-sm font-medium">Total Supply</label>
          <input
            type="number"
            className="w-full p-2 border rounded"
            value={formData.totalSupply}
            onChange={(e) => setFormData({ ...formData, totalSupply: e.target.value })}
            min="1"
          />
        </div>

        {/* Fixed Supply Toggle */}
        <div>
          <label className="block text-sm font-medium">Fixed Supply</label>
          <input
            type="checkbox"
            className="p-2"
            checked={formData.fixedSupply}
            onChange={(e) => setFormData({ ...formData, fixedSupply: e.target.checked })}
          />
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className={`w-full p-3 text-white rounded ${
              loading ? "bg-gray-400" : "bg-blue-600"
            }`}
            disabled={loading}
          >
            {loading ? "Deploying..." : "Create and Deploy Token"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TokenCreator;
