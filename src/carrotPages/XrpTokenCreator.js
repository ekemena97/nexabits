import React, { useState, useEffect } from 'react';
import * as xrpl from 'xrpl';
import WalletConnect from '@walletconnect/client';
import QRCode from 'qrcode.react';
import { Xumm } from 'xumm';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
const PROJECT_ID = "858950055775";
const ALGORITHM = "aes-256-cbc";
const FEE_ACCOUNT = 'r4YyPdTUiVbzSU97LueEp7J5ZX4J1MV9Vf'; // Replace with your XRP address to receive fees
const FEE_AMOUNT = 3000000; // 3 XRP in drops
const XUMM_API_KEY = process.env.REACT_APP_XUMM_API_KEY || ''; // Xumm API Key

const XrpTokenCreator = () => {
    const [walletType, setWalletType] = useState('');
    const [walletAddress, setWalletAddress] = useState('');
    const [connector, setConnector] = useState(null);
    const [qrCode, setQrCode] = useState('');
    const [tokenName, setTokenName] = useState('');
    const [tokenSymbol, setTokenSymbol] = useState('');
    const [totalSupply, setTotalSupply] = useState('');
    const [tokenDescription, setTokenDescription] = useState('');
    const [tokenImage, setTokenImage] = useState(null);
    const [website, setWebsite] = useState('');
    const [twitter, setTwitter] = useState('');
    const [telegram, setTelegram] = useState('');    
    const [blackholeIssuer, setBlackholeIssuer] = useState(false);
    const [liquidityAmount, setLiquidityAmount] = useState('');
    const [transactionComplete, setTransactionComplete] = useState(false);
    const [status, setStatus] = useState('');
    const [showDisconnect, setShowDisconnect] = useState(false);
    const [showWebsiteSocials, setShowWebsiteSocials] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [preview, setPreview] = useState(null);
    const [uploadedUrl, setUploadedUrl] = useState(null);   

    useEffect(() => {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        if (/android|iPhone|iPad|iPod/i.test(userAgent)) {
            handleMobileWallet();
        } else {
            handleBrowserWallet();
        }
    }, []);

    const connectWallet = async () => {
        await handleBrowserWallet();
    };

    const handleMobileWallet = async () => {
        try {
            const walletConnect = new WalletConnect({ bridge: "https://bridge.walletconnect.org" });
            if (!walletConnect.connected) {
                await walletConnect.createSession();
            }
            setQrCode(walletConnect.uri);
            setConnector(walletConnect);
            setWalletType('mobile');
        } catch (error) {
            setStatus('Error connecting to WalletConnect: ' + error.message);
        }
    };

    const handleBrowserWallet = async () => {
        try {
            const xumm = new Xumm(XUMM_API_KEY);

            xumm.on("ready", () => {
                console.log("Xumm SDK is ready");
            });

            xumm.on("success", async () => {
                const account = await xumm.user.account; // Get the wallet address
                setWalletAddress(account);
                console.log("Connected Wallet Address:", account); // Debugging log
                setWalletType('browser');
                setStatus('Wallet connected successfully');
            });

            xumm.on("logout", () => {
                setWalletAddress('');
                console.log("User logged out");
                setStatus('Wallet disconnected');
            });

            await xumm.authorize(); // Trigger login prompt
        } catch (error) {
            setStatus('Error connecting to Xumm: ' + error.message);
            console.error("Xumm Connection Error:", error);
        }
    };




    // Function to handle wallet disconnection
    const handleDisconnect = async () => {
        try {
            const xumm = new Xumm(XUMM_API_KEY);
            await xumm.logout();  // Log the user out (disconnect the wallet)
            setWalletAddress(null);  // Clear wallet address
            setWalletType(null);     // Reset wallet type
            setStatus('Wallet disconnected successfully');
            setShowDisconnect(false); // Hide disconnect options after disconnecting
        } catch (error) {
            setStatus('Error disconnecting from Xumm: ' + error.message);
        }
    };    

   const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setStatus("Uploading image...");
        setIsUploading(true);
        setPreview(URL.createObjectURL(file)); // Show a preview before upload starts
        setUploadedUrl(null); // Reset previous upload URL

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/get-upload-url`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fileName: file.name, contentType: file.type }),
            });

            const { uploadUrl, publicUrl } = await response.json();

            console.log("Upload URL:", uploadUrl);
            console.log("Public URL:", publicUrl);

            await fetch(uploadUrl, {
                method: "PUT",
                headers: { "Content-Type": file.type },
                body: file,
            });

            setTokenImage(publicUrl);
            setUploadedUrl(publicUrl);
            setStatus("Image uploaded successfully!");
        } catch (error) {
            console.error("Error uploading image:", error);
            setStatus("Error uploading image: " + error.message);
        } finally {
            setIsUploading(false);
        }
    };

    const storeTokenMetadata = async (issuerData, ISSUER_WALLET) => {
        let attempts = 0;
        const maxRetries = 3;

        while (attempts < maxRetries) {
            try {
                setStatus(`Storing token metadata... (Attempt ${attempts + 1})`);
                
                const metadata = {
                    tokenName,
                    tokenSymbol,
                    tokenDescription,
                    tokenImage,
                    totalSupply,
                    walletAddress,
                    blackholeIssuer,
                    ISSUER_WALLET,
                    issuerData,
                    website,
                    telegram,
                    twitter,
                };

                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/store-metadata`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(metadata)
                });

                const data = await response.json();
                
                if (response.ok) {
                    console.log('Metadata stored successfully:', data);
                    setStatus('Token metadata stored successfully!');
                    return; // Exit function on success
                } else {
                    throw new Error(data.error || 'Failed to store metadata');
                }
            } catch (error) {
                attempts++;
                console.error(`Error storing metadata (Attempt ${attempts}):`, error);
                setStatus(`Error storing metadata (Attempt ${attempts}): ${error.message}`);
                
                if (attempts >= maxRetries) {
                    setStatus('Failed to store metadata after multiple attempts. Please try again later.');
                    return;
                }
                await new Promise(res => setTimeout(res, 2000 * attempts)); // Exponential backoff
            }
        }
    };  

    // Create issuer wallet (generate once and save it securely)

    const createAndIssueToken = async () => {
        if (!walletAddress) {
            setStatus('Please connect your wallet first.');
            handleBrowserWallet();
            return;
        }

        try {
            setStatus("Creating and issuing the fungible token...");
            console.log("Initializing fungible token issuance process...");

            const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233", { connectionTimeout: 100000 });
            await client.connect();
            console.log("Connected to XRPL Testnet.");

            // Always generate a new issuer wallet
            const wallet = xrpl.Wallet.generate();
            const issuerData = {
                seed: wallet.seed,
                classicAddress: wallet.classicAddress,
                blackholeIssuer: blackholeIssuer
            };
            localStorage.setItem("issuerData", JSON.stringify(issuerData));
            const ISSUER_WALLET = wallet;
            console.log("Generated new issuer wallet:", ISSUER_WALLET.classicAddress);

            // Automatically fund the new issuer wallet using the XRPL Testnet Faucet
            //const faucetResult = await client.fundWallet(ISSUER_WALLET);
            //console.log("Issuer wallet funded with Testnet XRP:", faucetResult);   

            const currencyCode = xrpl.convertStringToHex(tokenSymbol).padEnd(40, "0");

            // Step 1: Send Fee Payment
            const paymentTx = {
                TransactionType: "Payment",
                Account: walletAddress,
                Destination: FEE_ACCOUNT,
                Amount: FEE_AMOUNT.toString(),
                Flags: 2147483648,                
            };

            setStatus("Sending 3 XRP fee payment...");
            const paymentResult = await signAndSubmitTransaction(paymentTx, "Fee Payment", walletAddress);
            validateTransaction(paymentResult);


            // Step 2: Ensure Fee Account received 3 XRP, then send 1.2 XRP to Issuer Wallet
            setStatus("Verifying fee payment and transferring 1.2 XRP to issuer...");

            const txResponse = await fetch(`${process.env.REACT_APP_API_URL}/sign-transaction`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ destination: ISSUER_WALLET.classicAddress }),
            });

            const txData = await txResponse.json();

            if (!txData.success) {
              throw new Error(`Fee transfer failed: ${txData.error || "Unknown error"}`);
            }

            console.log("1.2 XRP successfully transferred to issuer:", txData.tx?.result?.hash);
            

            // ✅ Step 3: Set Domain for Issuer
            setStatus("Setting domain for issuer...");
            await setDomainForIssuer(ISSUER_WALLET, client);            

            // Step 4: TrustSet Transaction
            const trustSetTx = {
                TransactionType: "TrustSet",
                Account: walletAddress,
                LimitAmount: {
                    currency: currencyCode,
                    issuer: ISSUER_WALLET.classicAddress,
                    value: totalSupply.toString(),
                },
                //Flags: 131072,               
            };

            setStatus("Setting trust line...");
            await signAndSubmitTransaction(trustSetTx, "TrustSet", walletAddress);

            // Step 5: Transfer Token
            await transferTokens(walletAddress, ISSUER_WALLET, currencyCode, totalSupply, client);

            // Step 6: Blackhole Issuer if required
            if (blackholeIssuer) {
                console.log("Blackholing issuer account...");
                await blackholeIssuerAccount(ISSUER_WALLET, client);
            }

            await storeTokenMetadata(issuerData, ISSUER_WALLET);

            client.disconnect();
            setTransactionComplete(true);
            setStatus("Token issuance process complete.");
        } catch (error) {
            console.error("Error during token issuance:", error);
            setStatus("Error issuing token: " + error.message);
        }
    };

    const signAndSubmitTransaction = async (transaction, actionName, signingWallet) => {
        try {
            console.log(`Signing transaction for ${actionName}...`);
            
            if (signingWallet instanceof xrpl.Wallet) {
                const { tx_blob } = signingWallet.sign(transaction);
                const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233", { connectionTimeout: 100000 });
                await client.connect();
                const result = await client.submitAndWait(tx_blob);
                client.disconnect();
                console.log(`${actionName} transaction submitted successfully:`, result);
                return result;
            } else {
                const xumm = new Xumm(XUMM_API_KEY);
                const payload = await xumm.payload.create(transaction);
                const xummWindow = window.open(payload.next.always, "XummPopup", "width=400,height=600,scrollbars=no,resizable=no");
                setStatus(`Waiting for user to sign the ${actionName} transaction...`);
                
                return new Promise((resolve, reject) => {
                    const checkPayloadStatus = async () => {
                        try {
                            const resolvedPayload = await xumm.payload.get(payload.uuid);
                            console.log(`Polling payload status for ${actionName}:`, resolvedPayload);

                            if (resolvedPayload.meta.resolved && resolvedPayload.meta.signed) {
                                setStatus(`${actionName} successful!`);
                                console.log(`${actionName} transaction confirmed:`, resolvedPayload);
                                resolve(resolvedPayload);
                            } else {
                                setTimeout(checkPayloadStatus, 5000);
                            }
                        } catch (error) {
                            console.error(`Error checking ${actionName} status:`, error);
                            reject(error);
                        }
                    };

                    setTimeout(checkPayloadStatus, 5000);
                });
            }
        } catch (error) {
            console.error(`Error in signAndSubmitTransaction for ${actionName}:`, error);
            throw error;
        }
    };

    const validateTransaction = (resolvedPayload, transactionType) => {
        const { meta, payload } = resolvedPayload;

        if (!meta.resolved) {
            throw new Error('Transaction payload not resolved.');
        }
        if (!meta.signed) {
            throw new Error('Transaction was not signed by the user.');
        }

        if (transactionType !== 'Liquidity') {
            const { destination, resolved_destination } = meta;
            console.log('Destination:', destination);
            console.log('Resolved Destination:', resolved_destination);

            if (destination !== FEE_ACCOUNT || resolved_destination !== FEE_ACCOUNT) {
                throw new Error('Transaction sent to wrong account. Possible scam attempt detected!');
            }
        }

        const amount = parseInt(payload.Amount, 10);
        const fee = parseInt(payload.Fee, 10);
        const totalAmount = amount + fee;

        console.log('Transaction Amount (drops):', amount);
        console.log('Transaction Fee (drops):', fee);
        console.log('Total Amount Sent (drops):', totalAmount);
        console.log('Required Minimum (drops):', FEE_AMOUNT);

        if (totalAmount < FEE_AMOUNT) {
            throw new Error(`Transaction amount mismatch! Expected at least ${FEE_AMOUNT} drops.`);
        }
    };
    const transferTokens = async (walletAddress, ISSUER_WALLET, currencyCode, totalSupply, client) => {
        try {

            console.log("Transferring issued tokens to user...");
            const dynamicFee = (await client.request({ command: "fee" })).result.drops.open_ledger_fee;
            console.log(`✅ Dynamic Fee Retrieved: ${dynamicFee} drops`);
            // Fetch last ledger index and define LastLedgerSequence
            // ✅ Fetch latest ledger index properly
            const ledgerIndex = await client.getLedgerIndex();
            const lastLedgerSequence = ledgerIndex + 10;

            // Fetch account sequence number
            const accountInfo = await client.request({
                command: "account_info",
                account: ISSUER_WALLET.classicAddress
            });
            const sequence = accountInfo.result.account_data.Sequence;
            console.log(`✅ Fetched Sequence Number: ${sequence}`);            
            console.log(`✅ Fetched Ledger Index: ${ledgerIndex}, LastLedgerSequence: ${lastLedgerSequence}`);          
            const transferTx = {
                TransactionType: "Payment",
                Account: ISSUER_WALLET.classicAddress,
                Destination: walletAddress,
                Amount: {
                    currency: currencyCode,
                    issuer: ISSUER_WALLET.classicAddress,
                    value: totalSupply.toString(),
                },
                Flags: 2147483648,
                Fee: dynamicFee,
                Sequence: sequence,
                LastLedgerSequence: lastLedgerSequence,                
            };

            setStatus("Transferring tokens...");
            const result = await signAndSubmitTransaction(transferTx, "Token Transfer", ISSUER_WALLET);
            console.log("Tokens successfully transferred to:", walletAddress);
        } catch (error) {
            console.error("Error transferring tokens:", error);
            // 🔍 If error is an XRPL response, log full details
            if (error.data) {
                console.error("🔍 Full XRPL Error Response:", JSON.stringify(error.data, null, 2));
            }            
            throw error;
        }
    };

    const setDomainForIssuer = async (ISSUER_WALLET, client) => {
        try {
            console.log("Setting domain for the issuing wallet...");
            
            // Convert domain to hex (nexabit.xyz -> 6E6578616269742E78797A)
            const domainHex = "6E6578616269742E78797A";

            const dynamicFee = (await client.request({ command: "fee" })).result.drops.open_ledger_fee;
            console.log(`✅ Dynamic Fee Retrieved: ${dynamicFee} drops`);

            // Fetch latest ledger index
            const ledgerIndex = await client.getLedgerIndex();
            const lastLedgerSequence = ledgerIndex + 10;

            // Fetch account sequence number
            const accountInfo = await client.request({
                command: "account_info",
                account: ISSUER_WALLET.classicAddress
            });
            const sequence = accountInfo.result.account_data.Sequence;
            console.log(`✅ Fetched Sequence Number: ${sequence}`);  

            // Create the AccountSet transaction to set the domain
            const domainTx = {
                TransactionType: "AccountSet",
                Account: ISSUER_WALLET.classicAddress,
                Domain: domainHex, // HEX encoded domain
                Fee: dynamicFee,
                Sequence: sequence,
                LastLedgerSequence: lastLedgerSequence,
                SetFlag: 8 // Disable rippling for the issuer account
            };

            console.log("🚀 Submitting domain setup transaction...");
            const domainResult = await signAndSubmitTransaction(domainTx, "Set Domain", ISSUER_WALLET);
            console.log("✅ Domain successfully set for:", ISSUER_WALLET.classicAddress);

            return domainResult;
        } catch (error) {
            console.error("❌ Error setting domain:", error);
            throw error;
        }
    };


    const blackholeIssuerAccount = async (ISSUER_WALLET, client) => {
        try {
            console.log("Blackholing issuer account...");
            const feeResponse = await client.request({ command: "fee" });
            const dynamicFee = feeResponse.result.drops.open_ledger_fee;
            const accountInfo = await client.request({ command: "account_info", account: ISSUER_WALLET.classicAddress });
            const sequence = accountInfo.result.account_data.Sequence;
            const ledgerIndex = await client.getLedgerIndex();
            const lastLedgerSequence = ledgerIndex + 10;

            // Step 1: Disable Master Key
            const disableMasterKeyTx = {
                TransactionType: "AccountSet",
                Account: ISSUER_WALLET.classicAddress,
                SetFlag: 4,
                Fee: dynamicFee,
                Sequence: sequence,
                LastLedgerSequence: lastLedgerSequence,
            };
            await signAndSubmitTransaction(disableMasterKeyTx, "Disable Master Key", ISSUER_WALLET);

            // Step 2: Remove Regular Key (if set)
            const removeRegularKeyTx = {
                TransactionType: "SetRegularKey",
                Account: ISSUER_WALLET.classicAddress,
                RegularKey: "rrrrrrrrrrrrrrrrrrrrrhoLvTp",
                Fee: dynamicFee,
                Sequence: sequence + 1,
                LastLedgerSequence: lastLedgerSequence + 1,
            };
            await signAndSubmitTransaction(removeRegularKeyTx, "Remove Regular Key", ISSUER_WALLET);

            console.log("Issuer account fully blackholed.");
        } catch (error) {
            console.error("Error blackholing issuer account:", error);
        }
    };    
   

    const handleLiquidityTransaction = async () => {
        if (!transactionComplete) {
            setStatus('Please create token first.');
            return;
        }

        try {
            setStatus('Adding liquidity...');
            console.log('Connecting to XRPL testnet...');
            const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233", { connectionTimeout: 100000 });
            await client.connect();

            // ✅ Create Liquidity Transaction Payload
            const exchangeRate = 0.1; // Example: 1 token = 0.1 XRP
            const offerTx = {
                TransactionType: 'OfferCreate',
                Account: walletAddress,
                TakerPays: (parseInt(liquidityAmount) * exchangeRate * 1000000).toString(),
                TakerGets: {
                    currency: tokenSymbol,
                    issuer: walletAddress,
                    value: liquidityAmount,
                },
            };

            // ✅ Sign and Submit Transaction
            const result = await signAndSubmitTransaction(offerTx, 'Liquidity', walletAddress);
            validateTransaction(result);

            setStatus('✅ Liquidity transaction completed successfully!');
            await client.disconnect();
        } catch (error) {
            setStatus('❌ Error: ' + error.message);
            console.error('Error:', error);
        }
    };


    // Toggle the display of the disconnect option
    const toggleDisconnect = () => setShowDisconnect(!showDisconnect);    

    return (
        <div className="p-6 max-w-lg mx-auto space-y-4 relative mb-10">
            <button
                onClick={walletAddress ? toggleDisconnect : connectWallet}
                className={`absolute top-4 right-4 px-4 py-2 rounded shadow-md 
                    ${walletAddress ? 'bg-green-500 hover:bg-green-700' : 'bg-blue hover:bg-lightBlue'} 
                    text-white`}
            >
                {walletAddress ? (
                    <>
                        <span>Wallet Connected</span>
                        {showDisconnect ? (
                            <FaChevronUp className="w-5 h-5 ml-2 inline" />
                        ) : (
                            <FaChevronDown className="w-5 h-5 ml-2 inline" />
                        )}
                    </>
                ) : (
                    'Connect Wallet'
                )}
            </button>

            {showDisconnect && walletAddress && (
                <div className="absolute top-16 right-4 bg-white shadow-lg rounded-md p-2">
                    <button onClick={handleDisconnect} className="text-red-500 hover:text-red-700">
                        Disconnect Wallet
                    </button>
                </div>
            )}
            
            <h1 className="text-2xl font-bold text-center text-black">XRP Token Creator</h1>
            <p className="text-gray-600 text-center">Create and deploy your own token on the XRP Ledger!</p>
            
            <input type="text" placeholder="Token Name" value={tokenName} onChange={(e) => setTokenName(e.target.value)} className="w-full border p-2 rounded" required />
            <input type="text" placeholder="Token Symbol" value={tokenSymbol} onChange={(e) => setTokenSymbol(e.target.value)} className="w-full border p-2 rounded" required />
            <textarea placeholder="Token Description" value={tokenDescription} onChange={(e) => setTokenDescription(e.target.value)} className="w-full border p-2 rounded" required></textarea>
            <input type="number" placeholder="Total Supply" value={totalSupply} onChange={(e) => setTotalSupply(e.target.value)} className="w-full border p-2 rounded" required />
            
            <label className="block text-gray-500 text-sm font-medium">Upload Token Image</label>
            <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full border p-2 rounded mt-1"
                required
            />

            {preview && (
                <div className="mt-3">
                    <img src={preview} alt="Preview" className="w-32 h-32 object-cover rounded" />
                </div>
            )}

            {isUploading && (
                <div className="mt-2 text-sm text-gray-600 flex items-center">
                    <svg className="animate-spin h-5 w-5 text-blue-500 mr-2" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                    </svg>
                    Uploading...
                </div>
            )}

            {status && <p className="mt-2 text-sm text-gray-700">{status}</p>}

            {uploadedUrl && (
                <div className="mt-2">
                    <p className="text-sm text-gray font-medium">Public URL:</p>
                    <a
                        href={uploadedUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue text-sm break-all"
                    >
                        {uploadedUrl}
                    </a>
                </div>
            )}
            
            <div className="flex items-center justify-between mt-4">
                <span className="text-gray-500">Add Website & Socials (Optional):</span>
                <div 
                    className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition duration-300 ${showWebsiteSocials ? 'bg-blue' : 'bg-gray-400'}`}
                    onClick={() => setShowWebsiteSocials(!showWebsiteSocials)}
                >
                    <div 
                        className={`bg-white w-5 h-5 rounded-full shadow-md transform transition duration-300 ${showWebsiteSocials ? 'translate-x-6' : 'translate-x-0'}`}
                    ></div>
                </div>
            </div>
            <p className="text-gray-500 text-sm text-center">It's fine if you don't have these details now. You can add them later.</p>

            {/* ✅ Blackhole Toggle */}
            <div className="flex items-center justify-between mt-4">
                <span className="text-gray-500">Blackhole Issuer:</span>
                <div 
                    className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition duration-300 ${blackholeIssuer ? 'bg-blue' : 'bg-gray-400'}`}
                    onClick={() => setBlackholeIssuer(!blackholeIssuer)}
                >
                    <div 
                        className={`bg-white w-5 h-5 rounded-full shadow-md transform transition duration-300 ${blackholeIssuer ? 'translate-x-6' : 'translate-x-0'}`}
                    ></div>
                </div>
            </div>
            <p className="text-gray-500 text-xs">
                If enabled, you can't control the tokens anymore, giving power to the community.
            </p>            
            
            {showWebsiteSocials && (
                <div className="mt-4 space-y-2">
                    <label className="block text-gray-500 text-sm font-medium">Website (Optional)</label>
                    <input type="url" placeholder="Website URL" value={website} onChange={(e) => setWebsite(e.target.value)} className="w-full border p-2 rounded" />
                    
                    <label className="block text-gray-500 text-sm font-medium">Socials (Optional)</label>
                    <input type="url" placeholder="Twitter Link" value={twitter} onChange={(e) => setTwitter(e.target.value)} className="w-full border p-2 rounded" />
                    <input type="url" placeholder="Telegram Link" value={telegram} onChange={(e) => setTelegram(e.target.value)} className="w-full border p-2 rounded" />
                </div>
            )}
            
            <button onClick={createAndIssueToken} className="w-full bg-blue p-2 rounded text-white hover:bg-lightBlue shadow-md">Create & Deploy Token</button>
            
            {transactionComplete && (
                <>
                    <input type="number" placeholder="Liquidity Amount" value={liquidityAmount} onChange={(e) => setLiquidityAmount(e.target.value)} className="w-full border p-2 rounded" required />
                    <button onClick={handleLiquidityTransaction} className="w-full bg-green-500 p-2 rounded text-white hover:bg-green-700 shadow-md">Enable Trading</button>
                </>
            )}
            
            <div className="text-center text-red-500 font-semibold">{status}</div>
        </div>
    );



};

export default XrpTokenCreator;
