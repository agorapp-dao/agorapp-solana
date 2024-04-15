
```rust
    invoke_signed(
        &system_instruction::allocate(allocated_info.key, SIZE as u64),
        accounts,
        &[&[seeds, &[bump_seed]]],
    )?;
    
    Ok(())
```

As you can see, `accounts` already contains all necessary accounts; but you can as well re-construct the array if you want to.
