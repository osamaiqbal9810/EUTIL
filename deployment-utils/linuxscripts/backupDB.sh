#!/bin/bash
mkdir ~~tempDB
cd ~~tempDB && for ff in applicationlookups assets assettrees assettypes grouppermissions journeyplans lists maintenances reports runs tenants usergroups users workorders workplantemplates; do mongoexport --db test --collection "$ff" --out "$ff.json"; done
cd .. && tar -czvf dbBackup.tar.gz ~~tempDB
sudo rm -rf ~~tempDB

