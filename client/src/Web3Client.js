import Web3 from 'web3';
import Zollsystem from './smartcontracts/zollsystem.json';

let selectedAccount;

let zollsystemcontract;

let isinit;

//initialize the web3 provider
export const init = async () => {
    //get provider (metamask)
    let provider = window.ethereum;

    if (typeof provider !== 'undefined'){
      provider
      .request({ method: 'eth_requestAccounts' })
      .then((accounts) => {
          selectedAccount = accounts[0];
          //returns the Pub Key of selected account in MetaMask
        console.log(`Selected account is ${selectedAccount}`);
      })
      .catch((err) => {
        console.log(err);
        return;
      });
      window.ethereum.on('accountsChanged', function (accounts) {
        selectedAccount = accounts[0];
        console.log(`Selected account changed to ${selectedAccount}`);
      });
    }
    //creates new web3-object based on provider
    const web3 = new Web3(provider);
    const networkId = await web3.eth.net.getId();

    //read the deployed contract to web3 contract-object 
    zollsystemcontract = new web3.eth.Contract(
        Zollsystem.abi, //returned by "truffle migrate"
        Zollsystem.networks[networkId].address); //server/node IP
    isinit=true;
}; 

//returns the rechnungID
export async function createRechnung(_gesamtbetrag, _importeur, _waehrung, _datum, _rechnungsposten, _lieferkosten){
    if (!isinit) {
        await init();
    }
    await zollsystemcontract.methods.createRechnung(_gesamtbetrag, _importeur, _waehrung, _datum, _rechnungsposten, _lieferkosten).send({from: selectedAccount});
    return await zollsystemcontract.methods.createRechnung(_gesamtbetrag, _importeur, _waehrung, _datum, _rechnungsposten, _lieferkosten).call({from: selectedAccount});
}

export async function uploadDokumentHash(_transaktionsID, _hash){
  if (!isinit) {
      await init();
  }
  await zollsystemcontract.methods.createDokument(_transaktionsID, _hash).send({from: selectedAccount});
  return await zollsystemcontract.methods.createDokument(_transaktionsID, _hash).call({from: selectedAccount});
}


//returns zollanmeldungID
 export async function createZollanmeldung(_zoll, _rechnungID, _zollwert, _incoterms){
     if (!isinit) {
         await init();
     }
     await zollsystemcontract.methods.createZollanmeldung(_zoll, _rechnungID, _zollwert, _incoterms).send({from: selectedAccount});
     return await zollsystemcontract.methods.createZollanmeldung(_zoll, _rechnungID, _zollwert, _incoterms).call({from: selectedAccount});
 }

 //returns Zollanmeldung and Rechnung
 export async function getZollanmeldung(_zollanmeldungID){
  if (!isinit) {
      await init();
  }
  await zollsystemcontract.methods.getZollanmeldung(_zollanmeldungID).send({from: selectedAccount});
  return await zollsystemcontract.methods.getZollanmeldung(_zollanmeldungID).call({from: selectedAccount});
}

//returns Dokumentenhash
export async function getDokumentenHash(_transaktionsID){
  if (!isinit) {
      await init();
  }
  await zollsystemcontract.methods.getDokumentenHash(_transaktionsID).send({from: selectedAccount});
  return await zollsystemcontract.methods.getDokumentenHash(_transaktionsID).call({from: selectedAccount});
}