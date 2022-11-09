// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.9;

contract zollsystem {

    struct Zollanmeldung {
        address exporteur;
        address importeur;
        address anmelder;
        address zoll;
        uint zeitstempel;
        string zollwert;
        string lieferkosten;
        string incoterms;
        string gesamtbetrag;
        uint rechnungID;
    }   
    
    struct Rechnung {
        string gesamtbetrag;
        string waehrung;
        address exporteur;
        address importeur;
        string datum;
        string rechnungsposten;
        string lieferkosten;
    }

    struct Dokument {
        uint transaktionsID;
        string hashwert;
    }

    //Dynamisches Array mit allen Rechnungen
    Rechnung[] private rechnungen;
    Zollanmeldung[] private zollanmeldungen;
    Dokument[] private dokumente;


    //Initatilisierungsfunktion
    constructor(){
    } 

    function createRechnung(string memory _gesamtbetrag, address _importeur, string memory _waehrung, string memory _datum, string memory _rechnungsposten, string memory _lieferkosten) public returns(uint){
        rechnungen.push(Rechnung({
            gesamtbetrag: _gesamtbetrag,
            exporteur: msg.sender,
            importeur: _importeur,
            waehrung: _waehrung,
            datum: _datum,
            rechnungsposten: _rechnungsposten,
            lieferkosten: _lieferkosten
        }));
        return rechnungen.length-1; 
    }

    function createDokument(uint _transaktionsID, string memory _hashwert) public returns(uint){
        dokumente.push(Dokument({
            transaktionsID: _transaktionsID,
            hashwert: _hashwert
        }));
        return dokumente.length-1; 
    }

    function createZollanmeldung(address _zoll, uint _rechnungID, string memory _zollwert, string memory _incoterms) public returns(uint){
        require(
            rechnungen[_rechnungID].importeur == msg.sender
            //Nur Importeur kann Zollanmeldung erstellen
        );
        zollanmeldungen.push(Zollanmeldung({
            zoll: _zoll,
            exporteur: rechnungen[_rechnungID].exporteur,
            importeur: msg.sender,
            anmelder: msg.sender,
            rechnungID: _rechnungID,
            zeitstempel: block.timestamp,
            zollwert: _zollwert,
            lieferkosten: rechnungen[_rechnungID].lieferkosten, //Rechnungsdaten werden automatisch in Zollanmeldung übernommen
            gesamtbetrag: rechnungen[_rechnungID].gesamtbetrag,
            incoterms: _incoterms
        }));
        return zollanmeldungen.length-1;
    }

    function getDokumentenHash(uint _dokumentenID) public view returns(string memory){
        return dokumente[_dokumentenID].hashwert;
    }

    function getZollanmeldung(uint zID) public view returns (Zollanmeldung memory, Rechnung memory){
        require(zollanmeldungen[zID].zoll == msg.sender);
        return(zollanmeldungen[zID], rechnungen[zollanmeldungen[zID].rechnungID]); 
    }
}