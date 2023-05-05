function init() {
	//Dimensions
    var w = 600;
    var h = 300;
	var padding  = 50;
	
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
				.domain([0, 300000])
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
		.attr("transform", "translate(-10," + (h/2 - 160) + ")")	//"translate(-30," + h/2 + ")rotate(-90)"
		.style("font-family", "Helvetica")
		.style("font-size", 7)
		.text("Migration in Europe");

	  //Color palette; colour-blind friendly
	  var color = d3.scaleOrdinal()
		.domain(stacks)
		.range(['#ffae49','#44a5c2', '#cfcfcf'])

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
		
		
		
		
		console.log(data);
		var dataset2016=[];
		var dataset2019=[];
		var dataset2021=[];
		for (var i = 0; i<data.length;i++) {
			dataset2016[i] = data[i]["2016"];
			dataset2019[i] = data[i]["2019"];
			dataset2021[i] = data[i]["2021"];
		}
		console.log(dataset2016);
		console.log(dataset2019);
		console.log(dataset2021);
		var arcs2016 = svg2.selectAll("g.arc")//appends the arcs onto the svg
								.data(pie(dataset2016))
								.enter()
								.append("g")
								.attr("class","arc")
								.attr("transform","translate(" + outerRadius + "," + outerRadius + ")");
		var arcs2021 = svg2.selectAll("g.arc")//appends the arcs onto the svg
								.data(pie(dataset2021))
								.enter()
								.append("g")
								.attr("class","arc")
								.attr("transform","translate(" + outerRadius + "," + outerRadius + ")");
		
		console.log(arcs2021);
		d3.select("#pie2016")
			.on("click", function() {
				d3.select("#piechart").remove();
				var svg2 = d3.select("#chart2")
								 .append("svg")
								 .attr("width", w2)
								 .attr("height", h2)
								 .attr("id","piechart");
				var arcs2016 = svg2.selectAll("g.arc")//appends the arcs onto the svg
								.data(pie(dataset2016))
								.enter()
								.append("g")
								.attr("class","arc")
								.attr("transform","translate(" + outerRadius + "," + outerRadius + ")");
				arcs2016.append("path")//writes an arc to the piechart
						.attr("fill", function(d, i) {
							return pieColor(i);
						})
						.attr("d", function(d, i) {
							return arc(d, i);
						});
				arcs2016.append("text")//adds text to each of the objects in the piechart
					 .text(function(d, i){
						 return groups[i];
					 })
					 .attr("transform", function(d){
						 return "translate(" + arc.centroid(d) + ")";
					 });
				console.log(arcs2016);
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
		
		
		
		arcs2016.append("path")//writes an arc to the piechart
				.attr("fill", function(d, i) {
					return pieColor(i);
				})
				.attr("d", function(d, i) {
					return arc(d, i);
				});
		arcs2016.append("text")//adds text to each of the objects in the piechart
			 .text(function(d, i){
				 return groups[i];
			 })
			 .attr("transform", function(d){
				 return "translate(" + arc.centroid(d) + ")";
			 });
		})
}	
window.onload = init;
