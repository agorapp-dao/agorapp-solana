use {
    solana_program::{
        instruction::{AccountMeta, Instruction},
        pubkey::Pubkey,
    },
    solana_program_test::*,
    solana_sdk::{signature::Signer, transaction::Transaction},
    solana_lesson_introduction::process_instruction,
    std::str::FromStr,
};

/// This test does not really look into the log messages; it just checks that the program completes without an error.
#[tokio::test]
async fn test_logging() {
    let program_id = Pubkey::from_str("Logging111111111111111111111111111111111111").unwrap();
    let (mut banks_client, payer, recent_blockhash) = ProgramTest::new(
        "solana_lesson_introduction",
        program_id,
        processor!(process_instruction),
    )
        .start()
        .await;
    let mut transaction = Transaction::new_with_payer(
        &[Instruction::new_with_bincode(
            program_id,
            &[10_u8, 11, 12, 13, 14],
            vec![AccountMeta::new(Pubkey::new_unique(), false)],
        )],
        Some(&payer.pubkey()),
    );
    transaction.sign(&[&payer], recent_blockhash);
    banks_client.process_transaction(transaction).await.unwrap();
}
