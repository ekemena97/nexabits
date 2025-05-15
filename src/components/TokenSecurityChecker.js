import React, { useState } from 'react';

const TokenSecurityChecker = () => {
  const [selectedNetwork, setSelectedNetwork] = useState('Ethereum');
  const [tokenAddress, setTokenAddress] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const networkChainMap = {
    Ethereum: '1',
    BSC: '56',
    Solana: '0',
    Arbitrum: '42161',
    Base: '8453',
    SUI: '204',
    TON: '201022',
  };

  const handleNetworkChange = (e) => {
    setSelectedNetwork(e.target.value);
    setResult(null);
    setErrorMessage('');
    setTokenAddress('');
  };

  const handleTokenAddressChange = (e) => {
    setTokenAddress(e.target.value);
    setResult(null);
    setErrorMessage('');
  };

  const handleSubmit = async () => {
    if (!tokenAddress) {
      setErrorMessage('Please enter a valid token address.');
      return;
    }

    const chainId = networkChainMap[selectedNetwork];
    setLoading(true);
    setErrorMessage('');
    setResult(null);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/token-security-v0`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chainId, addresses: [tokenAddress] }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setErrorMessage(`An error occurred: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="token-security-checker">
      <h1>Token Security Checker</h1>

      <div>
        <label>
          Select Network:
          <select value={selectedNetwork} onChange={handleNetworkChange}>
            <option value="Ethereum">Ethereum</option>
            <option value="BSC">BSC</option>
            <option value="Solana">Solana</option>
            <option value="Arbitrum">Arbitrum</option>
            <option value="Base">Base</option>
            <option value="SUI">SUI</option>
            <option value="TON">TON</option>
          </select>
        </label>
      </div>

      <div>
        <label>
          Token Address:
          <input
            type="text"
            value={tokenAddress}
            onChange={handleTokenAddressChange}
            placeholder="Enter token address"
          />
        </label>
      </div>

      <button onClick={handleSubmit} disabled={loading}>
        {loading ? 'Checking...' : 'Submit'}
      </button>

      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

      {result && (
        <div>
          <h2>Scan Results:</h2>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default TokenSecurityChecker;
