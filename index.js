var svg = d3.select("svg"),
    margin = {
        top: 20,
        right: 20,
        bottom: 30,
        left: 40
    },
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var x0 = d3.scaleBand()
    .rangeRound([0, width])
    .paddingInner(0.2);

var x1 = d3.scaleBand()
    .padding(0.05);

var y = d3.scaleLinear()
    .rangeRound([height, 0]);

var z = d3.scaleOrdinal()
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

var group = svg
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ',0)');

var data = d3.text('index.csv')
    .get(onload);


function onload(err, doc) {
    if (err) {
        throw err
    }

    var header = doc.indexOf('1995');
    var end = doc.indexOf('Centraal Bureau voor de Statistiek') - 3;
    doc = doc.substring(header, end).trim();
    doc = doc.replace(/;+/g, ',')
    doc = doc.replace(/ +/g, ',')
    var data = d3.csvParseRows(doc, map);

    data = d3.nest()
        .key(function (d) {
            return d.Perioden;
        })

        .entries(data).map(function (aSort) {
            return {
                Perioden: aSort.key,
                Cijfers: aSort.values
            };
        });

    function map(d) {
        return {
            Perioden: (d[0]),
            Totaal: (d[1]),
            Echtpaar: (d[2]),
            EenouderV: (d[3]),
            EenouderM: (d[4]),
            SamenwonendK: (d[5]),
            Alleen: (d[6])
        }
    }

    console.log(data);

    var keys = data;
  
    
    x0.domain(data.map(function (d) {
        return d.Perioden;
    }));
    x1.domain(data.map(function (d) {
        return d.Cijfers;
    }))

    

    g.append("g")
        .selectAll("g")
        .data(data)
        .enter().append("g")
        .attr("transform", function (d) {
            return "translate(" + x0(d.Cijfer) + ",0)";
        })
    
    
//            .selectAll('rect')
//            .data(function(d) { 
//                return d; })
//            console.log(d)
    
        .selectAll("rect")
        .data(function (d) {
            return data.map(function (key) {
                return {
                    key: key,
                    value: d[key]
                };
            });
        })
        .enter().append("rect")
        .attr('class', 'bar')
        .attr("x", function (d) {
            return x0(d.Perioden);
        })
        .attr("y", function (d) {
            return y(d.Cijfers);
        })
        .attr("width", x1.bandwidth())
        .attr("height", function (d) {
            return height - y(d.Cijfers);
        })
        .attr("fill", function (d) {
            return z(d.Perioden);
        });

    g.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x0));

    g.append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(y).ticks(null, "s"))
        .append("text")
        .attr("x", 2)
        .attr("y", y(y.ticks().pop()) + 0.5)
        .attr("dy", "0.32em")
        .attr("fill", "#000")
        .attr("font-weight", "bold")
        .attr("text-anchor", "start")
        .text("Population");

    var legend = g.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr("text-anchor", "end")
        .selectAll("g")
        .data(keys.slice().reverse())
        .enter().append("g")
        .attr("transform", function (d, i) {
            return "translate(0," + i * 20 + ")";
        });

    legend.append("rect")
        .attr("x", width - 19)
        .attr("width", 19)
        .attr("height", 19)
        .attr("fill", z);

    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9.5)
        .attr("dy", "0.32em")
        .text(function (d) {
            return d;
        });




//    function onchange() {
//        var sort = this.checked ? sortOnFrequency : sortOnLetter;
//        var x0 = x.domain(data.sort(sort).map(letter)).copy();
//        var transition = svg.transition();
//
//        timeout.stop();
//
//        /* Initial sort */
//        svg.selectAll('.bar').sort(sortBar);
//
//        /* Move the bars. */
//        transition.selectAll('.bar')
//            .delay(delay)
//            .attr('x', barX0);
//
//        /* Move the labels. */
//        transition.select('.axis-x')
//            .call(d3.axisBottom(x))
//            .selectAll('g')
//            .delay(delay);
//
//        function sortBar(a, b) {
//            return x0(letter(a)) - x0(letter(b));
//        }
//
//        function barX0(d) {
//            return x0(letter(d));
//        }
//
//        function delay(d, i) {
//            return i * 50;
//        }
//    }
//
//    function change() {
//        d3
//            .select('input')
//            .property('checked', true)
//            .dispatch('change');
//    }
//
//    /* Calculate `x` for a bar. */
//    function barX(d) {
//        return x(letter(d));
//    }
//
//    /* Calculate `y` for a bar. */
//    function barY(d) {
//        return y(frequency(d));
//    }
//
//
//    /* Clean a row. */
//    function row(d) {
//        d.frequency = Number(frequency(d));
//        return d;
//    }
//
//    /* Sort on frequence. */
//    function sortOnFrequency(a, b) {
//        return frequency(b) - frequency(a);
//    }
//
//    /* Sort on letters. */
//    function sortOnLetter(a, b) {
//        return d3.ascending(letter(a), letter(b));
//    }
//
//    /* Get the letter field for a row. */
//    function letter(d) {
//        return d.letter;
//    }
//
//    /* Get the frequency field for a row. */
//    function frequency(d) {
//        return d.frequency;
//    }


}

//d3.csvParse(cleanedData, function(d, i, columns) {
//    for (var i = 1, n = columns.lenght; i < n; ++i) d[columns[i]] = +d[columns[i]];
//    return d;
//}, function(error, doc) {
//    if (error) throw error;
//}) 









//d3.csv("index.csv", function(d, i, columns) {
//  for (var i = 1, n = columns.length; i < n; ++i) d[columns[i]] = +d[columns[i]];
//  return d;
//}, function(error, data) {
//  if (error) throw error;
//    
//    
//    
//    console.log(data);
//
//  var keys = data.columns.slice(1);
//    
//x0.domain(data.map(function (d){
//    return d.Perioden;
//}))
//
