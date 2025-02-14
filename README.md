# Log Creep 👺

Service to expose system logs of the host machine.

## How to run and use service

```shell
npm ci
npm start
curl localhost:9002/health # Check is running
curl localhost:9002/get-files # List files at /var/log

# List files (including dirs) at '/var/log/dog' whose name contains 'gertie'
curl 'localhost:9002/get-files?path=dog&pattern=gertie'

# List 10 lines containing 'grr' of the file '/var/log/dog/gertie.log'
curl 'localhost:9002/get-file-lines?path=dog/gertie&numLines=10&pattern=woof'
```

### Run for development

If you'd like the server to automatically restart on source changes, substitute `npm start` above with:

```shell
npm run dev
```

### Change base directory of log files

By default, the **log-creep** 👺 will creep the logs in `/var/logs/`, but this can be changed by updated the env var `BASE_DIR`. Like so:
```shell
echo BASE_DIR=/home/creep/logs/ > .env
```

### Manual examples

Create some files and place them where ever you're serving files from (`BASE_DIR`).
```shell
# Create a reasonably sized file
for i in $(seq 1 100000); do echo "$i meow"; done > 100000-meows.log
# Some example request
curl 'localhost:9002/get-file-lines?path=100000-meows.log&numLines=100&match=5000'
curl 'localhost:9002/get-file-lines?path=100000-meows.log&numLines=100&match=meow'
curl 'localhost:9002/get-file-lines?path=100000-meows.log&numLines=100&match=5000%20'
curl 'localhost:9002/get-file-lines?path=100000-meows.log&numLines=999999'

# Create a large file
yes meow | head -c 2GB > 2GB-meows.log
# Insert WOOFs in bot, mid, top
echo 'WOOF!' >> 2GB-meows.log
curl 'localhost:9002/get-file-lines?path=2GB-meows.log&match=WOOF'

sed -i '200000000 i WOOF!' 2GB-meows.log
curl 'localhost:9002/get-file-lines?path=2GB-meows.log&match=WOOF&numLines=2'

sed -i '1 i WOOF!' 2GB-meows.log
curl 'localhost:9002/get-file-lines?path=2GB-meows.log&match=WOOF&numLines=999'
```