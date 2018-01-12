/*global d3*/

var svg = d3.select("svg"),
    margin = {
        top: 20,
        right: 20,
        bottom: 30,
        left: 100
    },
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;

var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
    y = d3.scaleLinear().rangeRound([height, 0]);

var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.text('index.csv')                                                    //Hier roep ik aan waar de data vandaan gehaald moet worden. Hij haalt hier de rauwe data op die ik gedownload heb.
    .get(onload);


function onload(err, doc) {
    if (err) {
        throw err
    }

    var header = doc.indexOf('1995');                                   //Hier maak ik een variabelen aan en geef ik aan vanaf waar ik de data wil aan roepen.
    var end = doc.indexOf('Centraal Bureau voor de Statistiek') - 3;    //Hier maak ik een variabelen aan die verteld tot waar de data aan geroepen moet worden.
    doc = doc.substring(header, end).trim();                            //Hier gooi ik de onodige witruimte weg.
    doc = doc.replace(/;+/g, ',')                                       //Hier vervang ik linebreaks voor komma's.
    var data = d3.csvParseRows(doc, map);                               


    function map(d) {                                                   //Hier structureer ik de data.
        return {
            Perioden: d[0],                                             //Hier geef ik de data een naam en vertel ik vanuit welke rij uit het index.csv bestand hij data moet pakken.
            Totaal: Number(d[1]),
        }
    }

    console.log(data)
    x.domain(data.map(function (d) {
        return d.Perioden;
    }));
    y.domain([0, d3.max(data, function (d) {
        return d.Totaal;
    })]);

    g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    g.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(y).ticks(25))
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 5)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("Frequency");

    g.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function (d) {
            return x(d.Perioden);
        })
        .attr("y", function (d) {
            return y(d.Totaal);
        })
        .attr("width", x.bandwidth())
        .attr("height", function (d) {
            return height - y(d.Totaal);
        });

    d3.select("input").on("change", change);


    d3.select("input").property("checked", true).each(change);


    function change() {

        // Copy-on-write since tweens are evaluated after a delay.
        var x0 = x.domain(data.sort(this.checked ?
                    function (a, b) {
                        return b.Totaal - a.Totaal;
                    } :
                    function (a, b) {
                        return d3.ascending(a.Perioden, b.Perioden);
                    })
                .map(function (d) {
                    return d.Perioden;
                }))
            .copy();


        svg.selectAll(".bar")
            .sort(function (a, b) {
                return x0(a.Perioden) - x0(b.Perioden);
            });

        var transition = svg.transition().duration(750),
            delay = function (d, i) {
                return i * 50;
            };

        transition.selectAll(".bar")
            .delay(delay)
            .attr("x", function (d) {
                return x0(d.Perioden);
            });


        transition.selectAll(".axis--x")
            .call(d3.axisBottom(x))
            .selectAll("g")
            .delay(delay);
    } 
    
    
};
