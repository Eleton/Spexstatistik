var spexarna = [];
var listOfGroups = ["Directeur", "Producent", "Ekonomichef", "Turnéchef", "Regisseur", "Koreograf", "Musikproducent", "Sångchef", "Maestro", "Manus", "Revisor", "Teknik", "KMP", "PR", "QM", "Gyckelgruppen", "Scengruppen", "Orkestern", "Inte med"];
var listOfYears = ["Gauss", "1492", "Al Capone", "Jack the Ripper", "Till Hafs", "Ponnyexpressen", "Kristian Tyrann", "Guinness", "Pius III", "Shangri La", "Gustav III", "Freud", "På Gränsen", "Vive la France", "Hadrianus Mur", "Bonnie & Clyde"];


var width = 1200, height = 600;

//file = document.getElementById('input').files[0];
//console.log("hejsan hoppsan " + typeof file);
Papa.parse("http://dl.dropboxusercontent.com/u/5955257/spexstatistik.csv", {
	dynamicTyping: true,
	header: true,
	download: true,
	step: function(spexare) {
		var s = spexare.data[0];
		var exist = findIndex(s);
		if(exist < 0){

			var kort = s.shortYearName;
			var spex = {
				"firstname": s.firstname,
				"lastname": s.lastname,
				"groups": ["Inte med","Inte med","Inte med","Inte med",
				"Inte med","Inte med","Inte med","Inte med",
				"Inte med","Inte med","Inte med","Inte med",
				"Inte med","Inte med","Inte med","Inte med"]
			};
			spex.groups[s.year] = s.group;
			spexarna.push(spex);
		}else{
			spexarna[exist].groups[s.year] = s.group;
		}
	},
	complete: function() {
		console.log("Done");
		console.log(spexarna);

		initHeatMap();
		initLineChart();
		intiAmazeChart();
	}
});

function intiAmazeChart(){
	var svg0 = d3.select("#section2 span").append("svg").attr("width", width).attr("height", height);
	var dataWindow = svg0.append("rect").attr("width", width).attr("height", height).style("fill", "#ddd").style("opacity", 0.3);

	var svg = svg0.append("svg")
	.attr("width", width)
	.attr("height", height);

	var verticaleLines = svg.selectAll("rect")
	.data(listOfGroups).enter()
	.append("rect")
	.attr("width", 2)
	.attr("height", height)
	.attr("x", function(d,i){
		return (i+0.5)*width/listOfGroups.length;
	})
	.style("stroke", "black");

	/*var horisontalLines = svg.selectAll("rect")
	.data(listOfYears).enter()
	.append("rect")
	.attr("width", width)
	.attr("height", 2)
	.attr("y", function(d,i){
		return -(i+0.5)*height/12;
	})
	.style("stroke", "black");*/

	var titles = svg.selectAll("text")
	.data(listOfGroups).enter()
	.append("text")
	.attr("font-size", "2em")
	.text(function(d){return d})
	.attr("x", -2*height/3)
	.attr("y", function(d,i){
		return (i+0.5)*width/listOfGroups.length + 28;
	})
	.attr("transform", "rotate(-90)");

	var spexTitle = svg.append("text")
	.text("Föreställning")
	.attr("text-anchor", "middle")
	.attr("font-size", "6em")
	.attr("fill", "white")
	.attr("x", width/2)
	.attr("y", height*0.9);


	var spexCirklar = svg.selectAll("circle")
	.data(spexarna).enter().append("circle")
	.attr("cx", 20)
	.attr("cy", function(d,i){return 5})
	.attr("r", 10)
	.style("stroke-width", 3)
	.style("stroke", "black")
	.style("fill", "white");


	

	spexCirklar.each(slide);


	function slide() {
		var yearIndex = 0;

		var circle = d3.select(this);
		(function repeat() {
			

			circle.transition()
			.duration(2000)
			.attr("cx", function(spexare){
				spexTitle.text(listOfYears[yearIndex]);
				var g = spexare.groups[yearIndex];
				if(g !== "Inte med"){
					return (whatGroup(g)+1)*width/listOfGroups.length;
				}else{
					var remainingGroups = spexare.groups.slice(yearIndex, spexare.groups.length);
					if(remainingGroups.every(function(g){return g == "Inte med"})){
						return width;
					}else{
						return 0;
					}
				}
			}).attr("cy", function(spexare){
				var g = spexare.groups[yearIndex];
				if(g !== "Inte med"){
					var earlierGroups = spexare.groups.slice(0, yearIndex);
					var experience = earlierGroups.map(function(a){
						return a !== "Inte med" ? 1 : 0;
					}).reduce(function(a,b){return a + b}, 0);
					return Math.random()*height/16 + height/12*experience + 10;
				}else{
					return 5;
				}
			})
			.each("end", function(){yearIndex++; repeat()});
			
		})();
	}
}

function initLineChart(){

	var margin = {top: 20, right: 20, bottom: 60, left: 50}
    //width = 960 - margin.left - margin.right,
    //height = 500 - margin.top - margin.bottom;

    var svg0 = d3.select("#section1 span").append("svg").attr("width", width).attr("height", height);
    //svg0.append("rect")
	var dataWindow = svg0.append("rect").attr("width", width).attr("height", height).style("fill", "#ddd").style("opacity", 0.3);

	//var svg = d3.select("#section1 span")
	var svg = svg0.append("svg")
	.attr("width", 2*width/3 + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");


	var x = d3.scale.linear()
	.range([0, 2*width/3]);

	var y = d3.scale.linear()
	.range([height-margin.bottom, 0]);

	var xAxis = d3.svg.axis()
	.scale(x)
	.orient("bottom");

	var yAxis = d3.svg.axis()
	.scale(y)
	.orient("left");

	


	var line = d3.svg.line()
	.x(function(d, i) { return x(i); })
	.y(function(d) { return y(d); });

	x.domain(d3.extent([0,1,2,3,4,5], function(d, i) {return i; }));
	y.domain(d3.extent([0,0.65], function(d) { return d; }));

	svg.append("g")
	.attr("class", "x axis")
	.attr("transform", "translate(0," + (height-margin.bottom) + ")")
	.call(xAxis);

	svg.append("g")
	.attr("class", "y axis")
	.call(yAxis)
	.append("text")
	.attr("transform", "rotate(-90)")
	.attr("y", 6)
	.attr("dy", ".71em")
	.style("text-anchor", "end");
	//.text("Price ($)");

	var color = d3.scale.sqrt()
	.domain([0, 10])
	.range([0, 360]);



	for(var i = 5; i < listOfYears.length; i++){
		var percentageData = [];
		for(var j = 1; j < 8; j++){
			percentageData.push(union(i,i-j).length/yearExperience(i)[0].length)
		}
		// console.log(listOfYears[i]);
		// console.log(percentageData);
		var lines = svg.append("path")
		.datum(percentageData)
		.attr("class", "line")
		.attr("id", "line" + i)
		.attr("d", line)
		.style("stroke", function(d){ return d3.hsl(color(i), 1, 0.3).toString()});

		var legend = svg0.append("text").text(listOfYears[i]).attr("font-size", "1.3em").attr("y", i*1.15 + "em").attr("class", "legend").attr("id", "legend" + i).attr("x", 3*width/4).attr("fill", function(d){ return d3.hsl(color(i), 1, 0.3).toString()});

		legend.on("mouseover", function(){
			d3.selectAll("#section1 .line").style("stroke-opacity", 0.2);
			d3.select("#line" + listOfYears.indexOf(d3.select(this).text())).style("stroke-opacity", 1)
		}).on("mouseout", function(){
			d3.selectAll("#section1 .line").style("stroke-opacity", 1);
		})
		lines.on("mouseover", function(){
			d3.selectAll("#section1 .line").style("stroke-opacity", 0.2);
			d3.select(this).style("stroke-opacity", 1)
			d3.selectAll("#section1 .legend").attr("fill-opacity", 0.2);
			d3.select("#legend" + (d3.select(this).attr("id")).substring(4,6) ).attr("fill-opacity", 1);
		}).on("mouseout", function(){
			d3.selectAll("#section1 .line").style("stroke-opacity", 1);
			d3.selectAll("#section1 .legend").attr("fill-opacity", 1);
		})

	}

	// svg.append("path")
	// .datum(data)
	// .attr("class", "line")
	// .attr("d", line);

	// svg.append("path")
	// .datum(data2)
	// .attr("class", "line")
	// .attr("d", line);
}

function initHeatMap(){
	var svg = d3.select("#section0 span").append("svg")
	.attr("width", width)
	.attr("height", height);



	var dataWindow = svg.append("rect").attr("width", width).attr("height", height).style("fill", "#ddd").style("opacity", 0.3);

	var heatData = heatMap();

	var flattenedHeatMap = heatData.reduce(function(a, b) {
		return a.concat(b);
	}, []);

	var color = d3.scale.sqrt()
	.domain([0, 20])
	.range([0, 60]);

	var heatChart = svg.selectAll("g")
	.data(flattenedHeatMap)
	.enter().append("g")
	.attr("transform", function(d, i){
		var x = 3 + (height/listOfGroups.length)*(i - listOfGroups.length*Math.floor(i/listOfGroups.length));
		var y = 2 + (height/listOfGroups.length)*Math.floor(i/listOfGroups.length);
		return "translate(" + x + "," + y + ")";
	});

	var heatRects = heatChart.append("rect")
	.attr("width", (height/listOfGroups.length - 2))
	.attr("height", (height/listOfGroups.length - 2))
	.style("fill-opacity", function(d){return d === 0 ? 0.2 : 1})
	.attr("fill", function(d){ return d3.hsl(color(d), 1, 0.3).toString()})
	//.attr("opacity", function(d){return d === 0 ? 0.2 : 1})
	.style("stroke", "white")
	.style("stroke-opacity", 0.7);

	heatRects.on("click", function(d, i){

		infoWindow.selectAll(".infoText").remove();

		var infoTextGroup = infoWindow.append("g")
		.attr("transform", "translate(" + (width/4) + ", " + 30 + ")");

		infoTextGroup.append("text")
		.text(listOfGroups[Math.floor(i/listOfGroups.length)] + " -> " + listOfGroups[i % listOfGroups.length])
		.style("text-anchor", "middle")
		.classed("infoText", true);

		infoTextGroup.append("text")
		.text(d === 1 ? "Har hänt 1 gång" : "Har hänt " + d + " gånger")
		.attr("y", "1em")
		.attr("text-anchor", "middle")
		.classed("infoText", true);
	});

	heatChart.append("text")
	.text(function(d,i){return listOfGroups[Math.floor(i/listOfGroups.length)] + " -> " + listOfGroups[i % listOfGroups.length]})
	.style("visibility", "hidden")
	.attr("text-anchor", "middle")
	.attr("x", "2em")
	.attr("y", "1em");

	heatRects.on("mouseover", function(){
		d3.select(this.parentNode).select("text").style("visibility", "visible");
	})
	heatRects.on("mouseout", function(){
		d3.select(this.parentNode).select("text").style("visibility", "hidden");
	});

	var infoWindow = svg.append("g").attr("transform", "translate(" + (width/2 + 10) + ",10)");
	
	infoWindow.append("rect")
	.attr("width", width/2 - 20).attr("height", height - 20)
	.style("fill", "#ddd").style("opacity", 0.3);

	var buttonData = [{"text": "År till år", "func" : heatMap}, {"text": "Det förflutna", "func" : heatMap2}, {"text": "Framtiden", "func" : heatMap3}];

	var buttonGroups = infoWindow.selectAll("g")
	.data(buttonData).enter().append("g")
	.attr("transform", function(d,i){return "translate(" + i*width/6 + "," + (height-70) + ")"});

	var buttonRects = buttonGroups.append("rect")
	.attr("fill", "#ddd").attr("opacity", 0.3)
	.attr("width", width/6 - 20).attr("height", 50).attr("fill", "black");

	buttonGroups
	.append("text").text(function(d){return d.text})
	.attr("text-anchor", "middle")
	.attr("x", width/14)
	.attr("y", 30);

	buttonGroups.on("click", function(d){
		var hmap = d.func;
		changeGraph(hmap);
	});


	function changeGraph(callback){
		heatData = callback();

		flattenedHeatMap = heatData.reduce(function(a, b) {
			return a.concat(b);
		}, []);
		heatChart.data(flattenedHeatMap);
		console.log(heatChart.data());
		heatRects//.attr("opacity", 1)
		.transition().duration(2000)
		.style("fill-opacity", function(d, i){return flattenedHeatMap[i] === 0 ? 0.2 : 1})
		.attr("fill", function(d, i){return d3.hsl(color(flattenedHeatMap[i]), 1, 0.3).toString()})
	}
}

//KAN SÄKERT REFAKTORERAS TILL EN HÖGRE ORDNINGENS FUNKTION SOM GÖR DET HÄR, ISTÄLLET FÖR EN EXTRA FUNKTION
function findIndex(entry){
	var pos = -1;
	for(var i = 0; i < spexarna.length; i++){
		if(spexarna[i].firstname + spexarna[i].lastname == entry.firstname + entry.lastname){
			pos = i;
			break;
		}
	}
	return pos;
}

function heatMap(){
	var heatMatrix = listOfGroups.map(function(d){
		return new Array(listOfGroups.length+1).join('0').split('').map(parseFloat);
	});

	spexarna.forEach(function(spexare){
		for(var i = 0; i < spexare.groups.length - 1; i++){
			var first = whatGroup(spexare.groups[i]);
			var second = whatGroup(spexare.groups[i+1]);
			if(first === 18 && second === 18){
			}else{
				heatMatrix[first][second]++;
			}
		}
	})

	return heatMatrix;
}

function heatMap2(){
	var heatMatrix = listOfGroups.map(function(d){
		return new Array(listOfGroups.length+1).join('0').split('').map(parseFloat);
	});

	spexarna.forEach(function(spexare){
		for(var i = 0; i < spexare.groups.length - 1; i++){
			for(var j = 0; j < i; j++){
				if(i !== j){
					var first = whatGroup(spexare.groups[i]);
					var second = whatGroup(spexare.groups[j]);
					if(first === 18 || second === 18){
					}else{
						heatMatrix[first][second]++;
					}
				}
			}
		}

	})

	return heatMatrix;
}

function heatMap3(){
	var heatMatrix = listOfGroups.map(function(d){
		return new Array(listOfGroups.length+1).join('0').split('').map(parseFloat);
	});

	spexarna.forEach(function(spexare){
		for(var i = 0; i < spexare.groups.length - 1; i++){
			for(var j = i; j < spexare.groups.length - 1; j++){
				if(i !== j){
					var first = whatGroup(spexare.groups[i]);
					var second = whatGroup(spexare.groups[j]);
					if(first === 18 || second === 18){
					}else{
						heatMatrix[first][second]++;
					}
				}
			}
		}

	})

	return heatMatrix;
}


function whatGroup(someonesGroup){
	var group = false;
	//if(someonesGroup === "Inte med"){
	//	return listOfGroups.length;
	//}
	for(var i = 0; i < listOfGroups.length; i++){
		if(someonesGroup.indexOf(listOfGroups[i]) >= 0){
			group = i;
			break;
		}
	}
	//if(!group){console.log(someonesGroup)};
	return group;
}

function yearExperience(year){
	var occurrences = 0;

	var filtered = spexarna.filter(function(entry){
		return entry.groups[year] != "Inte med";
	})
	//console.log(filtered);
	filtered.forEach(function(entry){
		for(var i = year -1; i >= 0; i--){
			if(entry.groups[i] != "Inte med"){
				//console.log(/*occurrences + " " + */entry.firstname + " " + entry.lastname/* + " " + entry.groups[i]*/);
				occurrences++;
			}
		}
	})
	/*console.log("Total experience of year " + listOfYears[year] + ": " + occurrences);
	console.log("1 year ago: " + Math.trunc(100*union(year, year-1).length/filtered.length) + "%" +
				" 2 years ago: " + Math.trunc(100*union(year, year-2).length/filtered.length) + "%" +
				" 3 years ago: " + Math.trunc(100*union(year, year-3).length/filtered.length) + "%"
				);*/
	//console.log(filtered);
	return [filtered, occurrences];
}

function union(year1, year2){
	var older = spexarna.filter(function(entry){
		return entry.groups[year1] != "Inte med";
	})
	var newer = spexarna.filter(function(entry){
		return entry.groups[year2] != "Inte med";
	})
	//console.log(older);
	//console.log(newer);
	var union = newer.filter(function(entry){
		return older.indexOf(entry) >= 0;
	})
	//console.log(union);
	return union;
}
