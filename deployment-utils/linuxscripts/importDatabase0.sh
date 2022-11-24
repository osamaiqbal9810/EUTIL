#
#echo "Deleting existing database."
#mongo test --eval "db.dropDatabase()"
#
echo "Importing new database."
cd /datadrive/database && for ff in *.json 
							do mongoimport --db "$1" --collection "${ff%.json}" --file "$ff" 
						  done
#