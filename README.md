apick
=====

Simple CLI api library based in express.
Just type apick to step into the repl enviroment and start mocking

## Installation

```
$ [sudo] npm install -g apick
```

## Help

```
node::apick> help
'HELP is a pending issue'
```

## Mock response from file

```
node::apick> mock --method get --path /test --file test_file.json --code 200
'Mock: get /test returns 200 with test_file.json'
```

## Mock response directly in repl

```
node::apick> mock --method get --path /test --data {"json":"test"} --code 200
'Mock: get /test returns 200 with {"json":"test"}'
```

##Available commands
- mock [--method] [--path] [--file] [--data] [--code]
	Mocks whatever you want
- clean --path
	Cleans a path so its not mocked any more
- reset
	Resets the mocking server
- exit
	Exits apick