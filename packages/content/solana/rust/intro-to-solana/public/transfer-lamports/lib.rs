//! https://github.com/solana-labs/solana-program-library/blob/master/examples/rust/transfer-lamports/src/lib.rs
//!
//! A program demonstrating the transfer of lamports
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
    #![allow(clippy::arithmetic_side_effects)]
    //! Program instruction processor

    use solana_program::{
        account_info::{next_account_info, AccountInfo},
        entrypoint::ProgramResult,
        pubkey::Pubkey,
    };

    /// Instruction processor
    pub fn process_instruction(
        _program_id: &Pubkey,
        accounts: &[AccountInfo],
        _instruction_data: &[u8],
    ) -> ProgramResult {
        // Create an iterator to safely reference accounts in the slice
        let account_info_iter = &mut accounts.iter();

        // As part of the program specification the first account is the source
        // account and the second is the destination account
        let source_info = next_account_info(account_info_iter)?;
        let destination_info = next_account_info(account_info_iter)?;

        // Withdraw five lamports from the source
        **source_info.try_borrow_mut_lamports()? -= 5;
        // Deposit five lamports into the destination
        **destination_info.try_borrow_mut_lamports()? += 5;

        Ok(())
    }
}
