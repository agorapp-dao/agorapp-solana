## What is Solana?

Solana is a high-performance blockchain designed for scalability and efficiency.

It aims to provide fast, secure, and low-cost transactions by using innovative technologies like Proof of History (PoH) and Tower Consensus. 

Solana's architecture enables it to handle thousands of transactions per second without compromising decentralization or security.

## Developing contracts for Solana

Solana contracts can be developed using one of these frameworks:
* **Native** in Rust; it is the best choice when you need to develop a small contract, or you need to have full control over data transfer, storage etc 
* **Anchor** in Rust; it is less verbose, suitable for multi-program projects, with complex Web UIs 
* **Seahorse** in Python

This course will focus on developing contracts in Rust using the **Native** approach.

## Rust programming language

We expect you to have some basic knowledge of Rust.
If that is not your case, here is just a brief list of some good starting points:

* [The Rust Programming Language](https://doc.rust-lang.org/book/) - Official book provided by the Rust programming language team
* [Rustlings](https://github.com/rust-lang/rustlings) - Small exercises to get you used to the Rust syntax
* [Awesome Rust](https://github.com/rust-unofficial/awesome-rust) - Curated list of Rust learning resources, libraries, and tools

## First steps in writing Solana programs

### Local setup

On your machine, you would create a Rust projects with the following characteristics:
- `Cargo.toml` file dependencies, supporting `build-bpf` and `test-sbf` commands
    ```toml
    [dependencies]
    solana-program = "1.18.6"
    spl-token = { version = "4.0", features = [ "no-entrypoint" ] }
    signature = "1.6.4"
    
    [dev-dependencies]
    solana-program-test = "1.18.6"
    solana-sdk = "1.18.6"
    ```
    Note that you will probably need to adjust the versions of the dependencies to the latest available.
-  `Cargo.toml` file library configuration, because Solana programs are compiled as dynamic libraries
    ```toml
    [lib]
    crate-type = ["cdylib", "lib"]
    ```
- `lib.rs` file containing the program code

You would also need to install the Solana CLI tool to interact with the Solana network and deploy your programs.

All this is already set up in the environment you are using for this course, so you can focus on writing the program code.

### Program structure

Solana program is a Rust library that exports a function with the `#[entrypoint]` attribute. 
This function is the entry point of the program and is called when the program is invoked.

The further structure of the program is up to you, but you will need to define the program state and data structures, handle instructions, and implement the program logic.

Depending on the complexity of the program, you may need to split the code into multiple modules. We will keep all the code in a single file for simplicity.

First, there are some commonly used imports which you will need to include at the beginning of your program file:

```rust
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    program_error::ProgramError,
    pubkey::Pubkey,
};
```

### Program entry point

The entry point function is the main function of the program.
It is called when the program is invoked and is responsible for handling the instructions passed to the program.

Here is an example of a simple entry point function that logs a message to the console:

```rust
entrypoint!(process_instruction);
pub fn process_instruction(
  _program_id: &Pubkey, 
  _accounts: &[AccountInfo], 
  _instruction_data: &[u8]
) -> ProgramResult {
    msg!("Hello, Solana!");
    Ok(())
}
```

Let's break down the parts of this function:

- `entrypoint!(process_instruction)` tells the Solana runtime which function should be called when the program is invoked.
- `fn process_instruction(...)`: This is the function signature. The function takes three arguments: 
  - the program ID, which is a public key that identifies the program
  - list of accounts that the program can access 
  - the instruction data, passed as a raw byte array
- The function returns a `ProgramResult`, which is an alias for `Result<(), ProgramError>`; when the function completes successfully, it must return `Ok(())`.
- `msg!("Hello, Solana!")`: This line logs the message "Hello, Solana!" to the console. The `msg!` macro is provided by the Solana SDK and is used to log messages to the console.

Notes:
- in this trivial example, we don't use any of the arguments, so their name is prefixed with an underscore `_` to avoid compiler warnings
- the entry-point function `process_instruction` normally does not need to be public; it's marked `pub` here to make it easily testable while keeping the code minimal

Now let's look at the types of each of the arguments.

`Pubkey` is a type that represents a public key in Solana. Public keys are used to identify accounts and programs on the Solana blockchain.

`AccountInfo` is a struct that contains information about an account. It is used to pass account information to the program.

For instruction data, we use a raw byte array `[u8]` to represent the to represent the program's input data. 
The program can interpret this data as needed. De/Serialization with Borsh or Serde is a common practice. 

### Logging

As we saw in the example, you can log messages to the console using the `msg!` macro provided by the Solana SDK.
If there is more information you want to report in the message, you can use the formatting syntax as is usual in Rust, like in this snippet:

```rust
msg!("The program ID is: {}", program_id);
```

You will find this useful when debugging and testing your program.

## Exercise

Here comes your first exercise in writing a Solana program.

Modify the program on the right to write a "Hello, Solana" text in the logs.
