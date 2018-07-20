#!/bin/bash
redis-server
cross-env NODE_ENV=production forever start app.js