function init() {
	//Dimensions
    var w = 600;
    var h = 300;
	var padding  = 100;
	
	var w2 = 300;
	var h2 = 300;
	var outerRadius = w2/2;
	var innerRadius = 0;
	var arc = d3.arc()//creates the arcs
					.outerRadius(outerRadius)
					.innerRadius(innerRadius);
	var pie = d3.pie();
	var pieColor = d3.scaleOrdinal(d3.schemeCategory10);
	// append the svg object to the body of the page
	var svg = d3.select("#chart")
				.append("svg")
				.attr("width", w + h + 40)	
				.attr("height", h + padding + 20)
				.append("g")
				.attr("transform", "translate(" + (padding + 30)/2 + "," + padding/2 + ")")
	var svg2 = d3.select("#chart2")
				.append("svg")
				.attr("width", w2)
				.attr("height", h2)
				.attr("id","piechart");

	//Stacked Bar Chart
	//Inserting Dataset
	d3.csv("https://raw.githubusercontent.com/Jjasonle/UkraineMigration/main/CSV/UkraineEuropeComparison(1)(3).csv", function(data) {

	  // Listing of Stack types
	  var stacks = data.columns.slice(1)

	  // List the groups -> "Country" column will be displayed on x-axis
	  var groups = d3.map(data, function(d)	{
					return(d.Country)
					})
					.keys()
	//Scaling	
	var xScale = d3.scaleBand()		//Ordinal scale method
				.domain(groups)	//Calculate range of domain
				.range([0,w])	//Specify size of range the domain is mapped to
				.padding([0.2])
				
					
	var yScale = d3.scaleLinear()	//Constructs linear scale
				.domain([0, 450000])
				.range([h, 0]);

	  //Axis - X-axis
	  var xAxis = d3.axisBottom()
		  .scale(xScale)
		  
	  svg.append("g")
		.attr("transform", "translate(0," + h + ")")
		//.attr("transform", "translate(" + padding + ", " + h +")")
		.call(xAxis);
		//.tickSizeOuter(0));

	  //Axis - Y-axis
	  var yAxis = d3.axisLeft()
		.scale(yScale)
		.ticks(10);
		
	  svg.append("g")
		//.attr("transform", "translate(" + (padding) +", 0)")
		.call(yAxis);

	  var registerMouseovers = function () {	//Mouse over effect
		svg.selectAll("rect")
			.on("mouseover", function (d) {

				var xPosition = parseFloat(d3.select(this).attr("x"));
				var yPosition = parseFloat(d3.select(this).attr("y"));
				var heightPosition = parseFloat(d3.select(this).attr("h"));
	
				d3.select(this)
				.transition()
				.style("opacity", 0.5);	//highlighting

				svg.append("text")
				.attr("id", "tooltip")
				.attr("x", xPosition)
				.attr("y", yPosition)
				//will not display data. 
				.text(function (d, i) { return d.data.label; });
			})
			.on("mouseout", function () {
				d3.select(this)
				.transition()
			.duration(300)
			  .style("opacity", 1);	//removes highlighting
			d3.select("#tooltip")
			  .remove();
		});
	};
			
	//X-axis Label
	svg.append("text")
		.attr("x", w/2)
		.attr("y", h + 40)
		.attr("text-anchor", "middle")
		.style("font-family", "Helvetica")
		.style("font-size", 12)
		.text("Countries");

	//Y-axis Label
	svg.append("text")
		.attr("text-anchor", "middle")
		.attr("transform", "translate(-55," + h/2 + ")rotate(-90)")	//.attr("transform", "translate(-10," + (h/2 - 160) + ")")	
		.style("font-family", "Helvetica")
		.style("font-size", 12)
		.text("Migration in Europe");

	  //Color palette; colour-blind friendly
	  var color = d3.scaleOrdinal()
		.domain(stacks)
		.range(['#ffae49','#44a5c2', '#1f449c', '#3d65a5', '#a8b6cc'])

	  //Data Stacking
	  var stackedData = d3.stack()
		.keys(stacks)
		(data)
		
		//Drawing the Bars
		svg.append("g")
		.selectAll("g")
		.data(stackedData)	// Enter in the stack data = loop key per key = group per group
		.enter()
		.append("g")
		.attr("fill", function(d) { 
			return color(d.key); 
		})
		.selectAll("rect")
		.data(function(d) { 	
			return d; 
		})
		.enter()
		.append("rect")
		.attr("x", function(d) { 
			return xScale(d.data.Country); 
		})
		.attr("y", function(d) { 
		return yScale(d[1]); 
		})
		.attr("height", function(d) { 
			return yScale(d[0]) - yScale(d[1]); 
		})
		.attr("width",xScale.bandwidth());
		registerMouseovers();	//Mouseover effect
		
		
		
		console.log(data);
		var dataset2017=[];
		var dataset2018=[];
		var dataset2019=[];
		var dataset2020=[];
		var dataset2021=[];
		for (var i = 0; i<data.length;i++) {
			dataset2017[i] = data[i]["2017"];
			dataset2018[i] = data[i]["2018"];
			dataset2019[i] = data[i]["2019"];
			dataset2020[i] = data[i]["2020"];
			dataset2021[i] = data[i]["2021"];
		}
		var arcs2017 = svg2.selectAll("g.arc")//appends the arcs onto the svg
								.data(pie(dataset2017))
								.enter()
								.append("g")
								.attr("class","arc")
								.attr("transform","translate(" + outerRadius + "," + outerRadius + ")");
		d3.select("#pie2017")
			.on("click", function() {
				d3.select("#piechart").remove();
				var svg2 = d3.select("#chart2")
								 .append("svg")
								 .attr("width", w2)
								 .attr("height", h2)
								 .attr("id","piechart");
				var arcs2017 = svg2.selectAll("g.arc")//appends the arcs onto the svg
								.data(pie(dataset2017))
								.enter()
								.append("g")
								.attr("class","arc")
								.attr("transform","translate(" + outerRadius + "," + outerRadius + ")");
				arcs2017.append("path")//writes an arc to the piechart
						.attr("fill", function(d, i) {
							return pieColor(i);
						})
						.attr("d", function(d, i) {
							return arc(d, i);
						});
				arcs2017.append("text")//adds text to each of the objects in the piechart
					 .text(function(d, i){
						 return groups[i];
					 })
					 .attr("transform", function(d){
						 return "translate(" + arc.centroid(d) + ")";
					 });
			});
		d3.select("#pie2018")
			.on("click", function() {
				d3.select("#piechart").remove();
				var svg2 = d3.select("#chart2")
								 .append("svg")
								 .attr("width", w2)
								 .attr("height", h2)
								 .attr("id","piechart");
				var arcs2018 = svg2.selectAll("g.arc")//appends the arcs onto the svg
								.data(pie(dataset2018))
								.enter()
								.append("g")
								.attr("class","arc")
								.attr("transform","translate(" + outerRadius + "," + outerRadius + ")");
				arcs2018.append("path")//writes an arc to the piechart
						.attr("fill", function(d, i) {
							return pieColor(i);
						})
						.attr("d", function(d, i) {
							return arc(d, i);
						});
				arcs2018.append("text")//adds text to each of the objects in the piechart
					 .text(function(d, i){
						 return groups[i];
					 })
					 .attr("transform", function(d){
						 return "translate(" + arc.centroid(d) + ")";
					 });
			});
		
		d3.select("#pie2019")
			.on("click", function() {
				d3.select("#piechart").remove();
				var svg2 = d3.select("#chart2")
								 .append("svg")
								 .attr("width", w2)
								 .attr("height", h2)
								 .attr("id","piechart");
				var arcs2019 = svg2.selectAll("g.arc")//appends the arcs onto the svg
								.data(pie(dataset2019))
								.enter()
								.append("g")
								.attr("class","arc")
								.attr("transform","translate(" + outerRadius + "," + outerRadius + ")");
				arcs2019.append("path")//writes an arc to the piechart
						.attr("fill", function(d, i) {
							return pieColor(i);
						})
						.attr("d", function(d, i) {
							return arc(d, i);
						});
				arcs2019.append("text")//adds text to each of the objects in the piechart
					 .text(function(d, i){
						 return groups[i];
					 })
					 .attr("transform", function(d){
						 return "translate(" + arc.centroid(d) + ")";
					 });
				console.log(arcs2019);
			});
		
		d3.select("#pie2020")
			.on("click", function() {
				d3.select("#piechart").remove();
				var svg2 = d3.select("#chart2")
								 .append("svg")
								 .attr("width", w2)
								 .attr("height", h2)
								 .attr("id","piechart");
				var arcs2020 = svg2.selectAll("g.arc")//appends the arcs onto the svg
								.data(pie(dataset2020))
								.enter()
								.append("g")
								.attr("class","arc")
								.attr("transform","translate(" + outerRadius + "," + outerRadius + ")");
				arcs2020.append("path")//writes an arc to the piechart
						.attr("fill", function(d, i) {
							return pieColor(i);
						})
						.attr("d", function(d, i) {
							return arc(d, i);
						});
				arcs2020.append("text")//adds text to each of the objects in the piechart
					 .text(function(d, i){
						 return groups[i];
					 })
					 .attr("transform", function(d){
						 return "translate(" + arc.centroid(d) + ")";
					 });
				console.log(arcs2021);
			});
			
		d3.select("#pie2021")
			.on("click", function() {
				d3.select("#piechart").remove();
				var svg2 = d3.select("#chart2")
								 .append("svg")
								 .attr("width", w2)
								 .attr("height", h2)
								 .attr("id","piechart");
				var arcs2021 = svg2.selectAll("g.arc")//appends the arcs onto the svg
								.data(pie(dataset2021))
								.enter()
								.append("g")
								.attr("class","arc")
								.attr("transform","translate(" + outerRadius + "," + outerRadius + ")");
				arcs2021.append("path")//writes an arc to the piechart
						.attr("fill", function(d, i) {
							return pieColor(i);
						})
						.attr("d", function(d, i) {
							return arc(d, i);
						});
				arcs2021.append("text")//adds text to each of the objects in the piechart
					 .text(function(d, i){
						 return groups[i];
					 })
					 .attr("transform", function(d){
						 return "translate(" + arc.centroid(d) + ")";
					 });
				console.log(arcs2021);
			});
		
		
		arcs2017.append("path")//writes an arc to the piechart
				.attr("fill", function(d, i) {
					return pieColor(i);
				})
				.attr("d", function(d, i) {
					return arc(d, i);
				});
		arcs2017.append("text")//adds text to each of the objects in the piechart
			 .text(function(d, i){
				 return groups[i];
			 })
			 .attr("transform", function(d){
				 return "translate(" + arc.centroid(d) + ")";
			 });
		})
}	
window.onload = init;
