```rust
    // 1. Get the clock sysvar via syscall
    let clock_via_sysvar = Clock::get()?;
    // 2. Get the rent sysvar via syscall
    let rent_via_sysvar = Rent::get()?;
```
