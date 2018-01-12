# ASSESMENT 2
Voor assesment 2 heb ik gekozen voor een sortable barchart. [Barchart](https://bl.ocks.org/mbostock/3885304)
Vervolgens ben ik op het CBS gaan kijken naar een bruikbare dataset [Link naar dataset](http://statline.cbs.nl/Statweb/publication/?DM=SLNL&PA=60048ned&D1=13,18,79,83,87,152,156&D2=0&D3=7-26&HDR=T&STB=G1,G2&VW=T)

Voor de sort functie heb ik code gepakt van deze barchart [Link naar sort barchart](https://bl.ocks.org/mbostock/3885705)

## Werkwijze
Ik begon meteen met het opschonen van de data.
Als eerste ben ik de rauwe data gaan aanroepen.
```js
d3.text('index.csv')                                                    
    .get(onload);
```
Hier maak ik een variabelen aan en geef ik aan vanaf waar ik de data wil aan roepen.
```js
var header = doc.indexOf('1995');
```
Hier maak ik een variabelen aan die verteld tot waar de data aan geroepen moet worden.
```js
var end = doc.indexOf('Centraal Bureau voor de Statistiek') - 3;
```
Hier gooi ik de onodige witruimte weg.
```js
doc = doc.substring(header, end).trim();
```
Hier vervang ik linebreaks voor komma's.
```js
doc = doc.replace(/;+/g, ',')
```
Hier structureer ik de data en geef ik de data een naam en vertel ik vanuit welke rij uit het index.csv bestand hij data moet pakken.
```js
function map(d) {                                                   
        return {
            Perioden: d[0],                                             
            Totaal: Number(d[1]),
        }
    }
```

