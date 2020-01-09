host="zincbind.net"

# Build app
npm run build

# Empty the current source directory on the server
ssh $host "rm -r ~/$host/* >& /dev/null"

# Upload app
scp -r build/* $host:~/$host/