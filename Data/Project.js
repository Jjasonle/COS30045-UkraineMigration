function init() {
	//Dimensions
    var w = 600;
    var h = 300;
	var padding  = 100;
	
	var w2 = 300;
	var h2 = 300;
	var LegendW = 120;
	var outerRadius = w2/2;
	var innerRadius = 0;
	var arc = d3.arc()//creates the arcs
					.outerRadius(outerRadius)
					.innerRadius(innerRadius);
	var labelArc = d3.arc()
					.innerRadius(w2 / 3)
					.outerRadius(w2/2);
	var pie = d3.pie();
	var pieColor = d3.scaleOrdinal()
		.range(['#F05039','#E57A77', '#EEBAB4', '#1F449C', '#3D65A5' ,'#7CA1CC' ,'#A8B6CC'])
	// append the svg object to the body of the page
	var svg = d3.select("#chart")
				.append("svg")
				.attr("width", w + h + 40)	
				.attr("height", h + padding + 20)
				.append("g")
				.attr("transform", "translate(" + (padding + 30)/2 + "," + padding/2 + ")")
	var svg2 = d3.select("#chart2")
				.append("svg")
				.attr("width", w2+LegendW)
				.attr("height", h2)
				.attr("id","piechart");
	
	var svg3 = d3.select("#legend")
				.append("svg")
				.attr("width", 700)
				.attr("height", h - 500)
	
	var textbox = d3.select("#chart")
				.append("div")
				.style("opacity", 0)
				.attr("class", "tooltip")
				.style("border", "solid")
				.style("background-color", "white")
				.style("border-radius", "5px")
				.style("border-width", "1px")
				.style("padding", "5px")
				.style("position", "absolute")
	
	var textbox2 = d3.select("#chart2")
				.append("div")
				.style("opacity", 0)
				.attr("class", "tooltip")
				.style("border", "solid")
				.style("background-color", "white")
				.style("border-radius", "5px")
				.style("border-width", "1px")
				.style("padding", "5px")
				.style("position", "absolute")


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
		.call(xAxis);

	  //Axis - Y-axis
	  var yAxis = d3.axisLeft()
		.scale(yScale)
		.ticks(10);
		
	  svg.append("g")
		.call(yAxis);

	  var registerMouseovers = function () {	//Mouse over effect
		svg.selectAll("rect")
			.on("mouseover", function (d) {
				var stackName = d3.select(this.parentNode).datum().key;		//Retrieve the stack group name from csv
				var stackValue = d.data[stackName];			//Retrieves the data value of the stacks
				
				textbox		//Display Datavalue
				.html("Year: " + stackName + "<br>" + "Value: " + stackValue)
				.style("opacity", 1)
				
				d3.select(this)
				.transition()
				.duration(300)
				.attr("stroke-width", 3)
				.attr("stroke","#004d40")
			})
			.on("mousemove", function (d) {
			    textbox
				  .style("left", (d3.mouse(this)[0]+110) + "px") //Positioning of Data value textbox
				  .style("top", (d3.mouse(this)[1]+90) + "px")
			})
			.on("mouseout", function (d) {
				d3.select(this)
				.transition()
				.duration(300)
				.attr("stroke","none")
				textbox
				.style("opacity", 0)
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
		
		//Legend .range([ "#ffae49", "#44a5c2", "#1f449c", "#3d65a5", "#a8b6cc"]);
		svg.append("circle").attr("cx",620).attr("cy",70).attr("r", 6).style("fill", "#a8b6cc")
		svg.append("circle").attr("cx",620).attr("cy",100).attr("r", 6).style("fill", "#3d65a5")
		svg.append("circle").attr("cx",620).attr("cy",130).attr("r", 6).style("fill", "#1f449c")
		svg.append("circle").attr("cx",620).attr("cy",160).attr("r", 6).style("fill", "#44a5c2")
		svg.append("circle").attr("cx",620).attr("cy",190).attr("r", 6).style("fill", "#ffae49")
		svg.append("text").attr("x", 640).attr("y", 70).text("2021").style("font-size", "15px").attr("alignment-baseline","middle")
		svg.append("text").attr("x", 640).attr("y", 100).text("2020").style("font-size", "15px").attr("alignment-baseline","middle")
		svg.append("text").attr("x", 640).attr("y", 130).text("2019").style("font-size", "15px").attr("alignment-baseline","middle")
		svg.append("text").attr("x", 640).attr("y", 160).text("2018").style("font-size", "15px").attr("alignment-baseline","middle")	
		svg.append("text").attr("x", 640).attr("y", 190).text("2017").style("font-size", "15px").attr("alignment-baseline","middle")
		
		
		var dataset2017=[];
		var dataset2017total = 0;
		var dataset2018=[];
		var dataset2018total = 0;
		var dataset2019=[];
		var dataset2019total = 0;
		var dataset2020=[];
		var dataset2020total = 0;
		var dataset2021=[];
		var dataset2021total = 0;
		for (var i = 0; i<data.length;i++) {
			dataset2017[i] = data[i]["2017"];
			dataset2017total = dataset2017total + parseInt(data[i]["2017"]);
			dataset2018[i] = data[i]["2018"];
			dataset2018total = dataset2018total + parseInt(data[i]["2018"]);
			dataset2019[i] = data[i]["2019"];
			dataset2019total = dataset2019total + parseInt(data[i]["2019"]);
			dataset2020[i] = data[i]["2020"];
			dataset2020total = dataset2020total + parseInt(data[i]["2020"]);
			dataset2021[i] = data[i]["2021"];
			dataset2021total = dataset2021total + parseInt(data[i]["2021"]);
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
								 .attr("width", w2+LegendW)
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
					 .attr("transform", function (d) {
						return "translate(" + labelArc.centroid(d) + ")";
					 })
					 .attr("text-anchor", "middle")
					 .text(function(d, i){
						 return parseFloat(parseInt(dataset2017[i])/dataset2017total*100).toFixed(2)+"%";
					 });
				var y =40;
				for(var i = 0;i<dataset2017.length;i++){
				svg2.append("circle").attr("cx",320).attr("cy",y).attr("r", 6).style("fill", function(){return pieColor(i)})
				svg2.append("text").attr("x", 340).attr("y", y).text(function(){return groups[i]}).style("font-size", "15px").attr("alignment-baseline","middle")
				y=y+30;
				}
			});
		d3.select("#pie2018")
			.on("click", function() {
				d3.select("#piechart").remove();
				var svg2 = d3.select("#chart2")
								 .append("svg")
								 .attr("width", w2+LegendW)
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
					 .attr("transform", function (d) {
						return "translate(" + labelArc.centroid(d) + ")";
					 })
					 .attr("text-anchor", "middle")
					 .text(function(d, i){
						 return parseFloat(parseInt(dataset2018[i])/dataset2018total*100).toFixed(2)+"%";
					 });
				var y =40;
				for(var i = 0;i<dataset2018.length;i++){
				svg2.append("circle").attr("cx",320).attr("cy",y).attr("r", 6).style("fill", function(){return pieColor(i)})
				svg2.append("text").attr("x", 340).attr("y", y).text(function(){return groups[i]}).style("font-size", "15px").attr("alignment-baseline","middle")
				y=y+30;
				}
			});
		
		d3.select("#pie2019")
			.on("click", function() {
				d3.select("#piechart").remove();
				var svg2 = d3.select("#chart2")
								 .append("svg")
								 .attr("width", w2+LegendW)
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
					 .attr("transform", function (d) {
						return "translate(" + labelArc.centroid(d) + ")";
					 })
					 .attr("text-anchor", "middle")
					 .text(function(d, i){
						 return parseFloat(parseInt(dataset2019[i])/dataset2019total*100).toFixed(2)+"%";
					 });
				var y =40;
				for(var i = 0;i<dataset2019.length;i++){
				svg2.append("circle").attr("cx",320).attr("cy",y).attr("r", 6).style("fill", function(){return pieColor(i)})
				svg2.append("text").attr("x", 340).attr("y", y).text(function(){return groups[i]}).style("font-size", "15px").attr("alignment-baseline","middle")
				y=y+30;
				}
			});
		
		d3.select("#pie2020")
			.on("click", function() {
				d3.select("#piechart").remove();
				var svg2 = d3.select("#chart2")
								 .append("svg")
								 .attr("width", w2+LegendW)
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
					 .attr("transform", function (d) {
						return "translate(" + labelArc.centroid(d) + ")";
					 })
					 .attr("text-anchor", "middle")
					 .text(function(d, i){
						 return parseFloat(parseInt(dataset2020[i])/dataset2020total*100).toFixed(2)+"%";
					 });
				var y =40;
				for(var i = 0;i<dataset2020.length;i++){
				svg2.append("circle").attr("cx",320).attr("cy",y).attr("r", 6).style("fill", function(){return pieColor(i)})
				svg2.append("text").attr("x", 340).attr("y", y).text(function(){return groups[i]}).style("font-size", "15px").attr("alignment-baseline","middle")
				y=y+30;
				}
			});
			
		d3.select("#pie2021")
			.on("click", function() {
				d3.select("#piechart").remove();
				var svg2 = d3.select("#chart2")
								 .append("svg")
								 .attr("width", w2+LegendW)
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
					 .attr("transform", function (d) {
						return "translate(" + labelArc.centroid(d) + ")";
					 })
					 .attr("text-anchor", "middle")
					 .text(function(d, i){
						 return "%"+ parseFloat(parseInt(dataset2021[i])/dataset2021total*100).toFixed(2);;
					 });
				var y =40;
				for(var i = 0;i<dataset2021.length;i++){
				svg2.append("circle").attr("cx",320).attr("cy",y).attr("r", 6).style("fill", function(){return pieColor(i)})
				svg2.append("text").attr("x", 340).attr("y", y).text(function(){return groups[i]}).style("font-size", "15px").attr("alignment-baseline","middle")
				y=y+30;
				}
			});
		
		
		arcs2017.append("path")//writes an arc to the piechart
				.attr("fill", function(d, i) {
					return pieColor(i);
				})
				.attr("d", function(d, i) {
					return arc(d, i);
				}).on("mouseover", function (d, i) {
				textbox2		//Display Datavalue
				.html("Country: " + groups[i] + "<br>" + "Value: " + dataset2017[i])
				.style("opacity", 1)
				
				d3.select(this)
				.transition()
				.duration(300)
				.attr("stroke-width", 3)
				.attr("stroke","#004d40")
				})
				.on("mousemove", function (d) {
					 textbox2
					  .style("left", (d3.mouse(this)[0]+110) + "px") //Positioning of Data value textbox
					  .style("top", (d3.mouse(this)[1]+90) + "px")
				})
				.on("mouseout", function (d) {
					d3.select(this)
					.transition()
					.duration(300)
					.attr("stroke","none")
					textbox2
					.style("opacity", 0)
				});
		arcs2017.append("text")
				.attr("transform", function (d) {
				return "translate(" + labelArc.centroid(d) + ")";
					 })
				.attr("text-anchor", "middle")
				.text(function(d, i){
						 return parseFloat(parseInt(dataset2017[i])/dataset2017total*100).toFixed(2)+"%";
					 });
		var y =40;
		for(var i = 0;i<dataset2017.length;i++){
		svg2.append("circle").attr("cx",320).attr("cy",y).attr("r", 6).style("fill", function(){return pieColor(i)})
		svg2.append("text").attr("x", 340).attr("y", y).text(function(){return groups[i]}).style("font-size", "15px").attr("alignment-baseline","middle")
		y=y+30;
		}
		})
}	
window.onload = init;
