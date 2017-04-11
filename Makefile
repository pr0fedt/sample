all:clean deps dist

clean:
	@rm -rf dist
	@rm -rf api/node_modules
	@rm -rf tools/node_modules
	@rm -rf tools/node_modules

deps:
	./deps.sh

dist:
	./dist.sh

test:
	./test.sh

run:
	./run.sh

.PHONY: clean deps dist test run
