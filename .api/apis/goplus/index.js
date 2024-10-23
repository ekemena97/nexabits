import Oas from 'oas';
import APICore from 'api/dist/core';
import definition from './openapi.json';
class SDK {
    constructor() {
        this.spec = Oas.init(definition);
        this.core = new APICore(this.spec, 'goplus/1.0 (api/6.1.2)');
    }
    /**
     * Optionally configure various options that the SDK allows.
     *
     * @param config Object of supported SDK options and toggles.
     * @param config.timeout Override the default `fetch` request timeout of 30 seconds. This number
     * should be represented in milliseconds.
     */
    config(config) {
        this.core.setConfig(config);
    }
    /**
     * If the API you're using requires authentication you can supply the required credentials
     * through this method and the library will magically determine how they should be used
     * within your API request.
     *
     * With the exception of OpenID and MutualTLS, it supports all forms of authentication
     * supported by the OpenAPI specification.
     *
     * @example <caption>HTTP Basic auth</caption>
     * sdk.auth('username', 'password');
     *
     * @example <caption>Bearer tokens (HTTP or OAuth 2)</caption>
     * sdk.auth('myBearerToken');
     *
     * @example <caption>API Keys</caption>
     * sdk.auth('myApiKey');
     *
     * @see {@link https://spec.openapis.org/oas/v3.0.3#fixed-fields-22}
     * @see {@link https://spec.openapis.org/oas/v3.1.0#fixed-fields-22}
     * @param values Your auth credentials for the API; can specify up to two strings or numbers.
     */
    auth(...values) {
        this.core.setAuth(...values);
        return this;
    }
    /**
     * If the API you're using offers alternate server URLs, and server variables, you can tell
     * the SDK which one to use with this method. To use it you can supply either one of the
     * server URLs that are contained within the OpenAPI definition (along with any server
     * variables), or you can pass it a fully qualified URL to use (that may or may not exist
     * within the OpenAPI definition).
     *
     * @example <caption>Server URL with server variables</caption>
     * sdk.server('https://{region}.api.example.com/{basePath}', {
     *   name: 'eu',
     *   basePath: 'v14',
     * });
     *
     * @example <caption>Fully qualified server URL</caption>
     * sdk.server('https://eu.api.example.com/v14');
     *
     * @param url Server URL
     * @param variables An object of variables to replace into the server URL.
     */
    server(url, variables = {}) {
        this.core.setServer(url, variables);
    }
    /**
     * Get supported blockchains.
     *
     * @summary Get the list of chains supported by different functions.
     */
    getChainsListUsingGET(metadata) {
        return this.core.fetch('/api/v1/supported_chains', 'get', metadata);
    }
    /**
     * Get token security information.
     *
     * @summary Get token's security and risk data.
     */
    tokenSecurityUsingGET_1(metadata) {
        return this.core.fetch('/api/v1/token_security/{chain_id}', 'get', metadata);
    }
    /**
     * Get address security information.
     *
     * @summary Check if the address is malicious
     */
    addressContractUsingGET_1(metadata) {
        return this.core.fetch('/api/v1/address_security/{address}', 'get', metadata);
    }
    /**
     * Get approval security information.
     *
     * @summary Check if the approval is secure
     */
    approvalContractUsingGET(metadata) {
        return this.core.fetch('/api/v1/approval_security/{chain_id}', 'get', metadata);
    }
    /**
     * Reports the outstanding token approvals issued to ERC-20 contracts by the given EOA
     * address and associated risk items, including the date that the approval was issued, the
     * allowance of the approval, and the transaction ID issuing the allowance.
     *
     * @summary Returns the ERC-20 approvals of an EOA address and associated risk items.
     */
    addressTokenApproveListUsingGET_1(metadata) {
        return this.core.fetch('/api/v2/token_approval_security/{chainId}', 'get', metadata);
    }
    /**
     * Reports the outstanding token approvals issued to ERC-721 contracts by the given EOA
     * address and associated risk items, including the date that the approval was issued, the
     * allowance of the approval, and the transaction ID issuing the allowance.
     *
     * @summary Returns the ERC-721 approvals of an EOA address and associated risk items.
     */
    addressNFT721ApproveListUsingGET_1(metadata) {
        return this.core.fetch('/api/v2/nft721_approval_security/{chainId}', 'get', metadata);
    }
    /**
     * Reports the outstanding token approvals issued to ERC-1155 contracts by the given EOA
     * address and associated risk items, including the date that the approval was issued, the
     * allowance of the approval, and the transaction ID issuing the allowance.
     *
     * @summary Returns the ERC-1155 approvals of an EOA address and associated risk items.
     */
    addressNFT1155ApproveListUsingGET_1(metadata) {
        return this.core.fetch('/api/v2/nft1155_approval_security/{chainId}', 'get', metadata);
    }
    /**
     * Get abi decode information.
     *
     * @summary Get abi decode info
     */
    getAbiDataInfoUsingPOST(body, metadata) {
        return this.core.fetch('/api/v1/abi/input_decode', 'post', body, metadata);
    }
    /**
     * Get NFT security information.
     *
     * @summary Get NFT's security and risk data.
     */
    getNftInfoUsingGET_1(metadata) {
        return this.core.fetch('/api/v1/nft_security/{chain_id}', 'get', metadata);
    }
    /**
     * Get risk of dApp by URL.
     *
     * @summary Check risk of dapp through URL
     */
    getDappInfoUsingGET(metadata) {
        return this.core.fetch('/api/v1/dapp_security', 'get', metadata);
    }
    /**
     * Check if the URL is a phishing site.
     *
     * @summary Check if the the url is a phishing site
     */
    phishingSiteUsingGET(metadata) {
        return this.core.fetch('/api/v1/phishing_site', 'get', metadata);
    }
    /**
     * Check if a contract has rug-pull risks (Beta).
     *
     * @summary Rug-pull Detection API Beta
     */
    getDefiInfoUsingGET(metadata) {
        return this.core.fetch('/api/v1/rugpull_detecting/{chain_id}', 'get', metadata);
    }
    /**
     * Token Security API for Solana (Beta).
     *
     * @summary Get token's security and risk data.
     */
    solanaTokenSecurityUsingGET(metadata) {
        return this.core.fetch('/api/v1/solana/token_security', 'get', metadata);
    }
    /**
     * Get access token.
     *
     * @summary get token
     */
    getAccessTokenUsingPOST(body) {
        return this.core.fetch('/api/v1/token', 'post', body);
    }
    /**
     * Solana prerun txn.
     *
     * @summary Check for potential risks in the transaction
     */
    prerunTxUsingPOST(body) {
        return this.core.fetch('/pis/api/v1/solana/pre_execution', 'post', body);
    }
    /**
     * Get token locker info.
     *
     * @summary Get token locker info
     */
    getTokenLockersUsingGET(metadata) {
        return this.core.fetch('/open/api/v1/locks/token', 'get', metadata);
    }
    /**
     * Get lpv3 locker info.
     *
     * @summary Get lpv3 locker info
     */
    getNftLockersUsingGET(metadata) {
        return this.core.fetch('/open/api/v1/locks/lpv3', 'get', metadata);
    }
}
const createSDK = (() => { return new SDK(); })();
export default createSDK;
