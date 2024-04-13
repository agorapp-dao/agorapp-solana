
```rust

    let amount = 5;
    // Withdraw lamports from the source
    **source_info.try_borrow_mut_lamports()? -= amount;
    // Deposit lamports into the destination
    **destination_info.try_borrow_mut_lamports()? += amount;
```
