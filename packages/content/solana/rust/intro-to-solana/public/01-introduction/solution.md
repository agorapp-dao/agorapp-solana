The correct code is as simple as just this:

```rust
    msg!("Hello, Solana!");
    Ok(())
```

Note that our test does not check the exact text of the message, or whether you are really logging.
It just requires that your program compiles and runs without errors.
