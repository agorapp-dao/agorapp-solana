//! A program demonstrating logging
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
        account_info::AccountInfo,
        entrypoint::ProgramResult,
        log::{sol_log_compute_units, sol_log_params, sol_log_slice},
        msg,
        pubkey::Pubkey,
    };

    /// Instruction processor
    pub fn process_instruction(
        program_id: &Pubkey,
        accounts: &[AccountInfo],
        instruction_data: &[u8],
    ) -> ProgramResult {
        // Log a string
        msg!("static string");

        // Log a slice
        sol_log_slice(instruction_data);

        // Log a formatted message, use with caution can be expensive
        msg!("formatted {}: {:?}", "message", instruction_data);

        // Log a public key
        program_id.log();

        // Log all the program's input parameters
        sol_log_params(accounts, instruction_data);

        // Log the number of compute units remaining that the program can consume.
        sol_log_compute_units();

        Ok(())
    }
}
