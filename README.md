# GHACTION 

### test
```
$ touch payload.json
$ act workflow_dispatch -j action_test -e payload.json -P ubuntu-latest=nektos/act-environments-ubuntu:18.04 
```