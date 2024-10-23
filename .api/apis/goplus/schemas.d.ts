declare const AddressContractUsingGet1: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly address: {
                    readonly type: "string";
                    readonly examples: readonly ["0x16Af29b7eFbf019ef30aae9023A5140c012374A5"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "address";
                };
            };
            readonly required: readonly ["address"];
        }, {
            readonly type: "object";
            readonly properties: {
                readonly chain_id: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "The chain_id of the blockchain.\n\"1\" means Ethereum; \n\"10\" means Optimism;\n\"25\" means Cronos;\n\"56\" means BSC;\n\"100\" means Gnosis;\n\"128\" means HECO; \n\"137\" means Polygon; \n\"250\" means Fantom;\n\"321\" means KCC;\n\"324\" means zkSync Era;\n\"201022\" means FON;\n\"42161\" means Arbitrum; \n\"43114\" means Avalanche;\n\"59144\" means Linea Mainnet;\n\"tron\" means Tron;\n\"534352\" means Scroll;\n\"204\" means opBNB;\n\"8453\" means Base;\n\"solana\" means Solana;\n Solana and Tron address are case-sensitive;";
                };
            };
            readonly required: readonly [];
        }, {
            readonly type: "object";
            readonly properties: {
                readonly Authorization: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Authorization (test: Bearer 81|9ihH8JzEuFu4MQ9DjWmH5WrNCPW...)";
                };
            };
            readonly required: readonly [];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly title: "ResponseWrapperAddressContract";
            readonly properties: {
                readonly code: {
                    readonly description: "Code 1: Success";
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly message: {
                    readonly description: "Response message";
                    readonly type: "string";
                };
                readonly result: {
                    readonly description: "Response result";
                    readonly type: "object";
                    readonly properties: {
                        readonly blacklist_doubt: {
                            readonly description: "It describes whether this address is suspected of malicious behavior.\n\"1\" means true;\n\"0\" means false.";
                            readonly type: "string";
                        };
                        readonly blackmail_activities: {
                            readonly description: "It describes whether this address has implemented blackmail activities.\n\"1\" means true;\n\"0\" means false.";
                            readonly type: "string";
                        };
                        readonly contract_address: {
                            readonly description: "It describes whether this address is a contract address.\n\"1\" means true;\n\"0\" means false.(Notice:If only the address is sent to the API and not the chain id, the \"contract_address\" will not be returned (This is because there are cases where the same address is a contract in one public chain but not in other public chains.) Determining the contract address is achieved by calling a third-party blockchain browser interface. Since it takes time for the browser interface to return, the field may be empty on the first request.\nSolution: the second call around 5s can return whether the address is the value of the contract normally.)";
                            readonly type: "string";
                        };
                        readonly cybercrime: {
                            readonly description: "It describes whether this address is involved in cybercrime.\n\"1\" means true;\n\"0\" means false.";
                            readonly type: "string";
                        };
                        readonly darkweb_transactions: {
                            readonly description: "It describes whether this address is involved in darkweb transactions.\n\"1\" means true;\n\"0\" means false.";
                            readonly type: "string";
                        };
                        readonly data_source: {
                            readonly description: "It describes the data source for this address information.\nFor example: GoPlus/SlowMist";
                            readonly type: "string";
                        };
                        readonly fake_kyc: {
                            readonly description: "It describes whether this address is involved in fake KYC.\n\"1\" means true;\n\"0\" means false.";
                            readonly type: "string";
                        };
                        readonly fake_standard_interface: {
                            readonly description: "It describes whether this contract contains standard interfaces that do not conform the requirements of the standard protocol.(Notice:Fake Standard Interface is mostly seen in scam assets.)";
                            readonly type: "string";
                        };
                        readonly fake_token: {
                            readonly description: "It indicates whether the token is a counterfeit of a mainstream asset.";
                            readonly type: "string";
                        };
                        readonly financial_crime: {
                            readonly description: "It describes whether this address is involved in financial crime.\n\"1\" means true;\n\"0\" means false.";
                            readonly type: "string";
                        };
                        readonly gas_abuse: {
                            readonly description: "It describes whether this address is cheating other user's gas fee to mint other assets.(Notice:Any interaction with such addresses may result in loss of property.)";
                            readonly type: "string";
                        };
                        readonly honeypot_related_address: {
                            readonly description: "It describes whether this address is related to honeypot tokens or has created scam tokens.\n\"1\" means true;\n\"0\" means false.(Notice:Addresses related to honeypot mean the creators or owners of the honeypot tokens.\nThis is a dangerous address if the address is ralated to honeypot tokens.)";
                            readonly type: "string";
                        };
                        readonly malicious_mining_activities: {
                            readonly description: "It describes whether this address is involved in malicious mining activities.\n\"1\" means true;\n\"0\" means false.";
                            readonly type: "string";
                        };
                        readonly mixer: {
                            readonly description: "It describes whether this address is coin mixer address.\n\"1\" means true;\n\"0\" means false.(Notice:Interacting with coin mixer may result in your address being added to the risk list of third-party institutions.)";
                            readonly type: "string";
                        };
                        readonly money_laundering: {
                            readonly description: "It describes whether this address is involved in money laundering.\n\"1\" means true;\n\"0\" means false.";
                            readonly type: "string";
                        };
                        readonly number_of_malicious_contracts_created: {
                            readonly description: "This parameter describes how many malicious contracts have been created by this address.";
                            readonly type: "string";
                        };
                        readonly phishing_activities: {
                            readonly description: "It describes whether this address has implemented phishing activities.\n\"1\" means true;\n\"0\" means false.";
                            readonly type: "string";
                        };
                        readonly reinit: {
                            readonly description: "It describes whether this address/contract has been deployed more than onces, and can be deployed again.(Notice:If a contract can be reinited, the developer can change the contract code whenever he wants.)";
                            readonly type: "string";
                        };
                        readonly sanctioned: {
                            readonly description: "It describes whether this address is coin sanctioned address.\n\"1\" means true;\n\"0\" means false.";
                            readonly type: "string";
                        };
                        readonly stealing_attack: {
                            readonly description: "It describes whether this address has implemented stealing attacks.\n\"1\" means true;\n\"0\" means false.";
                            readonly type: "string";
                        };
                    };
                };
            };
            readonly type: "object";
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const AddressNft1155ApproveListUsingGet1: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly chainId: {
                    readonly type: "string";
                    readonly examples: readonly ["1"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "chain id";
                };
            };
            readonly required: readonly ["chainId"];
        }, {
            readonly type: "object";
            readonly properties: {
                readonly addresses: {
                    readonly type: "string";
                    readonly examples: readonly ["0xd95dbdab08a9fed2d71ac9c3028aac40905d8cf3"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "contract address";
                };
            };
            readonly required: readonly ["addresses"];
        }, {
            readonly type: "object";
            readonly properties: {
                readonly Authorization: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Authorization (test: Bearer 81|9ihH8JzEuFu4MQ9DjWmH5WrNCPW...)";
                };
            };
            readonly required: readonly [];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly title: "ResponseWrapperListApproveNFT1155ListResponse";
            readonly properties: {
                readonly code: {
                    readonly description: "Code 1: Success";
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly message: {
                    readonly description: "Response message";
                    readonly type: "string";
                };
                readonly result: {
                    readonly description: "Response result";
                    readonly type: "array";
                    readonly items: {
                        readonly type: "object";
                        readonly title: "ApproveNFT1155ListResponse";
                        readonly properties: {
                            readonly approved_list: {
                                readonly type: "array";
                                readonly items: {
                                    readonly type: "object";
                                    readonly title: "ApproveErc1155Result";
                                    readonly properties: {
                                        readonly address_info: {
                                            readonly type: "object";
                                            readonly title: "ApproveAddressInfo";
                                            readonly properties: {
                                                readonly contract_name: {
                                                    readonly description: "Spender name";
                                                    readonly type: "string";
                                                };
                                                readonly creator_address: {
                                                    readonly description: "Spender's deployer";
                                                    readonly type: "string";
                                                };
                                                readonly deployed_time: {
                                                    readonly description: "Spender's deployed time";
                                                    readonly type: "integer";
                                                    readonly format: "int64";
                                                    readonly minimum: -9223372036854776000;
                                                    readonly maximum: 9223372036854776000;
                                                };
                                                readonly doubt_list: {
                                                    readonly description: "Whether the spender has a history of malicious behavior or contains high risk.";
                                                    readonly type: "integer";
                                                    readonly format: "int32";
                                                    readonly minimum: -2147483648;
                                                    readonly maximum: 2147483647;
                                                };
                                                readonly is_contract: {
                                                    readonly description: "Whether the spender is a contract.";
                                                    readonly type: "integer";
                                                    readonly format: "int32";
                                                    readonly minimum: -2147483648;
                                                    readonly maximum: 2147483647;
                                                };
                                                readonly is_open_source: {
                                                    readonly description: "Whether the spender is verified on blockchain explorer.";
                                                    readonly type: "integer";
                                                    readonly format: "int32";
                                                    readonly minimum: -2147483648;
                                                    readonly maximum: 2147483647;
                                                };
                                                readonly malicious_behavior: {
                                                    readonly description: "Specific malicious behaviors or risks of this spender.";
                                                    readonly type: "array";
                                                    readonly items: {
                                                        readonly type: "string";
                                                    };
                                                };
                                                readonly tag: {
                                                    readonly description: "Spender tag";
                                                    readonly type: "string";
                                                };
                                                readonly trust_list: {
                                                    readonly description: "Whether the spender is on the whitelist, and can be trusted";
                                                    readonly type: "integer";
                                                    readonly format: "int32";
                                                    readonly minimum: -2147483648;
                                                    readonly maximum: 2147483647;
                                                };
                                            };
                                        };
                                        readonly approved_contract: {
                                            readonly description: "Spender Address";
                                            readonly type: "string";
                                        };
                                        readonly approved_time: {
                                            readonly description: "Latest approval time";
                                            readonly type: "integer";
                                            readonly format: "int64";
                                            readonly minimum: -9223372036854776000;
                                            readonly maximum: 9223372036854776000;
                                        };
                                        readonly hash: {
                                            readonly description: "Latest approval hash";
                                            readonly type: "string";
                                        };
                                        readonly initial_approval_hash: {
                                            readonly description: "Initial approval hash";
                                            readonly type: "string";
                                        };
                                        readonly initial_approval_time: {
                                            readonly description: "Initial approval time";
                                            readonly type: "integer";
                                            readonly format: "int64";
                                            readonly minimum: -9223372036854776000;
                                            readonly maximum: 9223372036854776000;
                                        };
                                    };
                                };
                            };
                            readonly chain_id: {
                                readonly description: "ChainID";
                                readonly type: "string";
                            };
                            readonly is_open_source: {
                                readonly description: "Whether the contract is verified on blockchain explorer.";
                                readonly type: "integer";
                                readonly format: "int32";
                                readonly minimum: -2147483648;
                                readonly maximum: 2147483647;
                            };
                            readonly is_verified: {
                                readonly description: "Whether NFT is certified on a reputable trading platform.";
                                readonly type: "integer";
                                readonly format: "int32";
                                readonly minimum: -2147483648;
                                readonly maximum: 2147483647;
                            };
                            readonly malicious_address: {
                                readonly description: "Whether the NFT is malicious or contains high risk.";
                                readonly type: "integer";
                                readonly format: "int32";
                                readonly minimum: -2147483648;
                                readonly maximum: 2147483647;
                            };
                            readonly malicious_behavior: {
                                readonly description: "Specific malicious behaviors or risks of this NFT.";
                                readonly type: "array";
                                readonly items: {
                                    readonly type: "string";
                                };
                            };
                            readonly nft_address: {
                                readonly description: "NFT address";
                                readonly type: "string";
                            };
                            readonly nft_name: {
                                readonly description: "NFT name";
                                readonly type: "string";
                            };
                            readonly nft_symbol: {
                                readonly description: "NFT symbol";
                                readonly type: "string";
                            };
                        };
                    };
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const AddressNft721ApproveListUsingGet1: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly chainId: {
                    readonly type: "string";
                    readonly examples: readonly ["1"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "chain id";
                };
            };
            readonly required: readonly ["chainId"];
        }, {
            readonly type: "object";
            readonly properties: {
                readonly addresses: {
                    readonly type: "string";
                    readonly examples: readonly ["0xd95dbdab08a9fed2d71ac9c3028aac40905d8cf3"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "contract address";
                };
            };
            readonly required: readonly ["addresses"];
        }, {
            readonly type: "object";
            readonly properties: {
                readonly Authorization: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Authorization (test: Bearer 81|9ihH8JzEuFu4MQ9DjWmH5WrNCPW...)";
                };
            };
            readonly required: readonly [];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly title: "ResponseWrapperListApproveNFTListResponse";
            readonly properties: {
                readonly code: {
                    readonly description: "Code 1: Success";
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly message: {
                    readonly description: "Response message";
                    readonly type: "string";
                };
                readonly result: {
                    readonly description: "Response result";
                    readonly type: "array";
                    readonly items: {
                        readonly type: "object";
                        readonly title: "ApproveNFTListResponse";
                        readonly properties: {
                            readonly approved_list: {
                                readonly type: "array";
                                readonly items: {
                                    readonly type: "object";
                                    readonly title: "ApproveResult";
                                    readonly properties: {
                                        readonly address_info: {
                                            readonly type: "object";
                                            readonly title: "ApproveAddressInfo";
                                            readonly properties: {
                                                readonly contract_name: {
                                                    readonly description: "Spender name";
                                                    readonly type: "string";
                                                };
                                                readonly creator_address: {
                                                    readonly description: "Spender's deployer";
                                                    readonly type: "string";
                                                };
                                                readonly deployed_time: {
                                                    readonly description: "Spender's deployed time";
                                                    readonly type: "integer";
                                                    readonly format: "int64";
                                                    readonly minimum: -9223372036854776000;
                                                    readonly maximum: 9223372036854776000;
                                                };
                                                readonly doubt_list: {
                                                    readonly description: "Whether the spender has a history of malicious behavior or contains high risk.";
                                                    readonly type: "integer";
                                                    readonly format: "int32";
                                                    readonly minimum: -2147483648;
                                                    readonly maximum: 2147483647;
                                                };
                                                readonly is_contract: {
                                                    readonly description: "Whether the spender is a contract.";
                                                    readonly type: "integer";
                                                    readonly format: "int32";
                                                    readonly minimum: -2147483648;
                                                    readonly maximum: 2147483647;
                                                };
                                                readonly is_open_source: {
                                                    readonly description: "Whether the spender is verified on blockchain explorer.";
                                                    readonly type: "integer";
                                                    readonly format: "int32";
                                                    readonly minimum: -2147483648;
                                                    readonly maximum: 2147483647;
                                                };
                                                readonly malicious_behavior: {
                                                    readonly description: "Specific malicious behaviors or risks of this spender.";
                                                    readonly type: "array";
                                                    readonly items: {
                                                        readonly type: "string";
                                                    };
                                                };
                                                readonly tag: {
                                                    readonly description: "Spender tag";
                                                    readonly type: "string";
                                                };
                                                readonly trust_list: {
                                                    readonly description: "Whether the spender is on the whitelist, and can be trusted";
                                                    readonly type: "integer";
                                                    readonly format: "int32";
                                                    readonly minimum: -2147483648;
                                                    readonly maximum: 2147483647;
                                                };
                                            };
                                        };
                                        readonly approved_contract: {
                                            readonly description: "Spender Address";
                                            readonly type: "string";
                                        };
                                        readonly approved_for_all: {
                                            readonly description: "Approval type: \"1\" means \"approved for all\"; \"0\" means \"approved for single NFT\"";
                                            readonly type: "integer";
                                            readonly format: "int32";
                                            readonly minimum: -2147483648;
                                            readonly maximum: 2147483647;
                                        };
                                        readonly approved_time: {
                                            readonly description: "Latest approval time";
                                            readonly type: "integer";
                                            readonly format: "int64";
                                            readonly minimum: -9223372036854776000;
                                            readonly maximum: 9223372036854776000;
                                        };
                                        readonly approved_token_id: {
                                            readonly description: "NFT token_id";
                                            readonly type: "string";
                                        };
                                        readonly hash: {
                                            readonly description: "Latest approval hash";
                                            readonly type: "string";
                                        };
                                        readonly initial_approval_hash: {
                                            readonly description: "Initial approval hash";
                                            readonly type: "string";
                                        };
                                        readonly initial_approval_time: {
                                            readonly description: "Initial approval time";
                                            readonly type: "integer";
                                            readonly format: "int64";
                                            readonly minimum: -9223372036854776000;
                                            readonly maximum: 9223372036854776000;
                                        };
                                    };
                                };
                            };
                            readonly chain_id: {
                                readonly description: "ChainID";
                                readonly type: "string";
                            };
                            readonly is_open_source: {
                                readonly description: "Whether the contract is verified on blockchain explorer.";
                                readonly type: "integer";
                                readonly format: "int32";
                                readonly minimum: -2147483648;
                                readonly maximum: 2147483647;
                            };
                            readonly is_verified: {
                                readonly description: "Whether NFT is certified on a reputable trading platform.";
                                readonly type: "integer";
                                readonly format: "int32";
                                readonly minimum: -2147483648;
                                readonly maximum: 2147483647;
                            };
                            readonly malicious_address: {
                                readonly description: "Whether the NFT is malicious or contains high risk.";
                                readonly type: "integer";
                                readonly format: "int32";
                                readonly minimum: -2147483648;
                                readonly maximum: 2147483647;
                            };
                            readonly malicious_behavior: {
                                readonly description: "Specific malicious behaviors or risks of this NFT.";
                                readonly type: "array";
                                readonly items: {
                                    readonly type: "string";
                                };
                            };
                            readonly nft_address: {
                                readonly description: "nft address";
                                readonly type: "string";
                            };
                            readonly nft_name: {
                                readonly description: "NFT name";
                                readonly type: "string";
                            };
                            readonly nft_symbol: {
                                readonly description: "NFT symbol";
                                readonly type: "string";
                            };
                        };
                    };
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const AddressTokenApproveListUsingGet1: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly chainId: {
                    readonly type: "string";
                    readonly examples: readonly ["56"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "chain id";
                };
            };
            readonly required: readonly ["chainId"];
        }, {
            readonly type: "object";
            readonly properties: {
                readonly addresses: {
                    readonly type: "string";
                    readonly examples: readonly ["0x85f6be9460291e86e0fb49b07d0a83cc5f7206cd"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "contract address";
                };
            };
            readonly required: readonly ["addresses"];
        }, {
            readonly type: "object";
            readonly properties: {
                readonly Authorization: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Authorization (test: Bearer 81|9ihH8JzEuFu4MQ9DjWmH5WrNCPW...)";
                };
            };
            readonly required: readonly [];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly title: "ResponseWrapperListApproveTokenOutListResponse";
            readonly properties: {
                readonly code: {
                    readonly description: "Code 1: Success";
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly message: {
                    readonly description: "Response message";
                    readonly type: "string";
                };
                readonly result: {
                    readonly description: "Response result";
                    readonly type: "array";
                    readonly items: {
                        readonly type: "object";
                        readonly title: "ApproveTokenOutListResponse";
                        readonly properties: {
                            readonly approved_list: {
                                readonly type: "array";
                                readonly items: {
                                    readonly type: "object";
                                    readonly title: "ApproveTokenResult";
                                    readonly properties: {
                                        readonly address_info: {
                                            readonly type: "object";
                                            readonly title: "ApproveAddressInfo";
                                            readonly properties: {
                                                readonly contract_name: {
                                                    readonly description: "Spender name";
                                                    readonly type: "string";
                                                };
                                                readonly creator_address: {
                                                    readonly description: "Spender's deployer";
                                                    readonly type: "string";
                                                };
                                                readonly deployed_time: {
                                                    readonly description: "Spender's deployed time";
                                                    readonly type: "integer";
                                                    readonly format: "int64";
                                                    readonly minimum: -9223372036854776000;
                                                    readonly maximum: 9223372036854776000;
                                                };
                                                readonly doubt_list: {
                                                    readonly description: "Whether the spender has a history of malicious behavior or contains high risk.";
                                                    readonly type: "integer";
                                                    readonly format: "int32";
                                                    readonly minimum: -2147483648;
                                                    readonly maximum: 2147483647;
                                                };
                                                readonly is_contract: {
                                                    readonly description: "Whether the spender is a contract.";
                                                    readonly type: "integer";
                                                    readonly format: "int32";
                                                    readonly minimum: -2147483648;
                                                    readonly maximum: 2147483647;
                                                };
                                                readonly is_open_source: {
                                                    readonly description: "Whether the spender is verified on blockchain explorer.";
                                                    readonly type: "integer";
                                                    readonly format: "int32";
                                                    readonly minimum: -2147483648;
                                                    readonly maximum: 2147483647;
                                                };
                                                readonly malicious_behavior: {
                                                    readonly description: "Specific malicious behaviors or risks of this spender.";
                                                    readonly type: "array";
                                                    readonly items: {
                                                        readonly type: "string";
                                                    };
                                                };
                                                readonly tag: {
                                                    readonly description: "Spender tag";
                                                    readonly type: "string";
                                                };
                                                readonly trust_list: {
                                                    readonly description: "Whether the spender is on the whitelist, and can be trusted";
                                                    readonly type: "integer";
                                                    readonly format: "int32";
                                                    readonly minimum: -2147483648;
                                                    readonly maximum: 2147483647;
                                                };
                                            };
                                        };
                                        readonly approved_amount: {
                                            readonly description: "Allowance of the spender";
                                            readonly type: "string";
                                        };
                                        readonly approved_contract: {
                                            readonly description: "Spender Address";
                                            readonly type: "string";
                                        };
                                        readonly approved_time: {
                                            readonly description: "Latest approval time";
                                            readonly type: "integer";
                                            readonly format: "int64";
                                            readonly minimum: -9223372036854776000;
                                            readonly maximum: 9223372036854776000;
                                        };
                                        readonly hash: {
                                            readonly description: "Latest approval hash";
                                            readonly type: "string";
                                        };
                                        readonly initial_approval_hash: {
                                            readonly description: "Initial approval hash";
                                            readonly type: "string";
                                        };
                                        readonly initial_approval_time: {
                                            readonly description: "Initial approval time";
                                            readonly type: "integer";
                                            readonly format: "int64";
                                            readonly minimum: -9223372036854776000;
                                            readonly maximum: 9223372036854776000;
                                        };
                                    };
                                };
                            };
                            readonly balance: {
                                readonly description: "balance";
                                readonly type: "string";
                            };
                            readonly chain_id: {
                                readonly description: "ChainID";
                                readonly type: "string";
                            };
                            readonly decimals: {
                                readonly description: "decimals";
                                readonly type: "integer";
                            };
                            readonly is_open_source: {
                                readonly description: "Whether the contract is verified on blockchain explorer.";
                                readonly type: "integer";
                                readonly format: "int32";
                                readonly minimum: -2147483648;
                                readonly maximum: 2147483647;
                            };
                            readonly malicious_address: {
                                readonly description: "Whether the token is malicious or contains high risk.";
                                readonly type: "integer";
                                readonly format: "int32";
                                readonly minimum: -2147483648;
                                readonly maximum: 2147483647;
                            };
                            readonly malicious_behavior: {
                                readonly description: "Specific malicious behaviors or risks of this token.";
                                readonly type: "array";
                                readonly items: {
                                    readonly type: "string";
                                };
                            };
                            readonly token_address: {
                                readonly description: "Token address";
                                readonly type: "string";
                            };
                            readonly token_name: {
                                readonly description: "Token name";
                                readonly type: "string";
                            };
                            readonly token_symbol: {
                                readonly description: "Token symbol";
                                readonly type: "string";
                            };
                        };
                    };
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const ApprovalContractUsingGet: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly chain_id: {
                    readonly type: "string";
                    readonly examples: readonly ["1"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Chain id, (ETH: 1,  BSC: 56, OKC: 66, Heco: 128, Polygon: 137, Fantom:250, Arbitrum: 42161, Avalanche: 43114)";
                };
            };
            readonly required: readonly ["chain_id"];
        }, {
            readonly type: "object";
            readonly properties: {
                readonly contract_addresses: {
                    readonly type: "string";
                    readonly examples: readonly ["0x16Af29b7eFbf019ef30aae9023A5140c012374A5"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Contract needs to be detected";
                };
            };
            readonly required: readonly ["contract_addresses"];
        }, {
            readonly type: "object";
            readonly properties: {
                readonly Authorization: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Authorization (test: Bearer 81|9ihH8JzEuFu4MQ9DjWmH5WrNCPW...)";
                };
            };
            readonly required: readonly [];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly title: "ResponseWrapperContractApproveResponse";
            readonly properties: {
                readonly code: {
                    readonly description: "Code 1: Success";
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly message: {
                    readonly description: "Response message";
                    readonly type: "string";
                };
                readonly result: {
                    readonly type: "object";
                    readonly title: "ContractApproveResponse";
                    readonly properties: {
                        readonly contract_name: {
                            readonly description: "It describes the approved contract name.";
                            readonly type: "string";
                        };
                        readonly creator_address: {
                            readonly description: "It describes the creator address of the contract.(Notice:When the address is not a contract (\"is_contract\"=0), it will return \"null\".)";
                            readonly type: "string";
                        };
                        readonly deployed_time: {
                            readonly description: "It describes the deployed time of the contract.\nThe value is presented as a timestamp.\nExample: \"deployed_time\": 1626578345(Notice:When the address is not a contract (\"is_contract\"=0), it will return \"null\".)";
                            readonly type: "integer";
                            readonly format: "int64";
                            readonly minimum: -9223372036854776000;
                            readonly maximum: 9223372036854776000;
                        };
                        readonly doubt_list: {
                            readonly description: "It describes whether the address is a suspected malicious contract.\n\"1\" means true;\n\"0\" means that we have not found malicious behavior of this address.(Notice:Return \"0\" does not mean it is safe. Maybe we just haven't found its malicious behavior.)";
                            readonly type: "integer";
                            readonly format: "int32";
                            readonly minimum: -2147483648;
                            readonly maximum: 2147483647;
                        };
                        readonly is_contract: {
                            readonly description: "It describes whether the address is a contract.\n\"1\" means true;\n\"0\" means false.";
                            readonly type: "integer";
                            readonly format: "int32";
                            readonly minimum: -2147483648;
                            readonly maximum: 2147483647;
                        };
                        readonly is_open_source: {
                            readonly description: "It describes whether this contract is open source.\n\"1\" means true;\n\"0\" means false.(Notice:When the address is not a contract (\"is_contract\"=0), it will return \"null\".)";
                            readonly type: "integer";
                            readonly format: "int32";
                            readonly minimum: -2147483648;
                            readonly maximum: 2147483647;
                        };
                        readonly is_proxy: {
                            readonly description: "Whether the spender is a proxy contract.";
                            readonly type: "integer";
                            readonly format: "int32";
                            readonly minimum: -2147483648;
                            readonly maximum: 2147483647;
                        };
                        readonly malicious_behavior: {
                            readonly description: "It describes specific malicious behaviors.\n\"honeypot_related_address\" means that the address is related to honeypot tokens or has created scam tokens.\n\"phishing_activities\" means that this address has implemented phishing activities.\n\"blackmail_activities\" means that this address has implemented blackmail activities.\n\"stealing_attack\" means that this address has implemented stealing attacks.\n\"fake_kyc\" means that this address is involved in fake KYC.\n\"malicious_mining_activities\" means that this address is involved in malicious mining activities.\n\"darkweb_transactions\" means that this address is involved in darkweb transactions.\n\"cybercrime\" means that this address is involved in cybercrime.\n\"money_laundering\" means that this address is involved in money laundering.\n\"financial_crime\" means that this address is involved in financial crime.\n\"blacklist_doubt\" means that the address is suspected of malicious behavior and is therefore blacklisted.(Notice:Returning an empty array means that no malicious behavior was found at that address.)";
                            readonly type: "array";
                            readonly items: {
                                readonly type: "string";
                            };
                        };
                        readonly tag: {
                            readonly description: "It describes which dapp uses the contract.\nExample:\"tag\": \"Compound\"";
                            readonly type: "string";
                        };
                        readonly trust_list: {
                            readonly description: "It describes whether the address is a famous and trustworthy one.\n\"1\" means true;\n\"0\" means that we have not included this address in the trusted list;(Notice:Return \"0\" does not mean the address is not trustworthy. Maybe we just haven't included it yet.)";
                            readonly type: "integer";
                            readonly format: "int32";
                            readonly minimum: -2147483648;
                            readonly maximum: 2147483647;
                        };
                    };
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const GetAbiDataInfoUsingPost: {
    readonly body: {
        readonly type: "object";
        readonly title: "ParseAbiDataRequest";
        readonly required: readonly ["chain_id", "data"];
        readonly properties: {
            readonly chain_id: {
                readonly description: "Chain id, (ETH: 1, Cronos:25, BSC: 56, Heco: 128, Polygon: 137, Fantom:250, KCC: 321, Arbitrum: 42161, Avalanche: 43114)";
                readonly type: "string";
                readonly examples: readonly [56];
            };
            readonly contract_address: {
                readonly description: "Carrying the signer and contract address will help to decode more information.";
                readonly type: "string";
                readonly examples: readonly ["0x55d398326f99059ff775485246999027b3197955"];
            };
            readonly data: {
                readonly description: "Transaction input";
                readonly type: "string";
                readonly examples: readonly ["0xa9059cbb00000000000000000000000055d398326f99059ff775485246999027b319795500000000000000000000000000000000000000000000000acc749097d9d00000"];
            };
            readonly input: {
                readonly description: "input info";
                readonly type: "object";
                readonly additionalProperties: {
                    readonly type: "object";
                    readonly additionalProperties: true;
                };
            };
            readonly signer: {
                readonly description: "Carrying the signer and contract address will help to decode more information.";
                readonly type: "string";
            };
            readonly transcation_type: {
                readonly description: "Transaction type";
                readonly type: "string";
                readonly enum: readonly ["common", "eth_signTypedData_v4", "personal_sign", "eth_sign"];
            };
        };
        readonly $schema: "http://json-schema.org/draft-04/schema#";
    };
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly Authorization: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Authorization (test: Bearer 81|9ihH8JzEuFu4MQ9DjWmH5WrNCPW...)";
                };
            };
            readonly required: readonly [];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly title: "ResponseWrapperParseAbiDataResponse";
            readonly properties: {
                readonly code: {
                    readonly description: "Code 1: Success";
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly message: {
                    readonly description: "Response message";
                    readonly type: "string";
                };
                readonly result: {
                    readonly type: "object";
                    readonly title: "ParseAbiDataResponse";
                    readonly properties: {
                        readonly contract_description: {
                            readonly description: "Description of the contract.";
                            readonly type: "string";
                        };
                        readonly contract_name: {
                            readonly description: "The name of the contract that the user is interacting with.";
                            readonly type: "string";
                        };
                        readonly malicious_contract: {
                            readonly description: "It tells if contract that the user is interacting with is malicious contract.";
                            readonly type: "integer";
                            readonly format: "int32";
                            readonly minimum: -2147483648;
                            readonly maximum: 2147483647;
                        };
                        readonly method: {
                            readonly description: "It describes the method name in ABI, for example \"transfer\".";
                            readonly type: "string";
                        };
                        readonly params: {
                            readonly description: "It describes the parameter info";
                            readonly type: "array";
                            readonly items: {
                                readonly type: "object";
                                readonly title: "AbiParamInfo";
                                readonly properties: {
                                    readonly address_info: {
                                        readonly type: "object";
                                        readonly title: "AbiAddressInfo";
                                        readonly properties: {
                                            readonly contract_name: {
                                                readonly description: "It describes the contract name if the address is a contract.";
                                                readonly type: "string";
                                            };
                                            readonly is_contract: {
                                                readonly description: "It describes whether the address is a contract. \"1\" means true; \"0\" means false.";
                                                readonly type: "integer";
                                                readonly format: "int32";
                                                readonly minimum: -2147483648;
                                                readonly maximum: 2147483647;
                                            };
                                            readonly malicious_address: {
                                                readonly description: "It describes whether the address is a suspected malicious contract.\"1\" means true;\n\"0\" means that we have not found malicious behavior of this address.";
                                                readonly type: "integer";
                                                readonly format: "int32";
                                                readonly minimum: -2147483648;
                                                readonly maximum: 2147483647;
                                            };
                                            readonly name: {
                                                readonly description: "It describes the token name if the address is an ERC20 contract.";
                                                readonly type: "string";
                                            };
                                            readonly standard: {
                                                readonly description: "It describes the standard type of the contract.Example:\"erc20\".";
                                                readonly type: "string";
                                            };
                                            readonly symbol: {
                                                readonly description: "It describes the token symbol if the address is an ERC20 contract.";
                                                readonly type: "string";
                                            };
                                        };
                                    };
                                    readonly input: {
                                        readonly description: "It describes the input data in ABI.";
                                        readonly type: "object";
                                        readonly additionalProperties: true;
                                    };
                                    readonly name: {
                                        readonly description: "It describes the parameter name in ABI, for example \n \"_from\", \"_to\", \"_value\".";
                                        readonly type: "string";
                                    };
                                    readonly type: {
                                        readonly description: "It describes the parameter type in ABI, for example \"address\", \"uint256\", \"bool\".";
                                        readonly type: "string";
                                    };
                                };
                            };
                        };
                        readonly risk: {
                            readonly description: "It explains why the transaction that users are signing contains risk.(Notice:Even non-malicious, commonly used, well-known contracts can be highly risky if not used properly.)";
                            readonly type: "string";
                        };
                        readonly risky_signature: {
                            readonly description: "It tells if the transaction that users are signing contains risk.(Notice:Even non-malicious, commonly used, well-known contracts can be highly risky if not used properly.)";
                            readonly type: "integer";
                            readonly format: "int32";
                            readonly minimum: -2147483648;
                            readonly maximum: 2147483647;
                        };
                        readonly signature_detail: {
                            readonly description: "It explain the function of the method";
                            readonly type: "string";
                        };
                    };
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const GetAccessTokenUsingPost: {
    readonly body: {
        readonly type: "object";
        readonly title: "GetAccessTokenRequest";
        readonly required: readonly ["app_key", "sign", "time"];
        readonly properties: {
            readonly app_key: {
                readonly description: "app_key";
                readonly type: "string";
            };
            readonly sign: {
                readonly description: "Sign Method\nConcatenate app_key, time, app_secret in turn, and do sha1() .\nExample\napp_key = mBOMg20QW11BbtyH4Zh0\ntime = 1647847498\napp_secret = V6aRfxlPJwN3ViJSIFSCdxPvneajuJsh\nsign = sha1(mBOMg20QW11BbtyH4Zh01647847498V6aRfxlPJwN3ViJSIFSCdxPvneajuJsh)\n       = 7293d385b9225b3c3f232b76ba97255d0e21063e";
                readonly type: "string";
            };
            readonly time: {
                readonly description: "Quest timestamp (Second), should be within +-1000s around current timestamp";
                readonly type: "integer";
                readonly format: "int64";
                readonly minimum: -9223372036854776000;
                readonly maximum: 9223372036854776000;
            };
        };
        readonly $schema: "http://json-schema.org/draft-04/schema#";
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly title: "ResponseWrapperGetAccessTokenResponse";
            readonly properties: {
                readonly code: {
                    readonly description: "Code 1: Success";
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly message: {
                    readonly description: "Response message";
                    readonly type: "string";
                };
                readonly result: {
                    readonly type: "object";
                    readonly title: "GetAccessTokenResponse";
                    readonly properties: {
                        readonly access_token: {
                            readonly description: "access_token";
                            readonly type: "string";
                        };
                        readonly expires_in: {
                            readonly description: "expires_in";
                            readonly type: "integer";
                            readonly format: "int64";
                            readonly minimum: -9223372036854776000;
                            readonly maximum: 9223372036854776000;
                        };
                    };
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const GetChainsListUsingGet: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly name: {
                    readonly type: "string";
                    readonly enum: readonly ["token_security", "address_security", "approval_security", "token_approval_security", "nft721_approval_security", "nft1155_approval_security", "input_decode", "nft_security"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "API name.";
                };
            };
            readonly required: readonly [];
        }, {
            readonly type: "object";
            readonly properties: {
                readonly Authorization: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Authorization (test: Bearer 81|9ihH8JzEuFu4MQ9DjWmH5WrNCPW...)";
                };
            };
            readonly required: readonly [];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly title: "ResponseWrapperListGetChainsList";
            readonly properties: {
                readonly code: {
                    readonly description: "Code 1: Success";
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly message: {
                    readonly description: "Response message";
                    readonly type: "string";
                };
                readonly result: {
                    readonly description: "Response result";
                    readonly type: "array";
                    readonly items: {
                        readonly type: "object";
                        readonly properties: {
                            readonly id: {
                                readonly description: "chain id";
                                readonly type: "string";
                            };
                            readonly name: {
                                readonly description: "chain name";
                                readonly type: "string";
                            };
                        };
                    };
                };
            };
            readonly type: "object";
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const GetDappInfoUsingGet: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly url: {
                    readonly type: "string";
                    readonly examples: readonly ["https://www.0x.org"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Url or domain";
                };
            };
            readonly required: readonly [];
        }, {
            readonly type: "object";
            readonly properties: {
                readonly Authorization: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Authorization (test: Bearer 81|9ihH8JzEuFu4MQ9DjWmH5WrNCPW...)";
                };
            };
            readonly required: readonly [];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly title: "ResponseWrapperDappContractSecurityResponse";
            readonly properties: {
                readonly code: {
                    readonly description: "Code 1: Success";
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly message: {
                    readonly description: "Response message";
                    readonly type: "string";
                };
                readonly result: {
                    readonly type: "object";
                    readonly title: "DappContractSecurityResponse";
                    readonly properties: {
                        readonly audit_info: {
                            readonly description: "audit info(Notice:When the dApp was not audited, (\"is_audit\"=0), it will return \"null\".If there are multiple audit reports, the information of the latest audit report is displayed.)";
                            readonly type: "array";
                            readonly items: {
                                readonly type: "object";
                                readonly title: "AuditInfo";
                                readonly properties: {
                                    readonly audit_firm: {
                                        readonly description: "It describes the firm that audited the dApp.";
                                        readonly type: "string";
                                    };
                                    readonly audit_link: {
                                        readonly description: "It describes the website link of the audit report.";
                                        readonly type: "string";
                                    };
                                    readonly audit_time: {
                                        readonly description: "It describes the time shown in the latest audit report.";
                                        readonly type: "string";
                                    };
                                };
                            };
                        };
                        readonly contracts_security: {
                            readonly type: "array";
                            readonly items: {
                                readonly type: "object";
                                readonly title: "ContractsSecurity";
                                readonly properties: {
                                    readonly chain_id: {
                                        readonly description: "It describes the chains that contracts are deployed on;\"1\" means Ethereum;\n\"25\" means Cronos;\n\"56\" means BSC;\n\"128\" means HECO;\n\"137\" means Polygon;\n\"250\" means Fantom;\n\"42161\" means Arbitrum;\n\"43114\" means Avalanche.";
                                        readonly type: "string";
                                    };
                                    readonly contracts: {
                                        readonly description: "contract info";
                                        readonly type: "array";
                                        readonly items: {
                                            readonly type: "object";
                                            readonly title: "Contracts";
                                            readonly properties: {
                                                readonly contract_address: {
                                                    readonly description: "It describes the dAap's contract address.";
                                                    readonly type: "string";
                                                };
                                                readonly creator_address: {
                                                    readonly description: "It describes the creator address of the contract.";
                                                    readonly type: "string";
                                                };
                                                readonly deployment_time: {
                                                    readonly description: "It describes the deployed time of the contract.The value is presented as a timestamp.\nExample: \"deployed_time\": 1626578345";
                                                    readonly type: "integer";
                                                    readonly format: "int64";
                                                    readonly minimum: -9223372036854776000;
                                                    readonly maximum: 9223372036854776000;
                                                };
                                                readonly is_open_source: {
                                                    readonly description: "It describes whether this contract is open source.\n\"1\" means true;\n\"0\" means false.";
                                                    readonly type: "integer";
                                                    readonly format: "int32";
                                                    readonly minimum: -2147483648;
                                                    readonly maximum: 2147483647;
                                                };
                                                readonly malicious_behavior: {
                                                    readonly description: "It describes specific malicious behaviors of the contract.";
                                                    readonly type: "array";
                                                    readonly items: {
                                                        readonly type: "object";
                                                        readonly additionalProperties: true;
                                                    };
                                                };
                                                readonly malicious_contract: {
                                                    readonly description: "It describes whether the address is a suspected malicious contract.\n\"1\" means true;\n\"0\" means that we have not found malicious behavior of this contract.(Notice:\"malicious_contract\" return \"0\" does not mean the address is completely safe. Maybe we just haven't found its malicious behavior.)";
                                                    readonly type: "integer";
                                                    readonly format: "int32";
                                                    readonly minimum: -2147483648;
                                                    readonly maximum: 2147483647;
                                                };
                                                readonly malicious_creator: {
                                                    readonly description: "It describes whether the creator is a suspected malicious address.\n\"1\" means true;\n\"0\" means that we have not found malicious behavior of this address.(Notice:\"malicious_creator\" return \"0\" does not mean the address is completely safe. Maybe we just haven't found its malicious behavior.)";
                                                    readonly type: "integer";
                                                    readonly format: "int32";
                                                    readonly minimum: -2147483648;
                                                    readonly maximum: 2147483647;
                                                };
                                                readonly malicious_creator_behavior: {
                                                    readonly description: "It describes specific malicious behaviors of the contract creator.";
                                                    readonly type: "array";
                                                    readonly items: {
                                                        readonly type: "object";
                                                        readonly additionalProperties: true;
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                        readonly is_audit: {
                            readonly description: "It describes whether the dApp was audited by a reputable audit firm.\n\"1\" means true;\n\"0\" means that we have not found audit information for this dApp .(Notice:Return \"0\" does not mean the dApp was not audited. Maybe we just haven't found audit information for this dApp yet.)";
                            readonly type: "integer";
                            readonly format: "int32";
                            readonly minimum: -2147483648;
                            readonly maximum: 2147483647;
                        };
                        readonly project_name: {
                            readonly description: "It describes the dApp project name.";
                            readonly type: "string";
                        };
                        readonly trust_list: {
                            readonly description: "It describes whether the dapp is a famous and trustworthy one. \"1\" means true; \n\"0\" means that this dapp is not yet in our trusted list.(Notice:(1) Only \"trust_list\": \"1\" means it is a famous and trustworthy dapp. \n(2) \"0\" return doesn't mean it is risky.)";
                            readonly type: "integer";
                            readonly format: "int32";
                            readonly minimum: -2147483648;
                            readonly maximum: 2147483647;
                        };
                        readonly url: {
                            readonly description: "It describes the dApp's website link.";
                            readonly type: "string";
                        };
                    };
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const GetDefiInfoUsingGet: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly chain_id: {
                    readonly type: "string";
                    readonly examples: readonly ["1"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Chain id, (eth: 1, bsc: 56)";
                };
            };
            readonly required: readonly ["chain_id"];
        }, {
            readonly type: "object";
            readonly properties: {
                readonly contract_addresses: {
                    readonly type: "string";
                    readonly examples: readonly ["0x6B175474E89094C44Da98b954EedeAC495271d0F"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Defi protocol address";
                };
            };
            readonly required: readonly ["contract_addresses"];
        }, {
            readonly type: "object";
            readonly properties: {
                readonly Authorization: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Authorization (test: Bearer 81|9ihH8JzEuFu4MQ9DjWmH5WrNCPW...)";
                };
            };
            readonly required: readonly [];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly title: "GetDefiInfoResponse";
            readonly properties: {
                readonly code: {
                    readonly description: "Code 1: Success";
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly message: {
                    readonly description: "Response message";
                    readonly type: "string";
                };
                readonly result: {
                    readonly description: "Response result";
                    readonly type: "object";
                    readonly properties: {
                        readonly approval_abuse: {
                            readonly description: "It describes whether the owner can spend the allowance that obtained by the contract. If so, this function could potentially be abused to steal user assets.\n\"1\" means true; \n\"0\" means false;\n\"-1\" means unknown.";
                            readonly type: "integer";
                            readonly format: "int32";
                            readonly minimum: -2147483648;
                            readonly maximum: 2147483647;
                        };
                        readonly blacklist: {
                            readonly description: "It describes whether the contract has blacklist function that would block user from withdrawing their assets.\n\"1\" means true;\n\"0\" means false; \n\"-1\" means unknown.";
                            readonly type: "integer";
                            readonly format: "int32";
                            readonly minimum: -2147483648;
                            readonly maximum: 2147483647;
                        };
                        readonly contract_name: {
                            readonly description: "Name of the contract.";
                            readonly type: "string";
                        };
                        readonly is_open_source: {
                            readonly description: "It describes whether this contract is open source. \n\"1\" means true; \n\"0\" means false.";
                            readonly type: "integer";
                            readonly format: "int32";
                            readonly minimum: -2147483648;
                            readonly maximum: 2147483647;
                        };
                        readonly is_proxy: {
                            readonly description: "It describes whether this contract has a proxy contract. \n\"1\" means true; \n\"0\" means false;\n\"-1\" means unknown.";
                            readonly type: "integer";
                            readonly format: "int32";
                            readonly minimum: -2147483648;
                            readonly maximum: 2147483647;
                        };
                        readonly owner: {
                            readonly description: "When there is no owner function, or the ownership is unreadable or private, it would return empty.\n\"owner\": {  }";
                            readonly type: "object";
                            readonly properties: {
                                readonly owner_address: {
                                    readonly description: "owner address of the contract. \nNo return means unknown.";
                                    readonly type: "string";
                                };
                                readonly owner_name: {
                                    readonly description: "the function name of ownership. \nIf there is no return, means unknown.";
                                    readonly type: "string";
                                };
                                readonly owner_type: {
                                    readonly description: "blackhole\" : the owner is a blackhole address.\n\"contract\" : the owner is a contract.\n\"eoa\" : the owner is a common address (eoa).\n\"multi-address\": the owner is an array/list.\nnull: the address is not detected.\nNo return means unknown.";
                                    readonly type: "string";
                                };
                            };
                        };
                        readonly privilege_withdraw: {
                            readonly description: "It descirbes whether the contract owner can withdraw all the assets in the contract, without uses' permission.\n\"1\" means true;\n\"0\" means false; \n\"-1\" means unknown.";
                            readonly type: "integer";
                            readonly format: "int32";
                            readonly minimum: -2147483648;
                            readonly maximum: 2147483647;
                        };
                        readonly selfdestruct: {
                            readonly description: "It describes whether this contract can self destruct.\n\"1\" means true; \n\"0\" means false;\n\"-1\" means unknown.";
                            readonly type: "integer";
                            readonly format: "int32";
                            readonly minimum: -2147483648;
                            readonly maximum: 2147483647;
                        };
                        readonly withdraw_missing: {
                            readonly description: "It describes whether the contract lacks withdrawal method. If it is missing, users will be unable to withdraw the assets they have putted in.\n\"1\" means true;\n\"0\" means false; \n\"-1\" means unknown.";
                            readonly type: "integer";
                            readonly format: "int32";
                            readonly minimum: -2147483648;
                            readonly maximum: 2147483647;
                        };
                    };
                };
            };
            readonly type: "object";
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const GetNftInfoUsingGet1: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly chain_id: {
                    readonly type: "string";
                    readonly examples: readonly ["1"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "The chain_id of the blockchain.\"1\" means Ethereum; \"10\" means Optimism;\"25\" means Cronos;\"56\" means BSC;  \"100\" means Gnosis;\"128\" means HECO; \"137\" means Polygon; \"250\" means Fantom;\"321\" means KCC;\"324\" means zkSync Era; \"201022\" means FON;\"42161\" means Arbitrum; \"43114\" means Avalanche;\"59144\" means Linea Mainnet;\"8453\" Base;\"5000\" Mantle;";
                };
            };
            readonly required: readonly ["chain_id"];
        }, {
            readonly type: "object";
            readonly properties: {
                readonly contract_addresses: {
                    readonly type: "string";
                    readonly examples: readonly ["0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "NFT contract address";
                };
                readonly token_id: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "tokenId";
                };
            };
            readonly required: readonly ["contract_addresses"];
        }, {
            readonly type: "object";
            readonly properties: {
                readonly Authorization: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Authorization (test: Bearer 81|9ihH8JzEuFu4MQ9DjWmH5WrNCPW...)";
                };
            };
            readonly required: readonly [];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly title: "ResponseWrapperGetNftInfo";
            readonly properties: {
                readonly code: {
                    readonly description: "Code 1: Success";
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly message: {
                    readonly description: "Response message";
                    readonly type: "string";
                };
                readonly result: {
                    readonly description: "Response result";
                    readonly type: "object";
                    readonly properties: {
                        readonly average_price_24h: {
                            readonly description: "It describes the average price of the NFT in 24h.";
                            readonly type: "number";
                        };
                        readonly create_block_number: {
                            readonly description: "It describes the number of blocks created for the NFT.\nReturn \"null\" means that we didn't find the number of blocks created for the NFT.";
                            readonly type: "integer";
                            readonly format: "int64";
                            readonly minimum: -9223372036854776000;
                            readonly maximum: 9223372036854776000;
                        };
                        readonly creator_address: {
                            readonly description: "It describes the creator address of the NFT.\nExample: \"creator_address\": \"0x1ee0af784b96bb55ece98c9b15675726b0da1b6b\";\nReturn \"null\" means that we didn't find the creator address.";
                            readonly type: "string";
                        };
                        readonly discord_url: {
                            readonly description: "It describes the discord url of the NFT.\nReturn \"null\" means there is no discord url or didn't find the discord url.";
                            readonly type: "string";
                        };
                        readonly github_url: {
                            readonly description: "It describes the github url of the NFT.\nReturn \"null\" means there is no github url or didn't find the github url.";
                            readonly type: "string";
                        };
                        readonly highest_price: {
                            readonly description: "It describes the highest price of the NFT.";
                            readonly type: "number";
                        };
                        readonly lowest_price_24h: {
                            readonly description: "It describes the lowest price of the NFT in 24h.";
                            readonly type: "number";
                        };
                        readonly malicious_nft_contract: {
                            readonly description: "It describes whether this NFT has performed malicious behaviors.\n\"1\" means true;\n\"0\" means false.(Notice:Malicious behaviors include random additions, blacklist abuse, falsified transactions, and other high-risk behaviors. Interacting with NFTs flagged as Malicious may contain a high level of risk)";
                            readonly type: "integer";
                            readonly format: "int32";
                            readonly minimum: -2147483648;
                            readonly maximum: 2147483647;
                        };
                        readonly medium_url: {
                            readonly description: "It describes the medium url of the NFT.\nReturn \"null\" means there is no medium url or didn't find the medium url.";
                            readonly type: "string";
                        };
                        readonly metadata_frozen: {
                            readonly description: "metadata_frozen";
                            readonly type: "integer";
                            readonly format: "int32";
                            readonly minimum: -2147483648;
                            readonly maximum: 2147483647;
                        };
                        readonly nft_description: {
                            readonly description: "It describes the introduction of the NFT.\nReturn \"null\" means there is no description of the NFT.";
                            readonly type: "string";
                        };
                        readonly nft_erc: {
                            readonly description: "It describes the ERC protocol of the NFT.\nExample: \"nft_erc\": \"erc721\"";
                            readonly type: "string";
                        };
                        readonly nft_items: {
                            readonly description: "It describes the numbers of the NFT.";
                            readonly type: "integer";
                            readonly format: "int64";
                            readonly minimum: -9223372036854776000;
                            readonly maximum: 9223372036854776000;
                        };
                        readonly nft_name: {
                            readonly description: "nft_name";
                            readonly type: "string";
                        };
                        readonly nft_open_source: {
                            readonly description: "It describes whether this contract is open source. \n\"1\" means true; \n\"0\" means false.(Notice:Un-open-sourced contracts may hide various unknown mechanisms and are extremely risky. When the contract is not open source, we will not be able to detect other risk items.)";
                            readonly type: "integer";
                            readonly format: "int32";
                            readonly minimum: -2147483648;
                            readonly maximum: 2147483647;
                        };
                        readonly nft_owner_number: {
                            readonly description: "It describes the holders of the NFT.";
                            readonly type: "integer";
                            readonly format: "int64";
                            readonly minimum: -9223372036854776000;
                            readonly maximum: 9223372036854776000;
                        };
                        readonly nft_proxy: {
                            readonly description: "It describes whether this NFT contract has a proxy contract. \n\"1\" means true; \n\"0\" means false; \n\"Null\" means unknown.(Notice:(1) When \"is_open_source\": \"0\", it will return \"null\".\n(2) Most Proxy contracts are accompanied by modifiable implementation contracts, and implementation contracts may contain significant potential risk.)";
                            readonly type: "integer";
                            readonly format: "int32";
                            readonly minimum: -2147483648;
                            readonly maximum: 2147483647;
                        };
                        readonly nft_symbol: {
                            readonly description: "nft_symbol";
                            readonly type: "string";
                        };
                        readonly nft_verified: {
                            readonly description: "It describes whether the NFT is verified.\n\"1\" means that the NFT is verified;\n\"0\" means that we did not find any information about whether the NFT is verified.";
                            readonly type: "integer";
                            readonly format: "int32";
                            readonly minimum: -2147483648;
                            readonly maximum: 2147483647;
                        };
                        readonly oversupply_minting: {
                            readonly description: "It describes whether this NFT owner can bypass the maximum amount of minting specified in the contract, and continue to mint NFTs beyond this limit. \n\"1\" means true; \n\"0\" means false; \n\"Null\" means unknown.(Notice:Oversupply minting refers to the existence of a special mint method in the NFT contract - the owner can bypass the maximum amount of minting specified in the contract, and continue to mint NFTs beyond this limit.)";
                            readonly type: "integer";
                            readonly format: "int32";
                            readonly minimum: -2147483648;
                            readonly maximum: 2147483647;
                        };
                        readonly privileged_burn: {
                            readonly description: "It describes whether the NFT owner can burn others NFT.(Notice:Privileged_burn means that the owner can burn others' NFTs directly through the method.)";
                            readonly type: "object";
                            readonly properties: {
                                readonly owner_address: {
                                    readonly description: "Owner_address describes the owner address. \nnull: the owner address cannot be fetched.";
                                    readonly type: "string";
                                };
                                readonly owner_type: {
                                    readonly description: "\"blackhole\" : the owner is a blackhole address.\n\"contract\" : the owner is a contract.\n\"eoa\" : the owner is a common address (eoa).\n\"multi-address\": the owner is an array/list.\nnull: the address is not detected.";
                                    readonly type: "string";
                                };
                                readonly value: {
                                    readonly description: "The \"value\" describes the status of the risk.\nnull: the contract is not open source or there is a proxy, it is not possible to detect whether the risk exists. -1: the risk is detected but the ownership give up. If the detection of a code vulnerability, it can also be considered risk-free. \n0: the risk is not detected. \n1: the risk is detected, and the owner address is a common address (EOA), then it can be said that there is a clear risk. \n2: The risk is detected, but the owner address is a contract address, the risk is not significant. \n3: The risk is detected, but the owner address is not detectable / or an array.\n";
                                    readonly type: "integer";
                                    readonly format: "int32";
                                    readonly minimum: -2147483648;
                                    readonly maximum: 2147483647;
                                };
                            };
                        };
                        readonly privileged_minting: {
                            readonly description: "It describes whether the NFT contract has  minting methods which can only be triggered by an address with special privileges.\n(Notice:Some minting methods can only be triggered by an address with special privileges. Generally speaking, these are usually for the owner to mint.)";
                            readonly type: "object";
                            readonly properties: {
                                readonly owner_address: {
                                    readonly description: "Owner_address describes the owner address. \nnull: the owner address cannot be fetched.";
                                    readonly type: "string";
                                };
                                readonly owner_type: {
                                    readonly description: "\"blackhole\" : the owner is a blackhole address.\n\"contract\" : the owner is a contract.\n\"eoa\" : the owner is a common address (eoa).\n\"multi-address\": the owner is an array/list.\nnull: the address is not detected.";
                                    readonly type: "string";
                                };
                                readonly value: {
                                    readonly description: "The \"value\" describes the status of the risk.\nnull: the contract is not open source or there is a proxy, it is not possible to detect whether the risk exists. -1: the risk is detected but the ownership give up. If the detection of a code vulnerability, it can also be considered risk-free. \n0: the risk is not detected. \n1: the risk is detected, and the owner address is a common address (EOA), then it can be said that there is a clear risk. \n2: The risk is detected, but the owner address is a contract address, the risk is not significant. \n3: The risk is detected, but the owner address is not detectable / or an array.\n";
                                    readonly type: "integer";
                                    readonly format: "int32";
                                    readonly minimum: -2147483648;
                                    readonly maximum: 2147483647;
                                };
                            };
                        };
                        readonly red_check_mark: {
                            readonly description: "red check mark";
                            readonly type: "integer";
                            readonly format: "int32";
                            readonly minimum: -2147483648;
                            readonly maximum: 2147483647;
                        };
                        readonly restricted_approval: {
                            readonly description: "It describes whether the NFT contract can restrict the approval, resulting in NFT can not be traded on the NFT DEX.\n\"1\" means true; \n\"0\" means false; \n\"Null\" means unknown.(Notice:If this risk exists, it means that users will not be able to trade the NFT on the exchange and only privileged users in the whitelist will be able to trade normally.)";
                            readonly type: "integer";
                            readonly format: "int32";
                            readonly minimum: -2147483648;
                            readonly maximum: 2147483647;
                        };
                        readonly sales_24h: {
                            readonly description: "It describes the sales of the NFT in 24h.";
                            readonly type: "number";
                        };
                        readonly same_nfts: {
                            readonly description: "It describes the info of other NFTs with duplicate name and symbol.";
                            readonly type: "array";
                            readonly items: {
                                readonly type: "object";
                                readonly properties: {
                                    readonly create_block_number: {
                                        readonly description: "describes the number of blocks created for the NFT.\nReturn \"null\" means no NFTs with duplicate name and symbol.";
                                        readonly type: "integer";
                                        readonly format: "int64";
                                        readonly minimum: -9223372036854776000;
                                        readonly maximum: 9223372036854776000;
                                    };
                                    readonly nft_address: {
                                        readonly description: "It describes the address of the NFTs;";
                                        readonly type: "string";
                                    };
                                    readonly nft_name: {
                                        readonly description: "It describes the name of the NFT;";
                                        readonly type: "string";
                                    };
                                    readonly nft_owner_number: {
                                        readonly description: "It describes the holders of the NFT;";
                                        readonly type: "integer";
                                        readonly format: "int64";
                                        readonly minimum: -9223372036854776000;
                                        readonly maximum: 9223372036854776000;
                                    };
                                    readonly nft_symbol: {
                                        readonly description: "It describes the symbol of the NFT;";
                                        readonly type: "string";
                                    };
                                };
                            };
                        };
                        readonly self_destruct: {
                            readonly description: "{ value: owner_address: owner_type }It describes whether this NFT contract can self destruct.\n(Notice:When the self-destruct function is triggered, this contract will be destroyed, all functions will be unavailable, and all related assets will be erased.)";
                            readonly type: "object";
                            readonly properties: {
                                readonly owner_address: {
                                    readonly description: "Owner_address describes the owner address. \nnull: the owner address cannot be fetched.";
                                    readonly type: "string";
                                };
                                readonly owner_type: {
                                    readonly description: "\"blackhole\" : the owner is a blackhole address.\n\"contract\" : the owner is a contract.\n\"eoa\" : the owner is a common address (eoa).\n\"multi-address\": the owner is an array/list.\nnull: the address is not detected.";
                                    readonly type: "string";
                                };
                                readonly value: {
                                    readonly description: "The \"value\" describes the status of the risk.\nnull: the contract is not open source or there is a proxy, it is not possible to detect whether the risk exists. -1: the risk is detected but the ownership give up. If the detection of a code vulnerability, it can also be considered risk-free. \n0: the risk is not detected. \n1: the risk is detected, and the owner address is a common address (EOA), then it can be said that there is a clear risk. \n2: The risk is detected, but the owner address is a contract address, the risk is not significant. \n3: The risk is detected, but the owner address is not detectable / or an array.\n";
                                    readonly type: "integer";
                                    readonly format: "int32";
                                    readonly minimum: -2147483648;
                                    readonly maximum: 2147483647;
                                };
                            };
                        };
                        readonly telegram_url: {
                            readonly description: "It describes the telegram url of the NFT.\nReturn \"null\" means there is no telegram url or didn't find the telegram url.";
                            readonly type: "string";
                        };
                        readonly token_id: {
                            readonly description: "token_id";
                            readonly type: "string";
                        };
                        readonly token_owner: {
                            readonly description: "token_owner";
                            readonly type: "string";
                        };
                        readonly total_volume: {
                            readonly description: "It describes the total volume of the NFT.";
                            readonly type: "number";
                        };
                        readonly traded_volume_24h: {
                            readonly description: "It describes the trading volume of the NFT in 24h.";
                            readonly type: "number";
                        };
                        readonly transfer_without_approval: {
                            readonly description: "It describes whether the NFT owner can transfer NFT without approval.(Notice:Transfer_without_approval generally means the scammer does not need to get approvals to transfer another address's NFT.\nOne typical example is sleep_minting. Sleep_minting means that the scammer will first add the NFT to a well-known wallet address and then retrieve the NFT. After the value of the NFT has appreciated , it will be put back on the market.)";
                            readonly type: "object";
                            readonly properties: {
                                readonly owner_address: {
                                    readonly description: "Owner_address describes the owner address. \nnull: the owner address cannot be fetched.";
                                    readonly type: "string";
                                };
                                readonly owner_type: {
                                    readonly description: "\"blackhole\" : the owner is a blackhole address.\n\"contract\" : the owner is a contract.\n\"eoa\" : the owner is a common address (eoa).\n\"multi-address\": the owner is an array/list.\nnull: the address is not detected.";
                                    readonly type: "string";
                                };
                                readonly value: {
                                    readonly description: "The \"value\" describes the status of the risk.\nnull: the contract is not open source or there is a proxy, it is not possible to detect whether the risk exists. -1: the risk is detected but the ownership give up. If the detection of a code vulnerability, it can also be considered risk-free. \n0: the risk is not detected. \n1: the risk is detected, and the owner address is a common address (EOA), then it can be said that there is a clear risk. \n2: The risk is detected, but the owner address is a contract address, the risk is not significant. \n3: The risk is detected, but the owner address is not detectable / or an array.\n";
                                    readonly type: "integer";
                                    readonly format: "int32";
                                    readonly minimum: -2147483648;
                                    readonly maximum: 2147483647;
                                };
                            };
                        };
                        readonly trust_list: {
                            readonly description: "It describes whether the NFT is a famous and trustworthy one.\n\"1\" means true; \nReturn \"null\" means no result.(Notice:(1) Only \"trust_list\": \"1\" means it is a famous and trustworthy NFT.\n(2) Return \"null\" doesn't mean it is risky.Th)";
                            readonly type: "integer";
                            readonly format: "int32";
                            readonly minimum: -2147483648;
                            readonly maximum: 2147483647;
                        };
                        readonly twitter_url: {
                            readonly description: "It describes the twitter url of the NFT.\nReturn \"null\" means there is no twitter url or didn't find the twitter url.";
                            readonly type: "string";
                        };
                        readonly website_url: {
                            readonly description: "It describes the website url of the NFT.\nReturn \"null\" means there is no website url or didn't find the website url.";
                            readonly type: "string";
                        };
                    };
                };
            };
            readonly type: "object";
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const GetNftLockersUsingGet: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly chainId: {
                    readonly type: "string";
                    readonly default: "56";
                    readonly examples: readonly ["56"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "chainId";
                };
                readonly pageNum: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly default: 1;
                    readonly examples: readonly [1];
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "pageNum";
                };
                readonly pageSize: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly default: 100;
                    readonly examples: readonly [100];
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "pageSize";
                };
                readonly poolAddress: {
                    readonly type: "string";
                    readonly default: "0x579df956c6cE6178fBBD78bbE4f05786cFBA9B76";
                    readonly examples: readonly ["0x579df956c6cE6178fBBD78bbE4f05786cFBA9B76"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "poolAddress";
                };
            };
            readonly required: readonly ["chainId", "pageNum", "pageSize", "poolAddress"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly title: "ResponseWrapperNftLockerResponse";
            readonly properties: {
                readonly code: {
                    readonly description: "Code 1：Success";
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly message: {
                    readonly description: "Response message";
                    readonly type: "string";
                };
                readonly result: {
                    readonly type: "object";
                    readonly title: "NftLockerResponse";
                    readonly properties: {
                        readonly list: {
                            readonly type: "array";
                            readonly items: {
                                readonly description: "Token NFT Lock 信息表";
                                readonly type: "object";
                                readonly title: "TaNftLockerLockInfoobject";
                                readonly properties: {
                                    readonly endTime: {
                                        readonly description: "解锁时间戳";
                                        readonly type: "integer";
                                        readonly format: "int32";
                                        readonly minimum: -2147483648;
                                        readonly maximum: 2147483647;
                                    };
                                    readonly lockId: {
                                        readonly description: "lock id";
                                        readonly type: "string";
                                    };
                                    readonly nftId: {
                                        readonly description: "nft id";
                                        readonly type: "string";
                                    };
                                    readonly nftPositionManager: {
                                        readonly description: "nft Position Manager";
                                        readonly type: "string";
                                    };
                                    readonly owner: {
                                        readonly description: "用户地址 address";
                                        readonly type: "string";
                                    };
                                    readonly pool: {
                                        readonly description: "pool address";
                                        readonly type: "string";
                                    };
                                    readonly startTime: {
                                        readonly description: "开始时间戳";
                                        readonly type: "integer";
                                        readonly format: "int32";
                                        readonly minimum: -2147483648;
                                        readonly maximum: 2147483647;
                                    };
                                };
                            };
                        };
                        readonly totalCount: {
                            readonly type: "integer";
                            readonly format: "int32";
                            readonly minimum: -2147483648;
                            readonly maximum: 2147483647;
                        };
                    };
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const GetTokenLockersUsingGet: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly chainId: {
                    readonly type: "string";
                    readonly default: "8453";
                    readonly examples: readonly ["8453"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "chainId";
                };
                readonly pageNum: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly default: 1;
                    readonly examples: readonly [1];
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "pageNum";
                };
                readonly pageSize: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly default: 100;
                    readonly examples: readonly [100];
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "pageSize";
                };
                readonly tokenAddress: {
                    readonly type: "string";
                    readonly default: "0x6fd0303649296360f10c07b24521deda9223086d";
                    readonly examples: readonly ["0x6fd0303649296360f10c07b24521deda9223086d"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "tokenAddress";
                };
            };
            readonly required: readonly ["chainId", "pageNum", "pageSize", "tokenAddress"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly title: "ResponseWrapperTokenLockerResponse";
            readonly properties: {
                readonly code: {
                    readonly description: "Code 1：Success";
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly message: {
                    readonly description: "Response message";
                    readonly type: "string";
                };
                readonly result: {
                    readonly type: "object";
                    readonly title: "TokenLockerResponse";
                    readonly properties: {
                        readonly list: {
                            readonly type: "array";
                            readonly items: {
                                readonly description: "Token Locker Lock 信息表";
                                readonly type: "object";
                                readonly title: "TaTokenLockerLockInfoobject";
                                readonly properties: {
                                    readonly amount: {
                                        readonly description: "累计总锁仓数量";
                                        readonly type: "string";
                                    };
                                    readonly endTime: {
                                        readonly description: "解锁时间戳";
                                        readonly type: "integer";
                                        readonly format: "int32";
                                        readonly minimum: -2147483648;
                                        readonly maximum: 2147483647;
                                    };
                                    readonly isLpToken: {
                                        readonly description: "是否为lp token -1:未知、0:否、1:是";
                                        readonly type: "integer";
                                        readonly format: "int32";
                                        readonly minimum: -2147483648;
                                        readonly maximum: 2147483647;
                                    };
                                    readonly lockId: {
                                        readonly description: "lock id";
                                        readonly type: "string";
                                    };
                                    readonly owner: {
                                        readonly description: "用户地址 address";
                                        readonly type: "string";
                                    };
                                    readonly startTime: {
                                        readonly description: "开始时间戳";
                                        readonly type: "integer";
                                        readonly format: "int32";
                                        readonly minimum: -2147483648;
                                        readonly maximum: 2147483647;
                                    };
                                    readonly token: {
                                        readonly description: "token contract address";
                                        readonly type: "string";
                                    };
                                    readonly unlockedAmount: {
                                        readonly description: "已解锁数量";
                                        readonly type: "string";
                                    };
                                };
                            };
                        };
                        readonly totalCount: {
                            readonly type: "integer";
                            readonly format: "int32";
                            readonly minimum: -2147483648;
                            readonly maximum: 2147483647;
                        };
                    };
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const PhishingSiteUsingGet: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly url: {
                    readonly type: "string";
                    readonly examples: readonly ["go-ethdenver.com"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Url";
                };
            };
            readonly required: readonly ["url"];
        }, {
            readonly type: "object";
            readonly properties: {
                readonly Authorization: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Authorization (test: Bearer 81|9ihH8JzEuFu4MQ9DjWmH5WrNCPW...)";
                };
            };
            readonly required: readonly [];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly title: "ResponseWrapperPhishingSite";
            readonly properties: {
                readonly code: {
                    readonly description: "Code 1：Success";
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly message: {
                    readonly description: "Response message";
                    readonly type: "string";
                };
                readonly result: {
                    readonly description: "Response result";
                    readonly type: "object";
                    readonly properties: {
                        readonly phishing_site: {
                            readonly description: "It means whether the website is a phishing site.\n\"1\" means true;\n\"0\" means that we have not found malicious behavior of this website.";
                            readonly type: "integer";
                            readonly format: "int32";
                            readonly minimum: -2147483648;
                            readonly maximum: 2147483647;
                        };
                        readonly website_contract_security: {
                            readonly type: "array";
                            readonly items: {
                                readonly type: "object";
                                readonly properties: {
                                    readonly address_risk: {
                                        readonly description: "address risk";
                                        readonly type: "array";
                                        readonly items: {
                                            readonly type: "string";
                                        };
                                    };
                                    readonly contract: {
                                        readonly description: "contract address";
                                        readonly type: "string";
                                    };
                                    readonly is_contract: {
                                        readonly description: "It describes whether the holder is a contract \"1\" means true; \"0\" means false.";
                                        readonly type: "integer";
                                        readonly format: "int32";
                                        readonly minimum: -2147483648;
                                        readonly maximum: 2147483647;
                                    };
                                    readonly is_open_source: {
                                        readonly description: "It describes whether this contract is open source. \n\"1\" means true; \n\"0\" means false.(Notice:Un-open-sourced contracts may hide various unknown mechanisms and are extremely risky. When the contract is not open source, we will not be able to detect other risk items.)";
                                        readonly type: "integer";
                                        readonly format: "int32";
                                        readonly minimum: -2147483648;
                                        readonly maximum: 2147483647;
                                    };
                                    readonly nft_risk: {
                                        readonly description: "nft check risk";
                                        readonly type: "object";
                                        readonly properties: {
                                            readonly nft_open_source: {
                                                readonly description: "It describes whether this contract is open source. \n\"1\" means true; \n\"0\" means false.(Notice:Un-open-sourced contracts may hide various unknown mechanisms and are extremely risky. When the contract is not open source, we will not be able to detect other risk items.)";
                                                readonly type: "integer";
                                                readonly format: "int32";
                                                readonly minimum: -2147483648;
                                                readonly maximum: 2147483647;
                                            };
                                            readonly nft_proxy: {
                                                readonly description: "It describes whether this NFT contract has a proxy contract. \n\"1\" means true; \n\"0\" means false; \n\"Null\" means unknown.(Notice:(1) When \"is_open_source\":\"0\", it will return \"null\".\n(2) Most Proxy contracts are accompanied by modifiable implementation contracts, and implementation contracts may contain significant potential risk.)";
                                                readonly type: "integer";
                                                readonly format: "int32";
                                                readonly minimum: -2147483648;
                                                readonly maximum: 2147483647;
                                            };
                                            readonly oversupply_minting: {
                                                readonly description: "It describes whether this NFT owner can bypass the maximum amount of minting specified in the contract, and continue to mint NFTs beyond this limit. \n\"1\" means true; \n\"0\" means false; \n\"Null\" means unknown.(Notice:Oversupply minting refers to the existence of a special mint method in the NFT contract - the owner can bypass the maximum amount of minting specified in the contract, and continue to mint NFTs beyond this limit.)";
                                                readonly type: "integer";
                                                readonly format: "int32";
                                                readonly minimum: -2147483648;
                                                readonly maximum: 2147483647;
                                            };
                                            readonly privileged_burn: {
                                                readonly description: "It describes whether the NFT owner can burn others NFT.(Notice:Privileged_burn means that the owner can burn others' NFTs directly through the method.)";
                                                readonly type: "object";
                                                readonly properties: {
                                                    readonly owner_address: {
                                                        readonly description: "Owner_address describes the owner address. \nnull: the owner address cannot be fetched.";
                                                        readonly type: "string";
                                                    };
                                                    readonly owner_type: {
                                                        readonly description: "\"blackhole\" : the owner is a blackhole address.\n\"contract\" : the owner is a contract.\n\"eoa\" : the owner is a common address (eoa).\n\"multi-address\":the owner is an array/list.\nnull: the address is not detected.";
                                                        readonly type: "string";
                                                    };
                                                    readonly value: {
                                                        readonly description: "The \"value\" describes the status of the risk.\nnull: the contract is not open source or there is a proxy, it is not possible to detect whether the risk exists. -1: the risk is detected but the ownership give up. If the detection of a code vulnerability, it can also be considered risk-free. \n0: the risk is not detected. \n1: the risk is detected, and the owner address is a common address (EOA), then it can be said that there is a clear risk. \n2: The risk is detected, but the owner address is a contract address, the risk is not significant. \n3: The risk is detected, but the owner address is not detectable / or an array.\n";
                                                        readonly type: "integer";
                                                        readonly format: "int32";
                                                        readonly minimum: -2147483648;
                                                        readonly maximum: 2147483647;
                                                    };
                                                };
                                            };
                                            readonly privileged_minting: {
                                                readonly description: "It describes whether the NFT contract has  minting methods which can only be triggered by an address with special privileges.\n(Notice:Some minting methods can only be triggered by an address with special privileges. Generally speaking, these are usually for the owner to mint.)";
                                                readonly type: "object";
                                                readonly properties: {
                                                    readonly owner_address: {
                                                        readonly description: "Owner_address describes the owner address. \nnull: the owner address cannot be fetched.";
                                                        readonly type: "string";
                                                    };
                                                    readonly owner_type: {
                                                        readonly description: "\"blackhole\" : the owner is a blackhole address.\n\"contract\" : the owner is a contract.\n\"eoa\" : the owner is a common address (eoa).\n\"multi-address\":the owner is an array/list.\nnull: the address is not detected.";
                                                        readonly type: "string";
                                                    };
                                                    readonly value: {
                                                        readonly description: "The \"value\" describes the status of the risk.\nnull: the contract is not open source or there is a proxy, it is not possible to detect whether the risk exists. -1: the risk is detected but the ownership give up. If the detection of a code vulnerability, it can also be considered risk-free. \n0: the risk is not detected. \n1: the risk is detected, and the owner address is a common address (EOA), then it can be said that there is a clear risk. \n2: The risk is detected, but the owner address is a contract address, the risk is not significant. \n3: The risk is detected, but the owner address is not detectable / or an array.\n";
                                                        readonly type: "integer";
                                                        readonly format: "int32";
                                                        readonly minimum: -2147483648;
                                                        readonly maximum: 2147483647;
                                                    };
                                                };
                                            };
                                            readonly restricted_approval: {
                                                readonly description: "It describes whether the NFT contract can restrict the approval, resulting in NFT can not be traded on the NFT DEX.\n\"1\" means true; \n\"0\" means false; \n\"Null\" means unknown.(Notice:If this risk exists, it means that users will not be able to trade the NFT on the exchange and only privileged users in the whitelist will be able to trade normally.)";
                                                readonly type: "integer";
                                                readonly format: "int32";
                                                readonly minimum: -2147483648;
                                                readonly maximum: 2147483647;
                                            };
                                            readonly self_destruct: {
                                                readonly description: "{ value: owner_address: owner_type }It describes whether this NFT contract can self destruct.\n(Notice:When the self-destruct function is triggered, this contract will be destroyed, all functions will be unavailable, and all related assets will be erased.)";
                                                readonly type: "object";
                                                readonly properties: {
                                                    readonly owner_address: {
                                                        readonly description: "Owner_address describes the owner address. \nnull: the owner address cannot be fetched.";
                                                        readonly type: "string";
                                                    };
                                                    readonly owner_type: {
                                                        readonly description: "\"blackhole\" : the owner is a blackhole address.\n\"contract\" : the owner is a contract.\n\"eoa\" : the owner is a common address (eoa).\n\"multi-address\":the owner is an array/list.\nnull: the address is not detected.";
                                                        readonly type: "string";
                                                    };
                                                    readonly value: {
                                                        readonly description: "The \"value\" describes the status of the risk.\nnull: the contract is not open source or there is a proxy, it is not possible to detect whether the risk exists. -1: the risk is detected but the ownership give up. If the detection of a code vulnerability, it can also be considered risk-free. \n0: the risk is not detected. \n1: the risk is detected, and the owner address is a common address (EOA), then it can be said that there is a clear risk. \n2: The risk is detected, but the owner address is a contract address, the risk is not significant. \n3: The risk is detected, but the owner address is not detectable / or an array.\n";
                                                        readonly type: "integer";
                                                        readonly format: "int32";
                                                        readonly minimum: -2147483648;
                                                        readonly maximum: 2147483647;
                                                    };
                                                };
                                            };
                                            readonly transfer_without_approval: {
                                                readonly description: "It describes whether the NFT owner can transfer NFT without approval.(Notice:Transfer_without_approval generally means the scammer does not need to get approvals to transfer another address's NFT.\nOne typical example is sleep_minting. Sleep_minting means that the scammer will first add the NFT to a well-known wallet address and then retrieve the NFT. After the value of the NFT has appreciated , it will be put back on the market.)";
                                                readonly type: "object";
                                                readonly properties: {
                                                    readonly owner_address: {
                                                        readonly description: "Owner_address describes the owner address. \nnull: the owner address cannot be fetched.";
                                                        readonly type: "string";
                                                    };
                                                    readonly owner_type: {
                                                        readonly description: "\"blackhole\" : the owner is a blackhole address.\n\"contract\" : the owner is a contract.\n\"eoa\" : the owner is a common address (eoa).\n\"multi-address\":the owner is an array/list.\nnull: the address is not detected.";
                                                        readonly type: "string";
                                                    };
                                                    readonly value: {
                                                        readonly description: "The \"value\" describes the status of the risk.\nnull: the contract is not open source or there is a proxy, it is not possible to detect whether the risk exists. -1: the risk is detected but the ownership give up. If the detection of a code vulnerability, it can also be considered risk-free. \n0: the risk is not detected. \n1: the risk is detected, and the owner address is a common address (EOA), then it can be said that there is a clear risk. \n2: The risk is detected, but the owner address is a contract address, the risk is not significant. \n3: The risk is detected, but the owner address is not detectable / or an array.\n";
                                                        readonly type: "integer";
                                                        readonly format: "int32";
                                                        readonly minimum: -2147483648;
                                                        readonly maximum: 2147483647;
                                                    };
                                                };
                                            };
                                        };
                                    };
                                    readonly standard: {
                                        readonly description: "contract type(erc20, erc721, erc1155)";
                                        readonly type: "string";
                                    };
                                };
                            };
                        };
                    };
                };
            };
            readonly type: "object";
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const PrerunTxUsingPost: {
    readonly body: {
        readonly type: "object";
        readonly title: "SolanaPrerunTxRequest";
        readonly properties: {
            readonly encoded_transaction: {
                readonly type: "string";
            };
        };
        readonly $schema: "http://json-schema.org/draft-04/schema#";
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly title: "ResponseWrapperSolanaPrerunTxResponse";
            readonly properties: {
                readonly code: {
                    readonly description: "Code 1：Success";
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly message: {
                    readonly description: "Response message";
                    readonly type: "string";
                };
                readonly result: {
                    readonly type: "object";
                    readonly title: "SolanaPrerunTxResponse";
                    readonly properties: {
                        readonly allowance_upgrades: {
                            readonly type: "array";
                            readonly items: {
                                readonly type: "object";
                                readonly title: "SolanaAllowanceUpgrade";
                                readonly properties: {
                                    readonly decimals: {
                                        readonly type: "integer";
                                        readonly format: "int32";
                                        readonly minimum: -2147483648;
                                        readonly maximum: 2147483647;
                                    };
                                    readonly mint: {
                                        readonly type: "string";
                                    };
                                    readonly name: {
                                        readonly type: "string";
                                    };
                                    readonly new_allowances: {
                                        readonly type: "array";
                                        readonly items: {
                                            readonly type: "object";
                                            readonly title: "NewAllowance";
                                            readonly properties: {
                                                readonly allowance_change: {
                                                    readonly type: "string";
                                                };
                                                readonly owner: {
                                                    readonly type: "string";
                                                };
                                                readonly post_amount: {
                                                    readonly type: "string";
                                                };
                                                readonly pre_amount: {
                                                    readonly type: "string";
                                                };
                                                readonly risky_spender: {
                                                    readonly type: "integer";
                                                    readonly format: "int32";
                                                    readonly minimum: -2147483648;
                                                    readonly maximum: 2147483647;
                                                };
                                                readonly spender: {
                                                    readonly type: "string";
                                                };
                                            };
                                        };
                                    };
                                    readonly symbol: {
                                        readonly type: "string";
                                    };
                                };
                            };
                        };
                        readonly asset_changes: {
                            readonly type: "object";
                            readonly title: "SolanaTxAssetChanges";
                            readonly properties: {
                                readonly nft_changes: {
                                    readonly type: "array";
                                    readonly items: {
                                        readonly type: "object";
                                        readonly title: "SolanaTxAssetChange";
                                        readonly properties: {
                                            readonly change_detail: {
                                                readonly type: "array";
                                                readonly items: {
                                                    readonly type: "object";
                                                    readonly title: "SolanaTxChangeDetail";
                                                    readonly properties: {
                                                        readonly address: {
                                                            readonly type: "string";
                                                        };
                                                        readonly amount_changes: {
                                                            readonly type: "string";
                                                        };
                                                        readonly from_address: {
                                                            readonly type: "integer";
                                                            readonly format: "int32";
                                                            readonly minimum: -2147483648;
                                                            readonly maximum: 2147483647;
                                                        };
                                                        readonly owner: {
                                                            readonly type: "string";
                                                        };
                                                        readonly post_amount: {
                                                            readonly type: "string";
                                                        };
                                                        readonly pre_amount: {
                                                            readonly type: "string";
                                                        };
                                                        readonly risky_address: {
                                                            readonly type: "integer";
                                                            readonly format: "int32";
                                                            readonly minimum: -2147483648;
                                                            readonly maximum: 2147483647;
                                                        };
                                                    };
                                                };
                                            };
                                            readonly decimals: {
                                                readonly type: "integer";
                                                readonly format: "int32";
                                                readonly minimum: -2147483648;
                                                readonly maximum: 2147483647;
                                            };
                                            readonly mint: {
                                                readonly type: "string";
                                            };
                                            readonly name: {
                                                readonly type: "string";
                                            };
                                            readonly symbol: {
                                                readonly type: "string";
                                            };
                                        };
                                    };
                                };
                                readonly sol_changes: {
                                    readonly type: "array";
                                    readonly items: {
                                        readonly type: "object";
                                        readonly title: "SolanaTxSolChange";
                                        readonly properties: {
                                            readonly address: {
                                                readonly type: "string";
                                            };
                                            readonly from_address: {
                                                readonly type: "integer";
                                                readonly format: "int32";
                                                readonly minimum: -2147483648;
                                                readonly maximum: 2147483647;
                                            };
                                            readonly lamport_changes: {
                                                readonly type: "string";
                                            };
                                            readonly post_lamports: {
                                                readonly type: "string";
                                            };
                                            readonly pre_lamports: {
                                                readonly type: "string";
                                            };
                                            readonly risky_address: {
                                                readonly type: "integer";
                                                readonly format: "int32";
                                                readonly minimum: -2147483648;
                                                readonly maximum: 2147483647;
                                            };
                                        };
                                    };
                                };
                                readonly token_changes: {
                                    readonly type: "array";
                                    readonly items: {
                                        readonly type: "object";
                                        readonly title: "SolanaTxAssetChange";
                                        readonly properties: {
                                            readonly change_detail: {
                                                readonly type: "array";
                                                readonly items: {
                                                    readonly type: "object";
                                                    readonly title: "SolanaTxChangeDetail";
                                                    readonly properties: {
                                                        readonly address: {
                                                            readonly type: "string";
                                                        };
                                                        readonly amount_changes: {
                                                            readonly type: "string";
                                                        };
                                                        readonly from_address: {
                                                            readonly type: "integer";
                                                            readonly format: "int32";
                                                            readonly minimum: -2147483648;
                                                            readonly maximum: 2147483647;
                                                        };
                                                        readonly owner: {
                                                            readonly type: "string";
                                                        };
                                                        readonly post_amount: {
                                                            readonly type: "string";
                                                        };
                                                        readonly pre_amount: {
                                                            readonly type: "string";
                                                        };
                                                        readonly risky_address: {
                                                            readonly type: "integer";
                                                            readonly format: "int32";
                                                            readonly minimum: -2147483648;
                                                            readonly maximum: 2147483647;
                                                        };
                                                    };
                                                };
                                            };
                                            readonly decimals: {
                                                readonly type: "integer";
                                                readonly format: "int32";
                                                readonly minimum: -2147483648;
                                                readonly maximum: 2147483647;
                                            };
                                            readonly mint: {
                                                readonly type: "string";
                                            };
                                            readonly name: {
                                                readonly type: "string";
                                            };
                                            readonly symbol: {
                                                readonly type: "string";
                                            };
                                        };
                                    };
                                };
                            };
                        };
                        readonly error: {
                            readonly type: "string";
                        };
                        readonly input: {
                            readonly type: "string";
                        };
                        readonly logs: {
                            readonly type: "array";
                            readonly items: {
                                readonly type: "string";
                            };
                        };
                        readonly ownership_changes: {
                            readonly type: "array";
                            readonly items: {
                                readonly type: "object";
                                readonly title: "SolanaOwnershipChange";
                                readonly properties: {
                                    readonly decimals: {
                                        readonly type: "integer";
                                        readonly format: "int32";
                                        readonly minimum: -2147483648;
                                        readonly maximum: 2147483647;
                                    };
                                    readonly mint: {
                                        readonly type: "string";
                                    };
                                    readonly name: {
                                        readonly type: "string";
                                    };
                                    readonly owner_changed: {
                                        readonly type: "string";
                                    };
                                    readonly post_owner: {
                                        readonly type: "string";
                                    };
                                    readonly pre_owner: {
                                        readonly type: "string";
                                    };
                                    readonly risky_post_owner: {
                                        readonly type: "integer";
                                        readonly format: "int32";
                                        readonly minimum: -2147483648;
                                        readonly maximum: 2147483647;
                                    };
                                    readonly symbol: {
                                        readonly type: "string";
                                    };
                                };
                            };
                        };
                        readonly risk_detail: {
                            readonly type: "array";
                            readonly items: {
                                readonly type: "string";
                            };
                        };
                        readonly risk_type: {
                            readonly type: "array";
                            readonly items: {
                                readonly type: "integer";
                                readonly format: "int32";
                                readonly minimum: -2147483648;
                                readonly maximum: 2147483647;
                            };
                        };
                        readonly risky_txn: {
                            readonly type: "string";
                        };
                        readonly sender: {
                            readonly type: "string";
                        };
                        readonly slot_height: {
                            readonly type: "integer";
                            readonly format: "int64";
                            readonly minimum: -9223372036854776000;
                            readonly maximum: 9223372036854776000;
                        };
                        readonly transaction_fee: {
                            readonly type: "string";
                        };
                    };
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const SolanaTokenSecurityUsingGet: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly contract_addresses: {
                    readonly type: "string";
                    readonly examples: readonly ["HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "The contract address of solana tokens.";
                };
            };
            readonly required: readonly ["contract_addresses"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly title: "ResponseWrapperSolanaTokenSecurity";
            readonly properties: {
                readonly code: {
                    readonly description: "Code 1：Success";
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly message: {
                    readonly description: "Response message";
                    readonly type: "string";
                };
                readonly result: {
                    readonly description: "Response result";
                    readonly type: "object";
                    readonly additionalProperties: {
                        readonly description: "key is contract address";
                        readonly type: "object";
                        readonly properties: {
                            readonly balance_mutable_authority: {
                                readonly description: "Whether the developer can temper with users token balance.";
                                readonly type: "object";
                                readonly properties: {
                                    readonly authority: {
                                        readonly description: "Information on metadata upgrade authority.";
                                        readonly type: "array";
                                        readonly items: {
                                            readonly type: "object";
                                            readonly properties: {
                                                readonly address: {
                                                    readonly description: "Address with upgrade authority";
                                                    readonly type: "string";
                                                };
                                                readonly malicious_address: {
                                                    readonly description: "Indicates whether the address is malicious, \"1\" means yes.";
                                                    readonly type: "integer";
                                                    readonly format: "int32";
                                                    readonly minimum: -2147483648;
                                                    readonly maximum: 2147483647;
                                                };
                                            };
                                        };
                                    };
                                    readonly status: {
                                        readonly description: "Status indicator, where \"1\" means the funtcion is available.";
                                        readonly type: "string";
                                    };
                                };
                            };
                            readonly closable: {
                                readonly description: "Whether the developer can close the token programme at any time. If the programme is closed, all the assets would be eliminated.";
                                readonly type: "object";
                                readonly properties: {
                                    readonly authority: {
                                        readonly description: "Information on metadata upgrade authority.";
                                        readonly type: "array";
                                        readonly items: {
                                            readonly type: "object";
                                            readonly properties: {
                                                readonly address: {
                                                    readonly description: "Address with upgrade authority";
                                                    readonly type: "string";
                                                };
                                                readonly malicious_address: {
                                                    readonly description: "Indicates whether the address is malicious, \"1\" means yes.";
                                                    readonly type: "integer";
                                                    readonly format: "int32";
                                                    readonly minimum: -2147483648;
                                                    readonly maximum: 2147483647;
                                                };
                                            };
                                        };
                                    };
                                    readonly status: {
                                        readonly description: "Status indicator, where \"1\" means the funtcion is available.";
                                        readonly type: "string";
                                    };
                                };
                            };
                            readonly creator: {
                                readonly description: "Contains information about the token creators.";
                                readonly type: "array";
                                readonly items: {
                                    readonly type: "object";
                                    readonly properties: {
                                        readonly address: {
                                            readonly description: "Address of the creator.";
                                            readonly type: "string";
                                        };
                                        readonly malicious_address: {
                                            readonly description: "Indicates whether the address is malicious, \"1\" means yes.";
                                            readonly type: "integer";
                                            readonly format: "int32";
                                            readonly minimum: -2147483648;
                                            readonly maximum: 2147483647;
                                        };
                                    };
                                };
                            };
                            readonly default_account_state: {
                                readonly description: "The default state of newly created accounts. \"0\" for Uninitialized, \"1\" for Initialized, \"2\" for Frozen.(Notice: Uninitialized (0): The token is newly created and not ready for use. It cannot perform any token operations and typically needs to be initialized to become active.\nInitialized (1): The token is fully ready for use and can engage in normal token transactions. Most token operations require the account to be in this state.\nFrozen (2): All the account that created whe the token is \"frozen\" would be locked and prohibited from performing any token transactions or operations, usually for security or compliance reasons, until it is manually unfrozen.)";
                                readonly type: "string";
                            };
                            readonly default_account_state_upgradable: {
                                readonly description: "whether the default account state can be upgradable.";
                                readonly type: "object";
                                readonly properties: {
                                    readonly authority: {
                                        readonly description: "Information on metadata upgrade authority.";
                                        readonly type: "array";
                                        readonly items: {
                                            readonly type: "object";
                                            readonly properties: {
                                                readonly address: {
                                                    readonly description: "Address with upgrade authority";
                                                    readonly type: "string";
                                                };
                                                readonly malicious_address: {
                                                    readonly description: "Indicates whether the address is malicious, \"1\" means yes.";
                                                    readonly type: "integer";
                                                    readonly format: "int32";
                                                    readonly minimum: -2147483648;
                                                    readonly maximum: 2147483647;
                                                };
                                            };
                                        };
                                    };
                                    readonly status: {
                                        readonly description: "Status indicator, where \"1\" means the funtcion is available.";
                                        readonly type: "string";
                                    };
                                };
                            };
                            readonly dex: {
                                readonly description: "Dex Info";
                                readonly type: "array";
                                readonly items: {
                                    readonly type: "object";
                                    readonly properties: {
                                        readonly day: {
                                            readonly description: "Trading data for last day.";
                                            readonly type: "object";
                                            readonly properties: {
                                                readonly price_max: {
                                                    readonly description: "Maximum price during this period.";
                                                    readonly type: "string";
                                                };
                                                readonly price_min: {
                                                    readonly description: "Minimum price during this period.";
                                                    readonly type: "string";
                                                };
                                                readonly volume: {
                                                    readonly description: "The volume of transactions during this period.";
                                                    readonly type: "string";
                                                };
                                            };
                                        };
                                        readonly dex_name: {
                                            readonly description: "Name of the DEX.";
                                            readonly type: "string";
                                        };
                                        readonly fee_rate: {
                                            readonly description: "Transaction fee rate.";
                                            readonly type: "string";
                                        };
                                        readonly id: {
                                            readonly description: "Address of the liquidity pool.";
                                            readonly type: "string";
                                        };
                                        readonly lp_amount: {
                                            readonly description: "Total amount of liquidity provider tokens, only shown when type is \"standard\"";
                                            readonly type: "string";
                                        };
                                        readonly month: {
                                            readonly description: "Trading data for last month.";
                                            readonly type: "object";
                                            readonly properties: {
                                                readonly price_max: {
                                                    readonly description: "Maximum price during this period.";
                                                    readonly type: "string";
                                                };
                                                readonly price_min: {
                                                    readonly description: "Minimum price during this period.";
                                                    readonly type: "string";
                                                };
                                                readonly volume: {
                                                    readonly description: "The volume of transactions during this period.";
                                                    readonly type: "string";
                                                };
                                            };
                                        };
                                        readonly open_time: {
                                            readonly description: "The epoch when trading is opened.";
                                            readonly type: "string";
                                        };
                                        readonly price: {
                                            readonly description: "Current price (Unitless, count by two tokens in the pool).";
                                            readonly type: "string";
                                        };
                                        readonly tvl: {
                                            readonly description: "Total value locked (TVL) in the liquidity pool.";
                                            readonly type: "string";
                                        };
                                        readonly type: {
                                            readonly description: "Type of the DEX, could be \"standard\" or \"concentrated\".";
                                            readonly type: "string";
                                        };
                                        readonly week: {
                                            readonly description: "Trading data for last week.";
                                            readonly type: "object";
                                            readonly properties: {
                                                readonly price_max: {
                                                    readonly description: "Maximum price during this period.";
                                                    readonly type: "string";
                                                };
                                                readonly price_min: {
                                                    readonly description: "Minimum price during this period.";
                                                    readonly type: "string";
                                                };
                                                readonly volume: {
                                                    readonly description: "The volume of transactions during this period.";
                                                    readonly type: "string";
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                            readonly freezable: {
                                readonly description: "Whether the developer can block any other users from trading.";
                                readonly type: "object";
                                readonly properties: {
                                    readonly authority: {
                                        readonly description: "Information on metadata upgrade authority.";
                                        readonly type: "array";
                                        readonly items: {
                                            readonly type: "object";
                                            readonly properties: {
                                                readonly address: {
                                                    readonly description: "Address with upgrade authority";
                                                    readonly type: "string";
                                                };
                                                readonly malicious_address: {
                                                    readonly description: "Indicates whether the address is malicious, \"1\" means yes.";
                                                    readonly type: "integer";
                                                    readonly format: "int32";
                                                    readonly minimum: -2147483648;
                                                    readonly maximum: 2147483647;
                                                };
                                            };
                                        };
                                    };
                                    readonly status: {
                                        readonly description: "Status indicator, where \"1\" means the funtcion is available.";
                                        readonly type: "string";
                                    };
                                };
                            };
                            readonly holders: {
                                readonly description: "List of top 10 addresses holding the token and their balances.";
                                readonly type: "array";
                                readonly items: {
                                    readonly type: "object";
                                    readonly properties: {
                                        readonly balance: {
                                            readonly description: "Amount of tokens held.";
                                            readonly type: "string";
                                        };
                                        readonly percent: {
                                            readonly description: "Percentage of total supply held.";
                                            readonly type: "string";
                                        };
                                        readonly tag: {
                                            readonly description: "Tag information of the holder.";
                                            readonly type: "string";
                                        };
                                        readonly token_account: {
                                            readonly description: "Address of the holder.";
                                            readonly type: "string";
                                        };
                                    };
                                };
                            };
                            readonly lp_holders: {
                                readonly description: "List of top10 liquidity holders and their balances of the largest main token(SOL, USDC, USDT) liquidity pool.";
                                readonly type: "array";
                                readonly items: {
                                    readonly type: "object";
                                    readonly properties: {
                                        readonly balance: {
                                            readonly description: "Amount of tokens held.";
                                            readonly type: "string";
                                        };
                                        readonly percent: {
                                            readonly description: "Percentage of total supply held.";
                                            readonly type: "string";
                                        };
                                        readonly tag: {
                                            readonly description: "Tag information of the holder.";
                                            readonly type: "string";
                                        };
                                        readonly token_account: {
                                            readonly description: "Address of the holder.";
                                            readonly type: "string";
                                        };
                                    };
                                };
                            };
                            readonly metadata: {
                                readonly description: "Contains the metadata information of the token.";
                                readonly type: "object";
                                readonly properties: {
                                    readonly description: {
                                        readonly description: "Description of the token.";
                                        readonly type: "string";
                                    };
                                    readonly name: {
                                        readonly description: "Name of the token.";
                                        readonly type: "string";
                                    };
                                    readonly symbol: {
                                        readonly description: "Symbol of the token.";
                                        readonly type: "string";
                                    };
                                    readonly uri: {
                                        readonly description: "URI pointing to related token information.";
                                        readonly type: "string";
                                    };
                                };
                            };
                            readonly metadata_mutable: {
                                readonly description: "Whether the metadata is mutable.";
                                readonly type: "object";
                                readonly properties: {
                                    readonly metadata_upgrade_authority: {
                                        readonly description: "Information on metadata upgrade authority.";
                                        readonly type: "array";
                                        readonly items: {
                                            readonly type: "object";
                                            readonly properties: {
                                                readonly address: {
                                                    readonly description: "Address with upgrade authority";
                                                    readonly type: "string";
                                                };
                                                readonly malicious_address: {
                                                    readonly description: "Indicates whether the address is malicious, \"1\" means yes.";
                                                    readonly type: "integer";
                                                    readonly format: "int32";
                                                    readonly minimum: -2147483648;
                                                    readonly maximum: 2147483647;
                                                };
                                            };
                                        };
                                    };
                                    readonly status: {
                                        readonly description: "Status indicator, where \"1\" means the funtcion is available.";
                                        readonly type: "string";
                                    };
                                };
                            };
                            readonly mintable: {
                                readonly description: "Whether the token is mintable.";
                                readonly type: "object";
                                readonly properties: {
                                    readonly authority: {
                                        readonly description: "Information on metadata upgrade authority.";
                                        readonly type: "array";
                                        readonly items: {
                                            readonly type: "object";
                                            readonly properties: {
                                                readonly address: {
                                                    readonly description: "Address with upgrade authority";
                                                    readonly type: "string";
                                                };
                                                readonly malicious_address: {
                                                    readonly description: "Indicates whether the address is malicious, \"1\" means yes.";
                                                    readonly type: "integer";
                                                    readonly format: "int32";
                                                    readonly minimum: -2147483648;
                                                    readonly maximum: 2147483647;
                                                };
                                            };
                                        };
                                    };
                                    readonly status: {
                                        readonly description: "Status indicator, where \"1\" means the funtcion is available.";
                                        readonly type: "string";
                                    };
                                };
                            };
                            readonly none_transferable: {
                                readonly description: "Indicates whether the token is non-transferable, \"1\" means non-transferable, \"0\" means transferable";
                                readonly type: "string";
                            };
                            readonly transfer_fee: {
                                readonly description: "Configuration information for transfer fees.(Notice: \"Scheduled Fee\" would take effect and turn into \"Current Fee\" when the epoch is reached.)";
                                readonly type: "object";
                                readonly properties: {
                                    readonly current_fee_rate: {
                                        readonly description: "Currently effective transfer fee rate.";
                                        readonly type: "object";
                                        readonly properties: {
                                            readonly fee_rate: {
                                                readonly description: "Fee rate (expressed as a ratio, e.g., 0.02 means 2%)";
                                                readonly type: "string";
                                            };
                                            readonly maximum_fee: {
                                                readonly description: "Maximum fee amount for a single transaction.";
                                                readonly type: "string";
                                            };
                                        };
                                    };
                                    readonly scheduled_fee_rate: {
                                        readonly description: "Scheduled changes to transfer fee rates.";
                                        readonly type: "array";
                                        readonly items: {
                                            readonly type: "object";
                                            readonly properties: {
                                                readonly epoch: {
                                                    readonly description: "The epoch at which the fee rate will take effect.";
                                                    readonly type: "string";
                                                };
                                                readonly fee_rate: {
                                                    readonly description: "Fee rate (expressed as a ratio, e.g., 0.02 means 2%)";
                                                    readonly type: "string";
                                                };
                                                readonly maximum_fee: {
                                                    readonly description: "Maximum fee amount for a single transaction.";
                                                    readonly type: "string";
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                            readonly transfer_fee_upgradable: {
                                readonly description: "Whether the transfer fee of the token can be upgraded";
                                readonly type: "object";
                                readonly properties: {
                                    readonly authority: {
                                        readonly description: "Information on metadata upgrade authority.";
                                        readonly type: "array";
                                        readonly items: {
                                            readonly type: "object";
                                            readonly properties: {
                                                readonly address: {
                                                    readonly description: "Address with upgrade authority";
                                                    readonly type: "string";
                                                };
                                                readonly malicious_address: {
                                                    readonly description: "Indicates whether the address is malicious, \"1\" means yes.";
                                                    readonly type: "integer";
                                                    readonly format: "int32";
                                                    readonly minimum: -2147483648;
                                                    readonly maximum: 2147483647;
                                                };
                                            };
                                        };
                                    };
                                    readonly status: {
                                        readonly description: "Status indicator, where \"1\" means the funtcion is available.";
                                        readonly type: "string";
                                    };
                                };
                            };
                            readonly transfer_hook: {
                                readonly description: "If there is any external hook in the token programme.(Notice: Hook may block user from trading)";
                                readonly type: "array";
                                readonly items: {
                                    readonly type: "object";
                                    readonly properties: {
                                        readonly address: {
                                            readonly description: "Address of the hook.";
                                            readonly type: "string";
                                        };
                                        readonly malicious_address: {
                                            readonly description: "Indicates whether the address is malicious, \"1\" means yes.";
                                            readonly type: "integer";
                                            readonly format: "int32";
                                            readonly minimum: -2147483648;
                                            readonly maximum: 2147483647;
                                        };
                                    };
                                };
                            };
                            readonly transfer_hook_upgradable: {
                                readonly description: "Whether the transfer hook is upgradable.";
                                readonly type: "object";
                                readonly properties: {
                                    readonly authority: {
                                        readonly description: "Information on metadata upgrade authority.";
                                        readonly type: "array";
                                        readonly items: {
                                            readonly type: "object";
                                            readonly properties: {
                                                readonly address: {
                                                    readonly description: "Address with upgrade authority";
                                                    readonly type: "string";
                                                };
                                                readonly malicious_address: {
                                                    readonly description: "Indicates whether the address is malicious, \"1\" means yes.";
                                                    readonly type: "integer";
                                                    readonly format: "int32";
                                                    readonly minimum: -2147483648;
                                                    readonly maximum: 2147483647;
                                                };
                                            };
                                        };
                                    };
                                    readonly status: {
                                        readonly description: "Status indicator, where \"1\" means the funtcion is available.";
                                        readonly type: "string";
                                    };
                                };
                            };
                            readonly trusted_token: {
                                readonly description: "If the token is a famous and trustworthy one. \"1\" means yes.";
                                readonly type: "string";
                            };
                        };
                    };
                };
            };
            readonly type: "object";
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const TokenSecurityUsingGet1: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly chain_id: {
                    readonly type: "string";
                    readonly enum: readonly ["1", "56", "42161", "137", "204", "324", "59144", "8453", "5000", "534352", "10", "43114", "250", "25", "128", "100", "tron", "321", "201022", "42766", "81457", "169", "80085", "4200", "200901", "810180", "196"];
                    readonly examples: readonly ["56"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "The chain_id of the blockchain.\n\"1\" means Ethereum; \n\"10\" means Optimism;\n\"25\" means Cronos;\n\"56\" means BSC; \n\"100\" means Gnosis;\n\"128\" means HECO; \n\"137\" means Polygon; \n\"250\" means Fantom;\n\"321\" means KCC;\n\"324\" means zkSync Era;\n\"10001\" means ETHW;\n\"201022\" means FON;\n\"42161\" means Arbitrum; \n\"43114\" means Avalanche;\n\"59144\" means Linea Mainnet;\n\"8453\" Base;\n\"tron\" means Tron;\n\"534352\" means Scroll;\n\"204\" means opBNB;\n\"5000\" means Mantle;\n\"42766\" means ZKFair;\n\"81457\" means Blast;\n\"169\" means Manta Pacific;\n\"80085\" means Berachain Artio Testnet;\n\"4200\" means Merlin;\n\"200901\" means Bitlayer Mainnet;\n\"810180\" means zkLink Nova;\n\"196\" means X Layer Mainnet; ";
                };
            };
            readonly required: readonly ["chain_id"];
        }, {
            readonly type: "object";
            readonly properties: {
                readonly contract_addresses: {
                    readonly type: "string";
                    readonly examples: readonly ["0xEa51801b8F5B88543DdaD3D1727400c15b209D8f"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "The contract address of tokens.";
                };
            };
            readonly required: readonly ["contract_addresses"];
        }, {
            readonly type: "object";
            readonly properties: {
                readonly Authorization: {
                    readonly type: "string";
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Authorization (test: Bearer 81|9ihH8JzEuFu4MQ9DjWmH5WrNCPW...)";
                };
            };
            readonly required: readonly [];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly title: "ResponseWrapperTokenSecurity";
            readonly properties: {
                readonly code: {
                    readonly description: "Code 1: Success";
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                };
                readonly message: {
                    readonly description: "Response message";
                    readonly type: "string";
                };
                readonly result: {
                    readonly description: "Response result";
                    readonly type: "object";
                    readonly additionalProperties: {
                        readonly description: "key is contract address";
                        readonly type: "object";
                        readonly properties: {
                            readonly anti_whale_modifiable: {
                                readonly description: "It describes whether the contract has the function to modify the maximum amount of transactions or the maximum token position. \n\"1\" means true; \n\"0\" means false; \nNo return means unknown.(Notice:(1) When \"is_open_source\": \"0\", there will be no return.\n(2) Sometimes, when \"is_proxy\": \"1\", there will be no return. \n(3)When the anti whale value is set to a very small value, all tradinge would fail.)";
                                readonly type: "string";
                            };
                            readonly buy_tax: {
                                readonly description: "It describes the tax when buying the token. \nExample: \"buy_tax\": 0.1%. \nNo return means unknown.(Notice:(1) When \"is_in_dex\": \"0\", there will be no return. \n(2) Buy tax will cause the actual value received when buying a token to be less than expected, and too much buy tax may lead to heavy losses.\n(3) When \"buy_tax\": \"1\", it means buy tax is 100% or cannot buy.\n(4) Sometimes token's anti-bot mechanism would affect our sandbox system, leading to \"cannoy_buy\": \"1\",  causing the display of \"buy_tax\": \"1\".\n(5)Some of the token is deisgned not for sale, leading to \"cannot_buy\":1, causing the display of \"buy_tax\": \"1\".)";
                                readonly type: "string";
                            };
                            readonly can_take_back_ownership: {
                                readonly description: "It describes whether this contract has the function to take back ownership. \n\"1\" means true; \n\"0\" means false; \nNo return means unknown.(Notice:(1) When \"is_open_source\": \"0\", there will be no return. \n(2) Sometimes, when \"is_proxy\": \"1\", there will be no return. \n(3) Ownership is mostly used to adjust the parameters and status of the contract, such as minting, modification of slippage, suspension of trading, setting blacklsit, etc. \nWhen the contract does not have an owner (or if the owner is a black hole address) and the owner cannot be retrieved, these functions will most likely be disabled.)";
                                readonly type: "string";
                            };
                            readonly cannot_buy: {
                                readonly description: "It deiscribes whether the Token can be bought.\n\"1\" means true; \n\"0\" means false; \nNo return means unknown.(Notice:(1) Generally, \"cannot_buy\": \"1\" would be found in Reward Tokens. Such Tokens are issued as rewards for some on-chain applications and cannot be bought directly by users.\n(2) Sometimes token's anti-bot mechanism would affect our sandbox system, causing the display of \"buy_tax\": \"1\".\n(3) When \"cannot_buy\": \"1\", our sandbox system might be bloked, causing the display of \"buy_tax\": \"1\" and \"sell_tax\": \"1\")";
                                readonly type: "string";
                            };
                            readonly cannot_sell_all: {
                                readonly description: "It describes whether the contract has the function restricting token holder selling all the token. \n\"1\" means true; \n\"0\" means false; \nNo return means unknown.(Notice:(1) When \"is_in_dex\": \"0\", there will be no return. \n(2) This feature means that you will not be able to sell all your tokens in a single sale. Sometimes you need to leave a certain percentage of the token, e.g. 10%, sometimes you need to leave a fixed number of token, such as 10 token.\n(3) When \"buy_tax\": \"1\", there will be no return.)";
                                readonly type: "string";
                            };
                            readonly creator_address: {
                                readonly description: "It describes this contract's owner address. \nExample: \"creator_address\": \"0x744aF9cBb7606BB040f6FBf1c0a0B0dcBA6385E5\";";
                                readonly type: "string";
                            };
                            readonly creator_balance: {
                                readonly description: "It describes the balance of the contract owner. \nExample:\"owner_balance\": 100000000.";
                                readonly type: "string";
                            };
                            readonly creator_percent: {
                                readonly description: "It describes the percentage of tokens held by the contract owner. Example:\"owner_balance\": 0.1.(Notice:1 means 100% here.)";
                                readonly type: "string";
                            };
                            readonly dex: {
                                readonly description: "It describes Dex information of where the token that can be traded.(Notice:When \"is_in_dex\": \"0\", there will be empty array. )";
                                readonly type: "array";
                                readonly items: {
                                    readonly type: "object";
                                    readonly properties: {
                                        readonly liquidity: {
                                            readonly description: "Liquidity is converted to USDT denomination.";
                                            readonly type: "string";
                                        };
                                        readonly name: {
                                            readonly type: "string";
                                        };
                                        readonly pair: {
                                            readonly description: " It only counts when the token has a marketing pair with mainstream ";
                                            readonly type: "string";
                                        };
                                    };
                                };
                            };
                            readonly external_call: {
                                readonly description: "It describes whether the contract would call functions of other contracts when primary methods are executed.\n\"1\" means true; \n\"0\" means false;\nNo return means unknown.(Notice:(1) When \"is_open_source\": \"0\", there will be no return. \n(2) External call would cause the implementation of this contract to be highly dependent on other external contracts, which may be a potential risk.)";
                                readonly type: "string";
                            };
                            readonly fake_token: {
                                readonly description: "It indicates whether the token is a counterfeit of a mainstream asset. (If there is no evidence indicating that it is a counterfeit asset, there will be no return.)";
                                readonly type: "object";
                                readonly properties: {
                                    readonly true_token_address: {
                                        readonly description: "If the value is set to 1, and true_token_address is the address of the authentic mainstream asset that the token is imitating on this public chain. If there are multiple mainstream assets with the same name, they will be separated by commas.";
                                        readonly type: "string";
                                    };
                                    readonly value: {
                                        readonly description: "If the value is set to 1, and true_token_address is the address of the authentic mainstream asset that the token is imitating on this public chain. If there are multiple mainstream assets with the same name, they will be separated by commas.";
                                        readonly type: "integer";
                                        readonly format: "int32";
                                        readonly minimum: -2147483648;
                                        readonly maximum: 2147483647;
                                    };
                                };
                            };
                            readonly hidden_owner: {
                                readonly description: "It describes whether the contract has hidden owners. For contract with a hidden owner, developer can still manipulate the contract even if the ownership has been abandoned.\n\"1\" means true;\n\"0\" means false;\nNo return means unknown.(Notice:(1) When \"is_open_source\": \"0\", there will be no return. \n(2) Sometimes, when \"is_proxy\": \"1\", there will be no return. \n(3) Hidden owner is often used by developers to hide ownership and is often accompanied by malicious functionality. When the hidden owner exists, it is assumed that ownership has not been abandoned.)";
                                readonly type: "string";
                            };
                            readonly holder_count: {
                                readonly description: "It describes the number of token holders.\nExample:\"holder_count\": \"4342\"";
                                readonly type: "string";
                            };
                            readonly holders: {
                                readonly description: "Top10 holders info";
                                readonly type: "array";
                                readonly items: {
                                    readonly type: "object";
                                    readonly properties: {
                                        readonly address: {
                                            readonly description: "It describes the holder address; ";
                                            readonly type: "string";
                                        };
                                        readonly balance: {
                                            readonly description: "It describes the balance of the holder. ";
                                            readonly type: "string";
                                        };
                                        readonly is_contract: {
                                            readonly description: "It describes whether the holder is a contract \"1\" means true; \"0\" means false.";
                                            readonly type: "integer";
                                            readonly format: "int32";
                                            readonly minimum: -2147483648;
                                            readonly maximum: 2147483647;
                                        };
                                        readonly is_locked: {
                                            readonly description: "It describes whether the tokens owned by the holder are locked \"1\" means true; \"0\" means false; \n(3) \"tag\" describes the address's public tag. Example:Burn (Notice:About \"locked\": We only support the token lock addresses or black hole addresses that we have included. )";
                                            readonly type: "integer";
                                            readonly format: "int32";
                                            readonly minimum: -2147483648;
                                            readonly maximum: 2147483647;
                                        };
                                        readonly locked_detail: {
                                            readonly description: "It is an array, decribes lock position info of this holder, only shows when \"locked\": 1. This Array may contain multiple objects for multiple locking info. (Notice:When \"locked\":0, or lock address is a black hole address,  \"locked_detail\" will be no return.)";
                                            readonly type: "array";
                                            readonly items: {
                                                readonly type: "object";
                                                readonly properties: {
                                                    readonly amount: {
                                                        readonly description: "\"amount\" describes the number of token locked";
                                                        readonly type: "string";
                                                    };
                                                    readonly end_time: {
                                                        readonly description: "\"end_time\" describes when the token will be unlocked";
                                                        readonly type: "string";
                                                    };
                                                    readonly opt_time: {
                                                        readonly description: "\"opt_time\" describes when the token was locked";
                                                        readonly type: "string";
                                                    };
                                                };
                                            };
                                        };
                                        readonly percent: {
                                            readonly description: "It  describes the percentage of tokens held by this holder (Notice:About \"percent\": 1 means 100% here.)";
                                            readonly type: "string";
                                        };
                                        readonly tag: {
                                            readonly description: "It describes the address's public tag. Example:Burn Address/Deployer; ";
                                            readonly type: "string";
                                        };
                                    };
                                };
                            };
                            readonly honeypot_with_same_creator: {
                                readonly description: "It describes the number of honeypot tokens created by this creator.";
                                readonly type: "string";
                            };
                            readonly is_airdrop_scam: {
                                readonly description: "It describes whether the token is an airdrop scam.\n\"1\" means true;\n\"0\" means false;\nNone means no result (Because We did not find conclusive information on whether token is an airdrop scam).(Notice:Only \"is_airdrop_scam\": \"1\" means it is an airdrop scam.)";
                                readonly type: "string";
                            };
                            readonly is_anti_whale: {
                                readonly description: "It describes whether the contract has the function to limit the maximum amount of transactions or the maximum token position that for single address. \n\"1\" means true; \n\"0\" means false; \nNo return means unknown.(Notice:(1) When \"is_open_source\": \"0\", there will be no return.\n(2) Sometimes, when \"is_proxy\": \"1\", there will be no return. )";
                                readonly type: "string";
                            };
                            readonly is_blacklisted: {
                                readonly description: "It describes whether the blacklist function is not included in the contract. If there is a blacklist, some addresses may not be able to trade normally.\n\"1\" means true;\n\"0\" means false; \nNo return means unknown.(Notice:(1) When \"is_open_source\": \"0\",  there will be no return. \n(2) Sometimes, when \"is_proxy\": \"1\", there will be no return. \n(3) The contract owner may add any address into the blacklist, and the token holder in blacklist will not be able to trade. Abuse of the blacklist function will lead to great risks. \n(4) For contracts without an owner (or the owner is a black hole address), the blacklist will not be able to get updated. However, the existing blacklist is still in effect.)";
                                readonly type: "string";
                            };
                            readonly is_honeypot: {
                                readonly description: "It describes whether the token is a honeypot. \"HoneyPot\" means that the token maybe cannot be sold because of the token contract's function, Or the token contains malicious code. \n\"1\" means true; \n\"0\" means false; \nNo return means unknown.(Notice:(1) When \"is_open_source\": \"0\", there will be no return. \n(2) Sometimes, when \"is_proxy\": \"1\", there will be no return. \n(3) Hight risk, definitely scam.)";
                                readonly type: "string";
                            };
                            readonly is_in_dex: {
                                readonly description: "It describes whether the token can be traded on the main Dex.\n\"1\" means true;\n\"0\" means false(Notice:It only counts when the token has a marketing pair with mainstream coins/tokens.)";
                                readonly type: "string";
                            };
                            readonly is_mintable: {
                                readonly description: "It describes whether this contract has the function to mint tokens. \n\"1\" means true; \n\"0\" means false; \nNo return means unknown.(Notice:(1) When \"is_open_source\": \"0\", there will be no return. \n(2) Sometimes, when \"is_proxy\": \"1\", there will be no return. \n(3) Mint function will directly trigger a massive sell-off, causing the coin price to plummet. It is extremely risky. \n(4) This function generally relies on ownership. When the contract does not have an owner (or if the owner is a black hole address) and the owner cannot be retrieved, this function will most likely be disabled.)";
                                readonly type: "string";
                            };
                            readonly is_open_source: {
                                readonly description: "It describes whether this contract is open source. \n\"1\" means true; \n\"0\" means false.(Notice:Un-open-sourced contracts may hide various unknown mechanisms and are extremely risky. When the contract is not open source, we will not be able to detect other risk items.)";
                                readonly type: "string";
                            };
                            readonly is_proxy: {
                                readonly description: "It describes whether this contract has a proxy contract. \n\"1\" means true; \n\"0\" means false; \nNo return means unknown.(Notice:(1) When \"is_open_source\": \"0\", there will be no return. \n(2) Most Proxy contracts are accompanied by modifiable implementation contracts, and implementation contracts may contain significant potential risk. When the contract is a Proxy, we will stop detecting other risk items.)";
                                readonly type: "string";
                            };
                            readonly is_true_token: {
                                readonly description: "It describes whether the token is true or fake.\n\"1\" means true token;\n\"0\" means fake token;\nNone means no result (Because we did not find decisive information about the truth or falsity)(Notice:Only \"is_true_token\": \"0\" means it is a fake token.)";
                                readonly type: "string";
                            };
                            readonly is_whitelisted: {
                                readonly description: "It describes whether the whitelist function is not included in the contract. If there is a whitelist, some addresses may not be able to trade normally.\n\"1\" means true;\n\"0\" means false; \nNo return means unknown.(Notice:(1) When \"is_open_source\": \"0\", there will be no return. \n(2) Sometimes, when \"is_proxy\": \"1\", there will be no return. \n(3) Whitelisting is mostly used to allow specific addresses to make early transactions, tax-free, and not affected by transaction suspension.\n(4) For contracts without an owner (or the owner is a black hole address), the whitelist will not be able to get updated. However, the existing whitelist is still in effect.)";
                                readonly type: "string";
                            };
                            readonly lp_holder_count: {
                                readonly description: "It describes the number of LP token holders.\nExample:\"lp_holder_count\": \"4342\".\nNo return means no LP.(Notice:When \"is_in_dex\": \"0\", there will be no return.)";
                                readonly type: "string";
                            };
                            readonly lp_holders: {
                                readonly description: "Top10 LP token holders info(Notice:When \"is_in_dex\": \"0\", there will be no return. )";
                                readonly type: "array";
                                readonly items: {
                                    readonly type: "object";
                                    readonly properties: {
                                        readonly NFT_list: {
                                            readonly description: "It is an array, decribes nft list";
                                            readonly type: "array";
                                            readonly items: {
                                                readonly type: "object";
                                                readonly properties: {
                                                    readonly NFT_id: {
                                                        readonly description: "\"NFT_id\" is the NFTID corresponding to that NFT. ";
                                                        readonly type: "string";
                                                    };
                                                    readonly NFT_percentage: {
                                                        readonly description: "\"NFT_percentage\" represents the proportion of that NFT in the total liquidity.\nWhen the LP holder is a lockup address, this information will also appear in the \"locked_detail\" section.";
                                                        readonly type: "string";
                                                    };
                                                    readonly amount: {
                                                        readonly description: "\"amount\" is the liquidity quantity corresponding to the NFT.";
                                                        readonly type: "string";
                                                    };
                                                    readonly in_effect: {
                                                        readonly description: "\"in_effect\" indicates whether the liquidity corresponding to that NFT is effective at the current price. ";
                                                        readonly type: "string";
                                                    };
                                                    readonly value: {
                                                        readonly description: "\"value\" is the total USD value corresponding to the NFT.";
                                                        readonly type: "string";
                                                    };
                                                };
                                            };
                                        };
                                        readonly address: {
                                            readonly description: "It describes the holder address; ";
                                            readonly type: "string";
                                        };
                                        readonly balance: {
                                            readonly description: "It describes the balance of the holder. ";
                                            readonly type: "string";
                                        };
                                        readonly is_contract: {
                                            readonly description: "It describes whether the holder is a contract \"1\" means true; \"0\" means false.";
                                            readonly type: "integer";
                                            readonly format: "int32";
                                            readonly minimum: -2147483648;
                                            readonly maximum: 2147483647;
                                        };
                                        readonly is_locked: {
                                            readonly description: "It describes whether the tokens owned by the holder are locked \"1\" means true; \"0\" means false; \n(3) \"tag\" describes the address's public tag. Example:Burn (Notice:About \"locked\": We only support the token lock addresses or black hole addresses that we have included. )";
                                            readonly type: "integer";
                                            readonly format: "int32";
                                            readonly minimum: -2147483648;
                                            readonly maximum: 2147483647;
                                        };
                                        readonly locked_detail: {
                                            readonly description: "It is an array, decribes lock position info of this holder, only shows when \"locked\": 1. This Array may contain multiple objects for multiple locking info. (Notice:When \"locked\":0, or lock address is a black hole address,  \"locked_detail\" will be no return.)";
                                            readonly type: "array";
                                            readonly items: {
                                                readonly type: "object";
                                                readonly properties: {
                                                    readonly amount: {
                                                        readonly description: "\"amount\" describes the number of token locked";
                                                        readonly type: "string";
                                                    };
                                                    readonly end_time: {
                                                        readonly description: "\"end_time\" describes when the token will be unlocked";
                                                        readonly type: "string";
                                                    };
                                                    readonly opt_time: {
                                                        readonly description: "\"opt_time\" describes when the token was locked";
                                                        readonly type: "string";
                                                    };
                                                };
                                            };
                                        };
                                        readonly percent: {
                                            readonly description: "It  describes the percentage of tokens held by this holder (Notice:About \"percent\": 1 means 100% here.)";
                                            readonly type: "string";
                                        };
                                        readonly tag: {
                                            readonly description: "It describes the address's public tag. Example:Burn Address/Deployer; ";
                                            readonly type: "string";
                                        };
                                    };
                                };
                            };
                            readonly lp_total_supply: {
                                readonly description: "It describes the supply number of the LP token.\nExample:\"lp_total_supply\": \"100000000\".\nNo return means no LP.(Notice:(1) When \"is_in_dex\": \"0\", there will be no return. \n(2) It is LP token number, NOT token number)";
                                readonly type: "string";
                            };
                            readonly note: {
                                readonly description: "It describes whether the contract has other things investors need to know. \nExample: \n\"note\": \"Contract owner is a multisign contract.\"(Notice:(1) If we haven't found any other thing which is valuable yet, there will be no return. \n(2) Type: string.)";
                                readonly type: "string";
                            };
                            readonly other_potential_risks: {
                                readonly description: "It describes whether the contract has other potential risks.\nExample:\n\"other_potential_risks\": \"Owner can set different transaction taxes for each user, which can trigger serious losses.\"(Notice:(1) If we haven't found any other potential risk yet, there will be no return. \n(2) Type: string.)";
                                readonly type: "string";
                            };
                            readonly owner_address: {
                                readonly description: "It describes this contract's owner address. \nExample: \"owner_address\": \"0x744aF9cBb7606BB040f6FBf1c0a0B0dcBA6385E5\"; \nNo return means unknown; Return empty means there is no ownership or can't find ownership.(Notice:(1) When \"is_open_source\": \"0\", there will be no return. \n(2) Sometimes, when \"is_proxy\": \"1\", there will be no return. \n(3) Ownership is mostly used to adjust the parameters and status of the contract, such as minting, modification of slippage, suspension of trading, setting blacklist, etc. \nWhen the contract does not have an owner (or if the owner is a black hole address) and the owner cannot be retrieved, these functions will most likely be disabled.)";
                                readonly type: "string";
                            };
                            readonly owner_balance: {
                                readonly description: "It describes the balance of the contract owner. \nExample: \"owner_balance\": \"100000000\". \nNo return or return empty means there is no ownership or can't find ownership.(Notice:When \"owner_address\" returns empty, or no return, there will be no return.)";
                                readonly type: "string";
                            };
                            readonly owner_change_balance: {
                                readonly description: "It describes whether the contract owner has the authority to change the balance of any token holder. \n\"1\" means true; \n\"0\" means false; \nNo return means unknown.(Notice:(1) When \"is_open_source\": \"0\", there will be no return. \n(2) Sometimes, when \"is_proxy\": \"1\", there will be no return. \n(3) Token with this feature means that the owner can modify anyone's balance, resulting in an asset straight to zero or a massive minting and sell-off. \n(4) This function generally relies on ownership. When the contract does not have an owner (or if the owner is a black hole address) and the owner cannot be retrieved, this function will most likely be disabled.)";
                                readonly type: "string";
                            };
                            readonly owner_percent: {
                                readonly description: "It describes the percentage of tokens held by the contract owner. \nExample:\"owner_balance\": \"0.1\". \nNo return or return empty means there is no ownership or can't find ownership.(Notice:(1) 1 means 100% here.\n(2) When \"owner_address\" returns empty, or no return, there will be no return.)";
                                readonly type: "string";
                            };
                            readonly personal_slippage_modifiable: {
                                readonly description: "It describes whether the owner can set a different tax rate for every assigned address.\n\"1\" means ture;\n\"0\" means false;\nNo return means unknown.(Notice:(1) When \"is_open_source\": \"0\",  there will be no return. \n(2) Sometimes, when \"is_proxy\": \"1\", there will be no return. \n(3) The contract owner may set a very outrageous tax rate for assigned address to block it from trading. Abuse of this funtcion will lead to great risks. \n(4) For contracts without an owner (or the owner is a black hole address), this function would not able to be used. However, the existing tax rate would be still in effect.)";
                                readonly type: "string";
                            };
                            readonly selfdestruct: {
                                readonly description: "It describes whether this contract can self destruct.\n\"1\" means true; \n\"0\" means false;\nNo return means unknown.(Notice:(1) When \"is_open_source\": \"0\", there will be no return. \n(2) When the self-destruct function is triggered, this contract will be destroyed, all functions will be unavailable, and all related assets will be erased.)";
                                readonly type: "string";
                            };
                            readonly sell_tax: {
                                readonly description: "It describes the tax when selling the token. \nExample: \"sell_tax\": 0.1%. \nNo return means unknown.(Notice:(1) When \"is_in_dex\": \"0\", there will be no return. \n(2) Sell tax will cause the actual value received when selling a token to be less than expected, and too much buy tax may lead to large losses.\n(3) When \"sell_tax\": \"1\", it means sell-tax is 100% or this token cannot be sold.\n(4) Sometimes token's  trading-cool-down mechanism would affect our sandbox system. When \"trading_cooldown\": \"1\", \"sell_tax\" may return \"1\".)";
                                readonly type: "string";
                            };
                            readonly slippage_modifiable: {
                                readonly description: "It describes whether the trading tax can be modifiable by token contract.\n\"1\" means true;\n\"0\" means false;\nNo return means unknown.(Notice:(1) When When \"is_open_source\": \"0\", there will be no return. \n(2) Sometimes, when \"is_proxy\": \"1\", there will be no return. \n(3) Token with modifiable tax means that the contract owner can modify the buy tax or sell tax of the token. This may cause some losses, especially since some contracts have unlimited modifiable tax rates, which would make the token untradeable. \n(4) This function generally relies on ownership. When the contract does not have an owner (or if the owner is a black hole address) and the owner cannot be retrieved, this function will most likely be disabled.)";
                                readonly type: "string";
                            };
                            readonly token_name: {
                                readonly description: "Token Name";
                                readonly type: "string";
                            };
                            readonly token_symbol: {
                                readonly description: "Token Symbol";
                                readonly type: "string";
                            };
                            readonly total_supply: {
                                readonly description: "It describes the supply number of the token.\nExample:\"total_supply\": 100000000";
                                readonly type: "string";
                            };
                            readonly trading_cooldown: {
                                readonly description: "It describes whether the contract has trading-cool-down mechanism which can limits the minimum time between two transactions.\n\"1\" means true; \n\"0\" means false; \nNo return means unknown.(Notice:(1) When \"is_open_source\": \"0\", there will be no return.\n(2) Sometimes, when \"is_proxy\": \"1\", there will be no return. )";
                                readonly type: "string";
                            };
                            readonly transfer_pausable: {
                                readonly description: "It describes whether trading can be pausable by token contract.\n\"1\" means true;\n\"0\" means false;\nNo return means unknown.(Notice:(1) When \"is_open_source\": \"0\", there will be no return. \n(2) Sometimes, when \"is_proxy\": \"1\", there will be no return. \n(3) This feature means that the contract owner will be able to suspend trading at any time, after that anyone will not be able to sell, except those who have special authority. \n(4) This function generally relies on ownership. When the contract does not have an owner (or if the owner is a black hole address) and the owner cannot be retrieved, this function will most likely be disabled.)";
                                readonly type: "string";
                            };
                            readonly trust_list: {
                                readonly description: "It describes whether the token is a famous and trustworthy one. \"1\" means true; No return no result (Because We did not find conclusive information on whether token is a airdrop scam).(Notice:(1) Only \"trust_list\": \"1\" means it is a famous and trustworthy token. \n(2) No return doesn't mean it is risky.)";
                                readonly type: "string";
                            };
                        };
                    };
                };
            };
            readonly type: "object";
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
export { AddressContractUsingGet1, AddressNft1155ApproveListUsingGet1, AddressNft721ApproveListUsingGet1, AddressTokenApproveListUsingGet1, ApprovalContractUsingGet, GetAbiDataInfoUsingPost, GetAccessTokenUsingPost, GetChainsListUsingGet, GetDappInfoUsingGet, GetDefiInfoUsingGet, GetNftInfoUsingGet1, GetNftLockersUsingGet, GetTokenLockersUsingGet, PhishingSiteUsingGet, PrerunTxUsingPost, SolanaTokenSecurityUsingGet, TokenSecurityUsingGet1 };
