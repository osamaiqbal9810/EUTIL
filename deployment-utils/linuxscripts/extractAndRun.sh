echo "Removing existing lamp folder"
cd /datadrive
sudo rm -rf lamp
cd /home/azureuser/Downloads
sudo rm -rf lamp
echo "Extracting new image."
tar -xvf DeploymentImage.tar
echo "Copying extracted files"
sudo cp -R lamp /datadrive
echo "Running new server."
cd /datadrive/lamp/server
sudo npm install
#sudo npm run start
