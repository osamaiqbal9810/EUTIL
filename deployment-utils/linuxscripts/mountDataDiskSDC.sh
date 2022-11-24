#!/bin/bash
echo "Before running this script, please make sure the data disk exists at dev/sdc."
echo "Use  dmesg | grep SCSI command."
echo "You can also use manual method. Use following commands"
echo "sudo fdisk /dev/sdc"
echo "use 'n' for new partition select p primary and all default values"
echo "use 'p' for display the newly created partition"
echo "exit the fdisk"
echo "use 'sudo mkfs -t ext4 /dev/sdc1' command to create file system"
echo 
echo "Do you want to continue using this automated script?"
read -p "Are you sure you want to continue? <y/N>" prompt
if [[ $prompt == "y" || $prompt == "Y" || $prompt == "yes" || $prompt == "Yes" ]]
then
sudo parted /dev/sdc --script mklabel gpt mkpart xfspart xfs 0% 100%
sudo mkfs.xfs /dev/sdc1
partprobe /dev/sdc1
sudo mkdir /datadrive
sudo mount /dev/sdc1 /datadrive
echo "add following to the /etc/fstab in following format"
echo "UUID=33333333-3b3b-3c3c-3d3d-3e3e3e3e3e3e   /datadrive   ext4   defaults,nofail   1   2"
echo "replace 33333333-3b3b-3c3c-3d3d-3e3e3e3e3e3e with the UUID below."
echo ""
echo ""
sudo -i blkid
else
  exit 0
fi


