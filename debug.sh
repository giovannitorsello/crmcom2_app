quasar dev --debug &
sleep 30
google-chrome --remote-debugging-port=9222 -- http://localhost:8888
