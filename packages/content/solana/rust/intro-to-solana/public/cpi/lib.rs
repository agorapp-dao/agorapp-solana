//! https://github.com/solana-labs/solana-program-library/blob/master/examples/rust/cross-program-invocation/src/lib.rs
//!
//! Rust example demonstrating invoking another program
#![forbid(unsafe_code)]

mod entrypoint {
    //! Program entrypoint

    #![cfg(not(feature = "no-entrypoint"))]

    use solana_program::{account_info::AccountInfo, entrypoint::ProgramResult, pubkey::Pubkey};

    solana_program::entrypoint!(process_instruction);
    fn process_instruction(
        program_id: &Pubkey,
        accounts: &[AccountInfo],
        instruction_data: &[u8],
    ) -> ProgramResult {
        crate::processor::process_instruction(program_id, accounts, instruction_data)
    }
}
pub mod processor {
    //! Program instruction processor

    use solana_program::{
        account_info::{next_account_info, AccountInfo},
        entrypoint::ProgramResult,
        program::invoke_signed,
        program_error::ProgramError,
        pubkey::Pubkey,
        system_instruction,
    };

    /// Amount of bytes of account data to allocate
    pub const SIZE: usize = 42;

    /// Instruction processor
    pub fn process_instruction(
        program_id: &Pubkey,
        accounts: &[AccountInfo],
        instruction_data: &[u8],
    ) -> ProgramResult {
        // Create in iterator to safety reference accounts in the slice
        let account_info_iter = &mut accounts.iter();

        // Account info for the program being invoked
        let system_program_info = next_account_info(account_info_iter)?;
        // Account info to allocate
        let allocated_info = next_account_info(account_info_iter)?;

        let expected_allocated_key =
            Pubkey::create_program_address(&[b"You pass butter", &[instruction_data[0]]], program_id)?;
        if *allocated_info.key != expected_allocated_key {
            // allocated key does not match the derived address
            return Err(ProgramError::InvalidArgument);
        }

        // Invoke the system program to allocate account data
        invoke_signed(
            &system_instruction::allocate(allocated_info.key, SIZE as u64),
            // Order doesn't matter and this slice could include all the accounts and be:
            // `&accounts`
            &[
                system_program_info.clone(), // program being invoked also needs to be included
                allocated_info.clone(),
            ],
            &[&[b"You pass butter", &[instruction_data[0]]]],
        )?;

        Ok(())
    }
}
