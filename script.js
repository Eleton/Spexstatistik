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
			.attr("width", (height/listOfGroups.length - 5*0))
			.attr("height", (height/listOfGroups.length - 5*0))
			.attr("fill", function(d){ return d3.hsl(color(d), 1, 0.3).toString()})
			.attr("opacity", function(d){return d === 0 ? 0.2 : 1})
			.style("stroke", "white")
			.style("stroke-opacity", 0.7);

		heatRects.on("click", function(d, i){

			infoWindow.select("g").remove();

		var infoTextGroup = infoWindow.append("g")
			.attr("transform", "translate(" + (width/4) + ", " + 30 + ")");

		//infoWindow.select("text").remove();
		infoTextGroup.append("text")
			.text(listOfGroups[Math.floor(i/listOfGroups.length)] + " -> " + listOfGroups[i % listOfGroups.length])
			//.attr("x", width/4).attr("y", 30)
			.style("text-anchor", "middle");

		infoTextGroup.append("text")
		.text(d === 1 ? "Har hänt 1 gång" : "Har hänt " + d + " gånger")
		.attr("y", "1em")
		.attr("text-anchor", "middle");


			console.log(listOfGroups[Math.floor(i/listOfGroups.length)] + ", " + listOfGroups[i % listOfGroups.length])
		});

		var infoWindow = svg.append("g").attr("transform", "translate(" + (width/2 + 10) + ",10)");
		
		infoWindow.append("rect")
			.attr("width", width/2 - 20).attr("height", height - 20)
			.style("fill", "#ddd").style("opacity", 0.3)
			//.attr("x", width/2 + 8).attr("y", 10);


		//heatChart.append("text").text(function(d){return d}).attr("fill", "white").attr("y", 15);
		

		/*var heatRow = function(inData){
			var row = svg.selectAll(".heatRects")
				.data(inData)
				.enter().append("rect")
				.attr("x", function(d,i){return (height/listOfGroups.length)})
				.attr("width", (height/listOfGroups.length - 5))
				.attr("height", (height/listOfGroups.length - 5));
		}

		heatRow(heatData[0]);
		/*var heatCol = svg.selectAll(".heatRow")
			.data(heatData)
			.enter().append("g")
			.attr("transform", function(d,i){return "translate(0," + i*(height/listOfGroups.length) + ")"})
			.append(heatRow(this, function(d){return d}));

		

		console.log(heatRow);
			/*d.forEach(function(d2, j){
				console.log("translate(" + i*(height/listOfGroups.length) + "," + j + ")");
				return "translate(" + i + "," + j + ")";
			})*

		var heatRow = heatCol.append("g")
			.data(function(d){console.log("heat" + d); return d})
			.enter().append("rect")
			//.attr("transform", function(d,i){return "translate(" + i*(height/listOfGroups.length) + ",0)"})
			.attr("x", function(d,i){return (height/listOfGroups.length)})
			.attr("width", (height/listOfGroups.length - 5))
			.attr("height", (height/listOfGroups.length - 5));

		/*var heat = svg.selectAll(".heatRects")
			.data(deatData)
			.enter().append("rect")
			.attr()*/
	}
});

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
			//console.log(i+1);
			var first = whatGroup(spexare.groups[i]);
			var second = whatGroup(spexare.groups[i+1]);
			//console.log(first + " " + second);
			/*if(first >= 0 && second >= 0){
				//console.log(heatMatrix);
				heatMatrix[first][second]++;
			}*/
			if(first === 18 && second === 18){
			}else{
				heatMatrix[first][second]++;
			}
		}
	})
	console.log(heatMatrix);

	var lol = 0;
	heatMatrix.forEach(function(a){
		a.forEach(function(b){
			lol += b;
		})
	})
	console.log("lol: " + lol)

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