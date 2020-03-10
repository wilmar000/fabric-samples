●Change peer-base.yaml in first-network/base
●command: peer node start --peer-chaincodedev 
____________
cd fabric-samples/fabcar
sh startFabric.sh javascript
cd .. 
cd ..
git clone https://github.com/wilmar000/GBHyperledger-FabCar.git
cd GBHyperledger-FabCar
mkdir config
cd ..
cp ./fabric-samples/first-network/connection-org1.json ./GBHyperledger-FabCar/config/
cd GBHyperledger-FabCar
cd wallet
rm -rf admin
rm -rf user1
cd ..
npm install
node enrollAdmin.js
node registerUser.js
cd routes
●Change "query.js", "createHouse" with proper APIs. There is a few examples
●Or you can use "invoke.js" to execute the command. Just change the command inside
cd ..
npm start
●Local
http://localhost:5984/_utils/#/_all_dbs
http://localhost:3000/queryAllHouses