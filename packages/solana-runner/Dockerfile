FROM solanalabs/solana:edge AS base

RUN apt-get update
RUN apt-get install -y curl build-essential pkg-config rsync

RUN curl --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y

FROM base AS builder

COPY . /app

RUN cd /app && /root/.cargo/bin/cargo build --release
RUN cd /app && /root/.cargo/bin/cargo test --release

FROM base AS runner

COPY --from=builder /app/target/release/agorapp-solana /usr/local/bin/agorapp-solana

# pre-heat by building a program
COPY lessons-code/solana-01-introduction /tmp/dummy-program
RUN cd /tmp/dummy-program && /root/.cargo/bin/cargo build-bpf
RUN cd /tmp/dummy-program && /root/.cargo/bin/cargo test-sbf
RUN rsync -azi /tmp/dummy-program/target /tmp/session_0001/

COPY lessons-code/ /work/lessons-code
WORKDIR /work
ENTRYPOINT ["/usr/local/bin/agorapp-solana"]
ENV AGORA_LOG=info
