## Sysvar - Solana system information

In Solana, `sysvars` are special read-only accounts that store various system-level information.
They are managed by the system and are identified by well-known public keys (Pubkeys).

For full details, refer to the [official Solana documentation](https://docs.solana.com/developing/runtime-facilities/sysvars) 
or to the [Solana Rust SDK documentation](https://docs.rs/solana-program/1.8.11/solana_program/sysvar/index.html).

### Sysvar types

Solana provides several types of sysvars that offer different functionalities and information, like:

* **Clock**:  blockchain time and slot
* **Rent**: rent-related parameters and costs for accounts
* **Fees**: current fees and rates
* **EpochSchedule**:  epoch-related parameters and schedules
* _and [more](https://docs.rs/solana-program/1.18.11/solana_program/sysvar/index.html#modules)..._

### Accessing Sysvars

In Solana programs, sysvars can be accessed using the `solana_program::sysvar` module. The `Sysvar::get()` method is used to retrieve a sysvar's data.

Here’s an example code snippet to retrieve the `Clock` sysvar:

```rust
use solana_program::sysvar::clock::Clock;
use solana_program::sysvar::Sysvar;

let clock = Clock::get()?;
println!("Current Slot: {}", clock.slot);
```

## Exercise

In this exercise, your will learn how to access the `Clock` and `Rent` sysvars in a Solana program.
