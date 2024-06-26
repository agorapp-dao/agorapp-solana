//! https://github.com/solana-labs/solana-program-library/tree/master/examples/rust/sysvar

use {
    solana_program::{
        instruction::{AccountMeta, Instruction},
        sysvar,
    },
    solana_program_test::*,
    solana_sdk::{signature::Signer, transaction::Transaction},
    solana_lesson_sysvar::process_instruction,
};

#[tokio::test]
async fn test_sysvar() {
    let program_id = sysvar::id();
    let (mut banks_client, payer, recent_blockhash) = ProgramTest::new(
        "solana_lesson_sysvar",
        program_id,
        processor!(process_instruction),
    )
        .start()
        .await;

    let mut transaction = Transaction::new_with_payer(
        &[Instruction::new_with_bincode(
            program_id,
            &(),
            vec![
                AccountMeta::new(sysvar::clock::id(), false),
                AccountMeta::new(sysvar::rent::id(), false),
            ],
        )],
        Some(&payer.pubkey()),
    );
    transaction.sign(&[&payer], recent_blockhash);
    banks_client.process_transaction(transaction).await.unwrap();
}
