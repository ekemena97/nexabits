import type * as types from './types';
import type { ConfigOptions, FetchResponse } from 'api/dist/core';
import Oas from 'oas';
import APICore from 'api/dist/core';
declare class SDK {
    spec: Oas;
    core: APICore;
    constructor();
    /**
     * Optionally configure various options that the SDK allows.
     *
     * @param config Object of supported SDK options and toggles.
     * @param config.timeout Override the default `fetch` request timeout of 30 seconds. This number
     * should be represented in milliseconds.
     */
    config(config: ConfigOptions): void;
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
    auth(...values: string[] | number[]): this;
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
    server(url: string, variables?: {}): void;
    /**
     * Get supported blockchains.
     *
     * @summary Get the list of chains supported by different functions.
     */
    getChainsListUsingGET(metadata?: types.GetChainsListUsingGetMetadataParam): Promise<FetchResponse<200, types.GetChainsListUsingGetResponse200>>;
    /**
     * Get token security information.
     *
     * @summary Get token's security and risk data.
     */
    tokenSecurityUsingGET_1(metadata: types.TokenSecurityUsingGet1MetadataParam): Promise<FetchResponse<200, types.TokenSecurityUsingGet1Response200>>;
    /**
     * Get address security information.
     *
     * @summary Check if the address is malicious
     */
    addressContractUsingGET_1(metadata: types.AddressContractUsingGet1MetadataParam): Promise<FetchResponse<200, types.AddressContractUsingGet1Response200>>;
    /**
     * Get approval security information.
     *
     * @summary Check if the approval is secure
     */
    approvalContractUsingGET(metadata: types.ApprovalContractUsingGetMetadataParam): Promise<FetchResponse<200, types.ApprovalContractUsingGetResponse200>>;
    /**
     * Reports the outstanding token approvals issued to ERC-20 contracts by the given EOA
     * address and associated risk items, including the date that the approval was issued, the
     * allowance of the approval, and the transaction ID issuing the allowance.
     *
     * @summary Returns the ERC-20 approvals of an EOA address and associated risk items.
     */
    addressTokenApproveListUsingGET_1(metadata: types.AddressTokenApproveListUsingGet1MetadataParam): Promise<FetchResponse<200, types.AddressTokenApproveListUsingGet1Response200>>;
    /**
     * Reports the outstanding token approvals issued to ERC-721 contracts by the given EOA
     * address and associated risk items, including the date that the approval was issued, the
     * allowance of the approval, and the transaction ID issuing the allowance.
     *
     * @summary Returns the ERC-721 approvals of an EOA address and associated risk items.
     */
    addressNFT721ApproveListUsingGET_1(metadata: types.AddressNft721ApproveListUsingGet1MetadataParam): Promise<FetchResponse<200, types.AddressNft721ApproveListUsingGet1Response200>>;
    /**
     * Reports the outstanding token approvals issued to ERC-1155 contracts by the given EOA
     * address and associated risk items, including the date that the approval was issued, the
     * allowance of the approval, and the transaction ID issuing the allowance.
     *
     * @summary Returns the ERC-1155 approvals of an EOA address and associated risk items.
     */
    addressNFT1155ApproveListUsingGET_1(metadata: types.AddressNft1155ApproveListUsingGet1MetadataParam): Promise<FetchResponse<200, types.AddressNft1155ApproveListUsingGet1Response200>>;
    /**
     * Get abi decode information.
     *
     * @summary Get abi decode info
     */
    getAbiDataInfoUsingPOST(body: types.GetAbiDataInfoUsingPostBodyParam, metadata?: types.GetAbiDataInfoUsingPostMetadataParam): Promise<FetchResponse<200, types.GetAbiDataInfoUsingPostResponse200>>;
    /**
     * Get NFT security information.
     *
     * @summary Get NFT's security and risk data.
     */
    getNftInfoUsingGET_1(metadata: types.GetNftInfoUsingGet1MetadataParam): Promise<FetchResponse<200, types.GetNftInfoUsingGet1Response200>>;
    /**
     * Get risk of dApp by URL.
     *
     * @summary Check risk of dapp through URL
     */
    getDappInfoUsingGET(metadata?: types.GetDappInfoUsingGetMetadataParam): Promise<FetchResponse<200, types.GetDappInfoUsingGetResponse200>>;
    /**
     * Check if the URL is a phishing site.
     *
     * @summary Check if the the url is a phishing site
     */
    phishingSiteUsingGET(metadata: types.PhishingSiteUsingGetMetadataParam): Promise<FetchResponse<200, types.PhishingSiteUsingGetResponse200>>;
    /**
     * Check if a contract has rug-pull risks (Beta).
     *
     * @summary Rug-pull Detection API Beta
     */
    getDefiInfoUsingGET(metadata: types.GetDefiInfoUsingGetMetadataParam): Promise<FetchResponse<200, types.GetDefiInfoUsingGetResponse200>>;
    /**
     * Token Security API for Solana (Beta).
     *
     * @summary Get token's security and risk data.
     */
    solanaTokenSecurityUsingGET(metadata: types.SolanaTokenSecurityUsingGetMetadataParam): Promise<FetchResponse<200, types.SolanaTokenSecurityUsingGetResponse200>>;
    /**
     * Get access token.
     *
     * @summary get token
     */
    getAccessTokenUsingPOST(body: types.GetAccessTokenUsingPostBodyParam): Promise<FetchResponse<200, types.GetAccessTokenUsingPostResponse200>>;
    /**
     * Solana prerun txn.
     *
     * @summary Check for potential risks in the transaction
     */
    prerunTxUsingPOST(body: types.PrerunTxUsingPostBodyParam): Promise<FetchResponse<200, types.PrerunTxUsingPostResponse200>>;
    /**
     * Get token locker info.
     *
     * @summary Get token locker info
     */
    getTokenLockersUsingGET(metadata: types.GetTokenLockersUsingGetMetadataParam): Promise<FetchResponse<200, types.GetTokenLockersUsingGetResponse200>>;
    /**
     * Get lpv3 locker info.
     *
     * @summary Get lpv3 locker info
     */
    getNftLockersUsingGET(metadata: types.GetNftLockersUsingGetMetadataParam): Promise<FetchResponse<200, types.GetNftLockersUsingGetResponse200>>;
}
declare const createSDK: SDK;
export default createSDK;
