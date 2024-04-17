## Program Derived Addresses (PDAs)

Using a PDA, a program may be given the authority over an account and later transfer that authority to another program.

For example, PDA can be used by the program to store (limited amount of) data _per user_.

_Program Derived Address_ is derived from seeds and a program ID (address).
It has no valid private key associated with it, and thus generating a signature for it is impossible.

To create a PDA, you can use the `find_program_address` function from the `Pubkey` module.

```rust
// ...

let program_id = Pubkey::from_str("Your_Program_ID_Here").unwrap();
let seeds = b"Your_Seed_Data_Here";

let (derived_address, bump_seed) = Pubkey::find_program_address(&[seeds], &program_id);
// ...
```

Note that this returns a tuple with the derived address and the bump seed.
Here the bump seed ensures that the derived address is _off-curve_, i.e. cannot construct valid private key laying on elliptic curve.
As a result, only the program can reconstruct the address and use it as a storage. 

## Cross-program invocation (CPI)

On-chain programs on Solana can interact with each other through cross-program invocation (CPI).
This allows programs to call other programs on the blockchain.

The **depth of the call stack** is limited to 4.
The reason of this limitation is to prevent infinite loops and to ensure that the program can be executed in a reasonable amount of time.

Also, **recursion** is possible, but only if it is direct.

### Program signed accounts

Programs can issue instructions that contain signed accounts that were not signed in the original transaction by using _Program Derived Addresses_.

To sign an account with program derived addresses, a program may invoke_signed().

```rust
invoke_signed(
    &instruction,
    accounts,
    &[&["First addresses seed"],
      &["Second addresses first seed", "Second addresses second seed"]],
)?;
```

## Exercise

Use CPI to call the [`allocate`](https://docs.rs/solana-program/1.18.11/solana_program/system_instruction/fn.allocate.html) method of the system program.

It is in `solana_program::system_instruction` and has the following signature:

```rust
pub fn allocate(pubkey: &Pubkey, space: u64) -> Instruction
```


Keep in mind that, as always, you must pass the invocation all involved accounts:
- `system_program_info` account
- `allocated_info`
