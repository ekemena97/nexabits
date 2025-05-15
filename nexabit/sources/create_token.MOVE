module create_token::Token {
    use std::string; // This is still required for string handling
    // Removed duplicate aliases
    // use sui::object; // Not necessary
    // use sui::tx_context; // Not necessary
    // use sui::transfer; // Not necessary

    /// Structure to represent the token
    public struct Token has key, store {
        id: UID,
        name: string::String,
        symbol: string::String,
        description: string::String,
        image_url: string::String,
        decimals: u8,
        total_supply: u64,
        fixed_supply: bool,
    }

    const ERR_TOTAL_SUPPLY_ZERO: u64 = 1;

    /// Function to create a new token
    public entry fun create_token(
        name: string::String,
        symbol: string::String,
        description: string::String,
        image_url: string::String,
        decimals: u8,
        total_supply: u64,
        fixed_supply: bool,
        ctx: &mut tx_context::TxContext
    ) {
        // Ensure total supply is non-zero
        assert!(total_supply > 0, ERR_TOTAL_SUPPLY_ZERO);

        // Create a unique ID for the token
        let token_id = object::new(ctx);

        // Mint the token object
        let token = Token {
            id: token_id,
            name,
            symbol,
            description,
            image_url,
            decimals,
            total_supply,
            fixed_supply,
        };

        // Emit the token object to the caller
        transfer::public_share_object(token); // Use the single argument
    }
}
