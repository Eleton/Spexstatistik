var spexarna = [];
var listOfGroups = ["Directeur", "Producent", "Ekonomichef", "Turnéchef", "Regisseur", "Koreograf", "Musikproducent", "Sångchef", "Maestro", "Manus", "Revisor", "Teknik", "KMP", "PR", "QM", "Gyckelgruppen", "Scengruppen", "Orkestern", "Inte med"];
var listOfYears = ["Gauss", "1492", "Al Capone", "Jack the Ripper", "Till Hafs", "Ponnyexpressen", "Kristian Tyrann", "Guinness", "Pius III", "Shangri La", "Gustav III", "Freud", "På Gränsen", "Vive la France", "Hadrianus Mur", "Bonnie & Clyde"];


var width = 1000, height = 500;

//file = document.getElementById('input').files[0];
//console.log("hejsan hoppsan " + typeof file);
Papa.parse("https://dl.dropboxusercontent.com/u/5955257/spexstatistik.csv", {
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
	}
});

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

		infoWindow.select("g").remove();

		var infoTextGroup = infoWindow.append("g")
		.attr("transform", "translate(" + (width/4) + ", " + 30 + ")");

	infoTextGroup.append("text")
	.text(listOfGroups[Math.floor(i/listOfGroups.length)] + " -> " + listOfGroups[i % listOfGroups.length])
		.style("text-anchor", "middle");

		infoTextGroup.append("text")
		.text(d === 1 ? "Har hänt 1 gång" : "Har hänt " + d + " gånger")
		.attr("y", "1em")
		.attr("text-anchor", "middle");
	});

	var infoWindow = svg.append("g").attr("transform", "translate(" + (width/2 + 10) + ",10)");
	
	infoWindow.append("rect")
	.attr("width", width/2 - 20).attr("height", height - 20)
	.style("fill", "#ddd").style("opacity", 0.3);

	var graphButton1 = infoWindow.append("rect")
	.attr("fill", "#ddd").attr("opacity", 0.3)
	.attr("width", width/6 - 20).attr("height", 50).attr("fill", "black").attr("y", height - 70)
	.on("click", function(){
		changeGraph(heatMap);
	});

	var graphButton2 = infoWindow.append("rect")
	.attr("fill", "#ddd").attr("opacity", 0.3)
	.attr("width", width/6 - 20).attr("height", 50).attr("x", width/6).attr("fill", "black").attr("y", height - 70)
	.on("click", function(){
		changeGraph(heatMap2);
	});

	var graphButton3 = infoWindow.append("rect")
	.attr("fill", "#ddd").attr("opacity", 0.3)
	.attr("width", width/6 - 20).attr("height", 50).attr("x", 2*width/6).attr("fill", "black").attr("y", height - 70)
	.on("click", function(){
		changeGraph(heatMap3);
	});


	infoWindow.on("click", function(){
		//changeGraph(heatMap2);
	});
	//infoWindow.on("click", changeGraph(heatMap2));

	function changeGraph(callback){
		console.log("jag borde köra när jag klickas, inte annars");
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