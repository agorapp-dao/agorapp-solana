IMAGE=agorapp-solana
DOCKER_BUILD_OPTIONS=--progress plain --pull
all:

docker-build:
	docker build $(DOCKER_BUILD_OPTIONS) --target runner -t $(IMAGE) .

exec.sh:
	docker exec -it $(IMAGE) /bin/bash

# Executes the container with lessons mounted from codebase
debug:
	docker run -it --rm \
	  -p 7005:7005 \
	  -v ./lessons-code:/work/lessons-code \
	  --env AGORA_LOG=debug \
	  --name $(IMAGE) \
	  $(IMAGE)

# Executes the container with built-in lessons
run:
	docker run -it --rm \
	  -p 7005:7005 \
	  --name $(IMAGE) \
	  $(IMAGE)

stop:
	docker kill $(IMAGE)

CURL=curl -v --fail --header "Content-Type: application/json" --header "Accept: application/json"
test-solve:
	time $(CURL) http://localhost:7005/v1/solve -d@tests/solve01.json
test-solve-withslash:
	time $(CURL) http://localhost:7005/v1/solve/ -d@tests/solve01.json
