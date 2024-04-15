
## Lamport

In Solana, the native currency is **SOL**. 
However, when interacting with Solana programs, you will often come across the term **lamport**.
A lamport is the smallest unit of time in Solana, and it is used to measure the cost of computational resources and storage on the Solana blockchain.

One lamport is 0.000_000_001 SOL. One SOL is therefore equivalent to 1_000_000_000 lamports.

When you send a transaction or execute a program on Solana, you pay for the resources used in terms of lamports. 
The cost of a transaction or program execution is measured in lamports, and the transaction fee is calculated based on the number of lamports consumed.

## Accounts

In Solana, accounts are the primary data structures that store information (state) on the blockchain.
Accounts hold arbitrary data, and also metadata such as the owner, the amount of SOL (lamports) it holds, and the data size.

To look up an account, you need to know its public key, which is a 256-bit value that uniquely identifies the account on the blockchain.

**Rent**

If the account holds enough lamports, it can be marked as rent-exempt, meaning it does not need to pay rent to remain on the blockchain.
Otherwise, it must pay rent to remain on the blockchain. 
Any account that drops to zero lamports is purged by the validator.

**Program accounts**

Program accounts are special accounts that contain the executable code for Solana programs. 
These programs can modify other accounts on the blockchain.
Program accounts are generally read-only.

**Working with accounts in Rust programs**

In Rust programs, you can access accounts using the `AccountInfo` struct, which provides methods to read and write data to the account.
You can also check the account's lamport balance, data size, and owner.

```rust
    //...

    // Create an iterator to safely reference accounts in the slice
    let account_info_iter = &mut accounts.iter();

    let account1 = next_account_info(account_info_iter)?;
    let account2 = next_account_info(account_info_iter)?;

    ///...
```

To interact with lamports on an account, you can use the `lamports()` method to get the current balance and `try_borrow_mut_lamports()` to modify the balance.

```rust
    // Get the current lamport balance of account1
    let lamports = account1.lamports();
    // Modify the lamport balance of account2
    **account2.try_borrow_mut_lamports()? -= 123;
```

To avoid underflow or overflow errors, it is recommended to set your `Cargo.toml` to use overflow checks:

```toml
[profile.release]
overflow-checks = true
```

## Signers

Transactions include one or more digital signatures each corresponding to an account address referenced by the transaction.
These signatures are used to authorize the transaction and prove that the transaction was signed by the account owner.
In this case, the account is referred to as a signer.

Transactions can indicate that some of the accounts it references to be treated as **read-only accounts** in order to enable parallel account processing between transactions.
Transaction is rejected if it tries to modify a read-only account.


## Exercise

Create a Solana program that transfers 5 lamports from the first account to the seconds account.
