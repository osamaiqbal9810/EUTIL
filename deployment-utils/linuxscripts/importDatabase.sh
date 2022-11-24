if ["$1" == ""]; then
 echo "Please specify the database name as first argument:";
 exit
fi
if [ $(mongo localhost:27017 --eval 'db.getMongo().getDBNames().indexOf("$1")' --quiet) -lt 0 ]; then
    echo "Database $1 does not exist, I'll create this"
else
    echo "$1 already exists, cannot proceed further"
	exit
fi
# FILE=/home/azureuser/Downloads/DeploymentImage.tar
# if test -f "$FILE"; then
    # echo "$FILE existance test passed."
# else
    # echo "$FILE doesn't exist. Cannot proceed"
	# exit
# fi
# echo "Removing existing lamp, database folders"
# sudo rm -rf /datadrive/lamp
# sudo rm -rf /datadrive/database
# #
# sudo rm -rf /home/azureuser/Downloads/lamp
# sudo rm -rf /home/azureuser/Downloads/database
# #
# echo "Extracting new image."
# tar -xvf "$FILE"
# #
# echo "Copying extracted files"
# sudo cp -R lamp /datadrive
# sudo cp -R database /datadrive
#
##echo "Deleting existing database."
##mongo test --eval "db.dropDatabase()"
#
echo "Importing new database."
for ff in *.json 
do mongoimport --db "$1" --collection "${ff%.json}" --file "$ff" 
done
#
#echo "Running NPM Install on New Server."
##cd /datadrive/lamp/server && sudo npm install
##cd /datadrive/lamp/server && sudo npm run start
#echo "Setting permissions to pm2"
#sudo chown azureuser:azureuser /home/azureuser/.pm2/rpc.sock /home/azureuser/.pm2/pub.sock
#echo "Use this to run: env IP=10.0.0.4 PORT=80 pm2 start --interpreter babel-node bin/www"