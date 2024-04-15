use solana_program::{
    account_info::{AccountInfo, next_account_info},
    entrypoint::ProgramResult,
    program::invoke_signed,
    pubkey::Pubkey,
    system_instruction,
};

/// Amount of bytes of account data to allocate
pub const SIZE: usize = 42;

solana_program::entrypoint!(process_instruction);

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

    let seeds = b"You pass butter";
    let (_derived_address, bump_seed)  = Pubkey::find_program_address(&[seeds, &[instruction_data[0]]], program_id);

    // Invoke the system program to allocate account data
    // your code here
}
