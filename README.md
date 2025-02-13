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

### Change log base directory of log files

By default, the **log-creep** 👺 will creep the logs in `/var/logs/`, but this can be changed by updated the env var `BASE_DIR`. Like so
```shell
echo BASE_DIR=/home/creep/logs/ > .env
```