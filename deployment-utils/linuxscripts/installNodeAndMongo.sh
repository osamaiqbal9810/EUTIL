#!/usr/bin/env bash
sudo apt-get update
echo "Installing nodejs, npm, and build-essentials..."
# Install Node 16
curl -sL https://deb.nodesource.com/setup_16.x -o nodesource_setup.sh
sudo bash nodesource_setup.sh
sudo apt install nodejs -y
sudo apt-get install build-essential
# Mongo db installation
echo "Installing mongodb..."
sudo wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
echo "Starting mongodb service using 'sudo service mongodb start'"
# set mongodb to start automatically on system startup
sudo systemctl enable mongod
sudo systemctl status mongod
echo "Installing mongodb native drivers for Nodejs"
echo "Installing PM2"
sudo npm install -g pm2
# set pm2 to start automatically on system startup
sudo pm2 startup systemd

