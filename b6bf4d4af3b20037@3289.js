// https://observablehq.com/@socrano/ds4200-final-project@3289
import define1 from "./a2e58f97fd5e8d7c@568.js";
import define2 from "./a33468b95d0b15b0@703.js";
import define3 from "./7764a40fe6b83ca1@427.js";
import define4 from "./e93997d5089d7165@2303.js";

export default function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([["MA-25-massachusetts-counties.json",new URL("./files/def5773e651eac21f3a784cc5275b627a1fb7c310b4d0b8910348ebef048ad9d952e1f2cae8b21e62fd54b442964c935ff76dbab69c8ae32d73014891714f4aa",import.meta.url)],["MA Dataset sample 2000.json",new URL("./files/ed796572dc6353a054b5aeb452be522ad9f7a669e68d4c46b2292e9a093a379284ea48f741a61f631c681e52f380d5a50f374171c60fbadd56d741e5e179267f",import.meta.url)],["Income.csv",new URL("./files/a18f4c376616f1605b2be4dea94d55de94e0813726b142b64b1b34505deef285cd3db1811ad204027eb33b4427ca6be96b27680483432075e8f5921b03ea535e",import.meta.url)],["boxplot.png",new URL("./files/502ac294e9cb104eb2994ca24e69e43667fb5cc66d70caccb34de51ccd792159b157c19d7c5223edcdfe10a2773a550094453340ec15feb9428c64e96e7a8ec7",import.meta.url)]]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer("maintitle")).define("maintitle", ["md"], function(md){return(
md` # Analysis and Recommendation for restaurants in Boston`
)});
  main.variable(observer("a")).define("a", ["md"], function(md){return(
md`This project is a visualization series built for a recommendation Engine based on yelp dataset and we use cloud-based neo4j server to store and retrieve data.

Created by Ruizhe Qiu, Tianhao Qu`
)});
  main.variable(observer("title0")).define("title0", ["md"], function(md){return(
md`## Data Overview`
)});
  main.variable(observer("overviewmd")).define("overviewmd", ["md"], function(md){return(
md`Everything below is the overview for all restaurants stored in our cloud server. We reconstructed our data retrieved from neo4j server so that it is Javascript friendly.

**Please patiently wait for 10-30 seconds, depending on your computer performance, for everything to load from the cloud server. There is a lot of data. Refresh the page if nothing is displayed.**

**If you want to see the code for each part, hover your mouse to the left side of the cell and you will then see three dots, click on it and then click "edit" (Or simply click on the left side of the cell).**`
)});
  main.variable(observer("title1")).define("title1", ["md"], function(md){return(
md` ### Relationship between Stars and Review Count`
)});
  main.variable(observer("title2")).define("title2", ["md","FileAttachment"], async function(md,FileAttachment){return(
md`#### Intro to Box Plot

Quartiles divide a rank-ordered data set into four equal parts. The values that divide each part are called the first, second, and third quartiles; and they are denoted by Q1, Q2, and Q3, respectively.

* Q1 is the "middle" value in the first half of the rank-ordered data set.
* Q2 is the median value in the set.
* Q3 is the "middle" value in the second half of the rank-ordered data set

<figure>
  <img src="${await FileAttachment("boxplot.png").url()}" style="background: #6d6359; width: 640px; height: 195px; max-height: calc(0.618 * (100vw - 28px));">
  <figcaption>Photo and more information: [Box Plot/Wikimedia](https://en.wikipedia.org/wiki/Box_plot#Elements_of_a_box_plot)</figcaption>
</figure>`
)});
  main.variable(observer("review_boxplot")).define("review_boxplot", ["vl","allResWithTheirInfo"], function(vl,allResWithTheirInfo)
{
  const a = vl.markBoxplot()
  .data(allResWithTheirInfo)
  .encode(
    vl.x().fieldQ("review_count").scale({type: "sqrt"}),
    vl.y().fieldN("stars"),
    vl.color().fieldN("stars"),
    vl.tooltip([
      { field: "name", type: "Categorical"},
      { field: "address", type: "Categorical"},
      { field: "review_count", type: "quantitative" }
    ])
    );
  
  return a.render()
}
);
  main.variable(observer("viewof stackedBar")).define("viewof stackedBar", ["vl","allResWithTheirInfo"], function(vl,allResWithTheirInfo){return(
vl.markBar()
  .data(allResWithTheirInfo)
  .encode(
    vl.x().fieldQ("review_count").scale({type: "sqrt"}).bin({maxbins: 100}),
    vl.y().count(),
    vl.color().fieldN("stars").sort(vl.fieldQ("stars").order("descending")),
    vl.tooltip([
      { field: "name", type: "Categorical"},
      { field: "address", type: "Categorical"},
      { field: "review_count", type: "quantitative" }
    ])
  )
  .render()
)});
  main.variable(observer("stackedBar")).define("stackedBar", ["Generators", "viewof stackedBar"], (G, _) => G.input(_));
  main.variable(observer("dist1")).define("dist1", ["md"], function(md){return(
md` ### Distribution of Categories in Different Area`
)});
  main.variable(observer("zip_food")).define("zip_food", ["vl","zipcode_food"], function(vl,zipcode_food)
{
  const zipAndFood = vl.markCircle()
  .data(zipcode_food)
  .encode(
    vl.y().fieldO("zip"), 
    vl.x().fieldO("food"),
    vl.size().sum("count")
  );
 
 return zipAndFood.render();
}
);
  main.variable(observer("location")).define("location", ["md"], function(md){return(
md` ### Location Overview`
)});
  main.variable(observer("geo_1")).define("geo_1", ["geometry","data"], function(geometry,data){return(
geometry(data.nodes)
)});
  main.variable(observer("gmap1")).define("gmap1", ["md"], function(md){return(
md` #### Google Map

We integrated Google Map API to our front end. This visualization is very useful to locate precise location for these restaurants.`
)});
  main.variable(observer("allDataGoogle")).define("allDataGoogle", ["html","google","data"], function*(html,google,data)
{
  let div = html`<div style='height:400px;'></div>`;

  const mapHolder = [0];

  // Like Leaflet and Mapbox GL JS, Google Maps is very picky about
  // needing to be initialized on a div that's already included
  // in the page. So I yield the div first, to establish it in
  // the page.
  yield div;
  let map = new google.maps.Map(div, {
    center: { lng: -71, lat: 42.5 },
    zoom: 10
  });
  mapHolder[0] = map;
  
  const marker = data.nodes.map(
    p =>
      new google.maps.Marker({
        position: { lng: p.longitude, lat: p.latitude },
        map: mapHolder[0],
        title: p.name,
      })
  );
}
);
  main.variable(observer("atitle1")).define("atitle1", ["md"], function(md){return(
md`Restaurant for different counties (Entire dataset)`
)});
  main.variable(observer("restaurant_by_city")).define("restaurant_by_city", ["data","countRelations","vl","d3"], function(data,countRelations,vl,d3)
{
  var field = "City"
  var array = data.nodes.filter(d => d.Label === field);
  array.map(d => d.count = countRelations(d, data)).filter(d => d.count !== 0);
  array = array.filter(d => d.count >= 40);
  
  const bar = vl.markBar()
  .data(array)
  .encode(
    vl.x().fieldQ("count"),
    vl.y().fieldN("name"),
    vl.color().fieldN("name"),
      vl.tooltip([
      { field: "name", type: "Categorical"},
      { field: "count", type: "quantitative" }
    ])

  )
  
  const color = d3.scaleSequential(d3.interpolateViridis).domain([0, array.length-1]);
  
  const colors = {
    domain: array.map(d=>d.group),
    range: array.map( (i,j) => color(j) )
  };
  
  
  return vl.hconcat(
    vl.layer(bar)
  ).render();
  // return array;
}
);
  main.variable(observer("typicalsearch")).define("typicalsearch", ["md"], function(md){return(
md`## Typical Search`
)});
  main.variable(observer("tsearch_explain")).define("tsearch_explain", ["md"], function(md){return(
md`Typical way of search is to search base on attributes. The user can search by selecting stars, cities and Categories. 

Users can also search for specific restaurants by finding and selecting them in the table below. We implemented multi-select functionality. To do multiple select, simply use ctrl + left click to select multiple items, or use ctrl + A to select all.

`
)});
  main.variable(observer("viewof starfilter")).define("viewof starfilter", ["Select","starArray"], function(Select,starArray){return(
Select(starArray, {
  multiple: true,
  label: "Stars:",
  value: starArray
})
)});
  main.variable(observer("starfilter")).define("starfilter", ["Generators", "viewof starfilter"], (G, _) => G.input(_));
  main.variable(observer("viewof cityfilter")).define("viewof cityfilter", ["Select","cityArray"], function(Select,cityArray){return(
Select(cityArray, {
  multiple: true,
  label: "Cities:",
  value: ["Boston"]
})
)});
  main.variable(observer("cityfilter")).define("cityfilter", ["Generators", "viewof cityfilter"], (G, _) => G.input(_));
  main.variable(observer("viewof categoryfilter")).define("viewof categoryfilter", ["Select","categoryArray"], function(Select,categoryArray){return(
Select(categoryArray, {
  multiple: true,
  label: "Categories:",
  value: ["Breakfast&Brunch"]
})
)});
  main.variable(observer("categoryfilter")).define("categoryfilter", ["Generators", "viewof categoryfilter"], (G, _) => G.input(_));
  main.variable(observer("viewof result")).define("viewof result", ["Table","data"], function(Table,data){return(
Table(data.nodes.filter(d => d.Label === "Restaurant"), {
  columns: ['name', 'address', 'Label']
})
)});
  main.variable(observer("result")).define("result", ["Generators", "viewof result"], (G, _) => G.input(_));
  main.variable(observer("d3inst")).define("d3inst", ["md"], function(md){return(
md`**Please read this before interacting with visualizations below.**

Visualization below is built using d3.js. Click on the node to see details regarding the node as well as connections it has. Click again on the selected node to go back to normal mode, or click on another node to see details about that node. You can drag any node you want and click on the reset graph button if you want all nodes back into default position. Use color legend to identify type of nodes. All filters specified above will be reflected in all visualizations below. Click on the left side of the visualization to see its source code.

For the tooltip displayed when you click on each node: 
* **Item** is the *name of the node*.
* **Type** is the *type of the node*. (You can also use color legend to identify)
* **Count** is the numbers of nodes that have connections with the selected node. Size of the node varies depending on this variable. More connections means larger node, vice versa.`
)});
  main.variable(observer("viewof reset")).define("viewof reset", ["Button"], function(Button){return(
Button("Reset Graph (Click this if you want all nodes back to default position)")
)});
  main.variable(observer("reset")).define("reset", ["Generators", "viewof reset"], (G, _) => G.input(_));
  main.variable(observer("viewof legend")).define("viewof legend", ["chart","swatches","color"], function(chart,swatches,color)
{
  // recompute when the data changes
  chart;
  return swatches({ color: color.scale });
}
);
  main.variable(observer("legend")).define("legend", ["Generators", "viewof legend"], (G, _) => G.input(_));
  main.variable(observer("chart")).define("chart", ["data","linkfilterer","nodefilterer","d3","x","width","height","radius","color","drag","reset","releasenode","invalidation"], function(data,linkfilterer,nodefilterer,d3,x,width,height,radius,color,drag,reset,releasenode,invalidation)
{
  const nodes_og_data = data.nodes.map(d => Object.create(d));
  const links = linkfilterer(data).map(d => Object.create(d));
  const nodes = nodefilterer(data).map(d => Object.create(d));

  const simulation = d3
    .forceSimulation(nodes)
    .force(
      "link",
      d3
        .forceLink(links)
        .id(d => d.ID)
        .strength(0.001)
    )
    .force("charge", d3.forceManyBody())
    .force("x", d3.forceX(d => x(d.Label)).strength(0.3))
    .force("y", d3.forceY());

  const svg = d3
    .create("svg")
    .attr("viewBox", [-width / 1.5, -height / 1.8, width * 1.5, height * 1.5]);

  const link = svg
    .append("g")
    .attr("stroke", "#999")
    .attr("stroke-opacity", 0.3)
    .selectAll("line")
    .data(links)
    .join("line")
    .attr("stroke-width", d => Math.sqrt(d.value));

  const tooltipx = 250;
  const tooltipy = -270;

  const node = svg
    .append("g")
    .attr("stroke", "#fff")
    .attr("stroke-width", 1.5)
    .selectAll(".node")
    .data(nodes)
    .join("circle")
    .attr("r", function(d) {
      return radius(d.radius) || 1;
    })
    .attr("fill", color)
    .on("click", onMouseClick)
    // .on("mouseenter", onMouseEnter)
    // .on("mouseleave", onMouseLeave)
    .call(drag(simulation));

  const tooltip = svg
    .append("text")
    .attr("fill", "black")
    // .attr("x", tooltipx)
    // .attr("y", tooltipy)
    .attr("font-size", 22)
    .text("");

  const tooltip2 = svg
    .append("text")
    .attr("fill", "black")
    // .attr("x", tooltipx)
    // .attr("y", tooltipy + 22)
    .attr("font-size", 22)
    .text("");

  const tooltip_address = svg
    .append("text")
    .attr("fill", "black")
    // .attr("x", tooltipx)
    // .attr("y", tooltipy + 44)
    .attr("font-size", 22)
    .text("");

  const tooltip_count = svg
    .append("text")
    .attr("fill", "black")
    .attr("font-size", 22)
    .text("");

  if (reset) {
    releasenode(simulation);
  }

  var isTooltipHidden = true;
  var isClicked = false;
  var previous_id = "";

  function onMouseClick(evt, d) {
    var xpos = d.x + 20;
    var ypos = d.y;
    var link_count = links.filter(
      a => a.source.ID === d.ID || a.target.ID === d.ID
    ).length;
    if (isClicked == false) {
      tooltip
        .text("Item: " + d.name)
        .attr("x", xpos)
        .attr("y", ypos);
      tooltip2
        .text("Type: " + d.Label)
        .attr("x", xpos)
        .attr("y", ypos + 22);
      tooltip_count
        .text("Count: " + link_count)
        .attr("x", xpos)
        .attr("y", ypos + 44);
      if (d.Label === "restaurant") {
        tooltip_address
          .text("Address: " + d.address)
          .attr("x", xpos)
          .attr("y", ypos + 66);
      }
      previous_id = d.ID;
      link
        .attr("display", "none")
        .filter(l => {
          return l.source.ID === d.ID || l.target.ID === d.ID;
        })
        .attr("display", "block");

      isClicked = true;
    } else if (isClicked == true && d.ID != previous_id) {
      tooltip
        .text("Item: " + d.name)
        .attr("x", xpos)
        .attr("y", ypos);
      tooltip2
        .text("Type: " + d.Label)
        .attr("x", xpos)
        .attr("y", ypos + 22);

      if (d.Label != "city" || d.Label != "state") {
        tooltip_count
          .text("Count: " + link_count)
          .attr("x", xpos)
          .attr("y", ypos + 44);
      }

      if (d.Label === "restaurant") {
        tooltip_address
          .text("Address: " + d.address)
          .attr("x", xpos)
          .attr("y", ypos + 66);
      } else {
        tooltip_address.text("");
      }
      previous_id = d.ID;
      link
        .attr("display", "none")
        .filter(l => {
          return l.source.ID === d.ID || l.target.ID === d.ID;
        })
        .attr("display", "block");
      isClicked = true;
    } else {
      tooltip.text("");
      tooltip2.text("");
      tooltip_count.text("");
      tooltip_address.text("");
      link.attr("display", "block");
      isClicked = false;
    }
  }

  //Simple tooltip (Maybe I can do a better one)
  node.append("title").text(d => d.Label + ": " + d.name);

  simulation.on("tick", () => {
    link
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);

    node.attr("cx", d => d.x).attr("cy", d => d.y);
  });

  invalidation.then(() => simulation.stop());

  let transform = d3.zoomIdentity;

  // // Zoom functionality (Geometrical Zoom, Experimental Functionality)
  //   svg.call(
  //     d3
  //       .zoom()
  //       .extent([[0, 0], [width, height]])
  //       .scaleExtent([1, 8])
  //       .on("zoom", zoomed)
  //   );

  //   function zoomed({ transform }) {
  //     svg.attr("transform", transform);
  //   }

  return svg.node();
}
);
  main.variable(observer("pcategory")).define("pcategory", ["md"], function(md){return(
md` ### Most popular categories:

This visualization is built to answer a business question: If I own a restaurant and I want to attract more customers by adding more things into the menu, what are some of the best options available?

The visualization below can recommend some of the most popular categories of food that selected type of restaurant also offers by displaying their rating distribution. Keep in mind that all the categories shown below are in addition to the selected category. For example, if "American(New)" column shows up in the visualization, all the restaurants that we take into account when calculating distribution are restaurant that offers "American(new)" plus the category that you selected above. The user can compare between rating distribution of selected food category alone and selected + X (Recommended by the system).


`
)});
  main.variable(observer("ct1")).define("ct1", ["md"], function(md){return(
md`This visualization is for count. Demonstrate popularity.`
)});
  main.variable(observer("popular_categories_count")).define("popular_categories_count", ["vl","popular_categories"], function(vl,popular_categories){return(
vl
  .markBar()
  .data(popular_categories.flat())
  .encode(
    vl.y().fieldN("category"),
    vl.color().fieldN("category"),
    vl.x().count("category"),
    vl.tooltip([
      { field: "category", type: "categorical" }
    ])
  )
  .render()
)});
  main.variable(observer("rt1")).define("rt1", ["md"], function(md){return(
md`This is the rating distribution for each of the popular category. (By Percentage %)`
)});
  main.variable(observer("popular_categories_rating")).define("popular_categories_rating", ["vl","sorted_percentage"], function(vl,sorted_percentage){return(
vl
  .markBar()
  .height(120)
  .data(sorted_percentage)
  .encode(
    vl
      .row()
      .fieldN("category"),
    vl.y().fieldN("star"),
    vl.color().fieldN("category"),
    vl.x().fieldQ("percentage"),
    vl.tooltip([
      { field: "percentage", type: "quantitative" }
    ])
  )
  .render()
)});
  main.variable(observer("gmap2")).define("gmap2", ["md"], function(md){return(
md`### Google Map (For precise location)`
)});
  main.variable(observer("firstTypeSearchDataGoogle")).define("firstTypeSearchDataGoogle", ["html","google","filterData"], function*(html,google,filterData)
{
  let div = html`<div style='height:400px;'></div>`;

  const mapHolder = [0];

  // Like Leaflet and Mapbox GL JS, Google Maps is very picky about
  // needing to be initialized on a div that's already included
  // in the page. So I yield the div first, to establish it in
  // the page.
  yield div;
  let map = new google.maps.Map(div, {
    center: { lng: -71, lat: 42.5 },
    zoom: 10
  });
  mapHolder[0] = map;
  
  const marker = filterData.nodes.map(
    p =>
      new google.maps.Marker({
        position: { lng: p.longitude, lat: p.latitude },
        map: mapHolder[0],
        title: p.name,
      })
  );
}
);
  main.variable(observer("smartsearch_title")).define("smartsearch_title", ["md"], function(md){return(
md`## SmartSearch(Something we do to demonstrate the potential of the system)`
)});
  main.variable(observer("smart_intro")).define("smart_intro", ["md"], function(md){return(
md`Third Type of search requires you to enter a city, a restaurant as well as the day of the week to provide recommendations. Recommended restaurants will be similar to the restaurant you entered, all located in the specified city and opening on the specified day.`
)});
  main.variable(observer("viewof cityForThird")).define("viewof cityForThird", ["Select","cityArray"], function(Select,cityArray){return(
Select(cityArray.concat("No preference"), {
  multiple: false,
  label: "Cities:",
  value: "Boston"
})
)});
  main.variable(observer("cityForThird")).define("cityForThird", ["Generators", "viewof cityForThird"], (G, _) => G.input(_));
  main.variable(observer("viewof Restaurant")).define("viewof Restaurant", ["text"], function(text){return(
text({title: "Restaurant", placeholder: "Put your restaurant here!", value: "Taco Bell"})
)});
  main.variable(observer("Restaurant")).define("Restaurant", ["Generators", "viewof Restaurant"], (G, _) => G.input(_));
  main.variable(observer("viewof timeForThird")).define("viewof timeForThird", ["Select","timeArray"], function(Select,timeArray){return(
Select(timeArray, {
  multiple: false,
  label: "Time:"
})
)});
  main.variable(observer("timeForThird")).define("timeForThird", ["Generators", "viewof timeForThird"], (G, _) => G.input(_));
  main.variable(observer("thirdTypeSearchNetWork")).define("thirdTypeSearchNetWork", ["thirdTypeFinalArray","d3","x","width","height","radius","color","drag","reset","releasenode","invalidation"], function(thirdTypeFinalArray,d3,x,width,height,radius,color,drag,reset,releasenode,invalidation)
{
  const nodes_og_data = thirdTypeFinalArray.nodes.map(d => Object.create(d));
  const links = thirdTypeFinalArray.links.map(d => Object.create(d));
  const nodes = thirdTypeFinalArray.nodes.map(d => Object.create(d));

  const simulation = d3
    .forceSimulation(nodes)
    .force(
      "link",
      d3
        .forceLink(links)
        .id(d => d.ID)
        .strength(0.001)
    )
    .force("charge", d3.forceManyBody())
    .force("x", d3.forceX(d => x(d.Label)).strength(0.3))
    .force("y", d3.forceY());
  // .force("x", d3.forceCenter(d => x(d.group)).strength(0.3))
  // .force("y", d3.forceCenter(d => y(d.group)).strength(0.3));

  const svg = d3
    .create("svg")
    .attr("viewBox", [-width / 1.5, -height / 1.8, width * 1.5, height * 1]);

  const link = svg
    .append("g")
    .attr("stroke", "#999")
    .attr("stroke-opacity", 0.3)
    .selectAll("line")
    .data(links)
    .join("line")
    .attr("stroke-width", d => Math.sqrt(d.value));

  const tooltipx = 250;
  const tooltipy = -270;

  const node = svg
    .append("g")
    .attr("stroke", "#fff")
    .attr("stroke-width", 1.5)
    .selectAll(".node")
    .data(nodes)
    .join("circle")
    .attr("r", function(d) {
      return radius(d.radius)*2 || 1;
    })
    .attr("fill", color)
    .on("click", onMouseClick)
    // .on("mouseenter", onMouseEnter)
    // .on("mouseleave", onMouseLeave)
    .call(drag(simulation));

  const tooltip = svg
    .append("text")
    .attr("fill", "black")
    // .attr("x", tooltipx)
    // .attr("y", tooltipy)
    .attr("font-size", 22)
    .text("");

  const tooltip2 = svg
    .append("text")
    .attr("fill", "black")
    // .attr("x", tooltipx)
    // .attr("y", tooltipy + 22)
    .attr("font-size", 22)
    .text("");

  const tooltip_address = svg
    .append("text")
    .attr("fill", "black")
    // .attr("x", tooltipx)
    // .attr("y", tooltipy + 44)
    .attr("font-size", 22)
    .text("");

  const tooltip_count = svg
    .append("text")
    .attr("fill", "black")
    .attr("font-size", 22)
    .text("");

  if (reset) {
    releasenode(simulation);
  }

  var isTooltipHidden = true;
  var isClicked = false;
  var previous_id = "";

  function onMouseClick(evt, d) {
    var xpos = d.x + 20;
    var ypos = d.y;
    var link_count = links.filter(
      a => a.source.ID === d.ID || a.target.ID === d.ID
    ).length;
    if (isClicked == false) {
      tooltip
        .text("Item: " + d.name)
        .attr("x", xpos)
        .attr("y", ypos);
      tooltip2
        .text("Type: " + d.Label)
        .attr("x", xpos)
        .attr("y", ypos + 22);
      tooltip_count
        .text("Count: " + link_count)
        .attr("x", xpos)
        .attr("y", ypos + 44);
      if (d.Label === "restaurant") {
        tooltip_address
          .text("Address: " + d.address)
          .attr("x", xpos)
          .attr("y", ypos + 66);
      }
      previous_id = d.ID;
      link
        .attr("display", "none")
        .filter(l => {
          return l.source.ID === d.ID || l.target.ID === d.ID;
        })
        .attr("display", "block");

      isClicked = true;
    } else if (isClicked == true && d.ID != previous_id) {
      tooltip
        .text("Item: " + d.name)
        .attr("x", xpos)
        .attr("y", ypos);
      tooltip2
        .text("Type: " + d.Label)
        .attr("x", xpos)
        .attr("y", ypos + 22);

      if (d.Label != "city" || d.Label != "state") {
        tooltip_count
          .text("Count: " + link_count)
          .attr("x", xpos)
          .attr("y", ypos + 44);
      }

      if (d.Label === "restaurant") {
        tooltip_address
          .text("Address: " + d.address)
          .attr("x", xpos)
          .attr("y", ypos + 66);
      } else {
        tooltip_address.text("");
      }
      previous_id = d.ID;
      link
        .attr("display", "none")
        .filter(l => {
          return l.source.ID === d.ID || l.target.ID === d.ID;
        })
        .attr("display", "block");
      isClicked = true;
    } else {
      tooltip.text("");
      tooltip2.text("");
      tooltip_count.text("");
      tooltip_address.text("");
      link.attr("display", "block");
      isClicked = false;
    }
  }

  //Simple tooltip (Maybe I can do a better one)
  node.append("title").text(d => d.Label + ": " + d.name);

  simulation.on("tick", () => {
    link
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);

    node.attr("cx", d => d.x).attr("cy", d => d.y);
  });

  invalidation.then(() => simulation.stop());

  let transform = d3.zoomIdentity;

  // // Zoom functionality (Geometrical Zoom, Experimental Functionality)
  //   svg.call(
  //     d3
  //       .zoom()
  //       .extent([[0, 0], [width, height]])
  //       .scaleExtent([1, 8])
  //       .on("zoom", zoomed)
  //   );

  //   function zoomed({ transform }) {
  //     svg.attr("transform", transform);
  //   }

  return svg.node();
}
);
  main.variable(observer("stardist2")).define("stardist2", ["md"], function(md){return(
md`### Star Distribution`
)});
  main.variable(observer("starBarAndPie")).define("starBarAndPie", ["barAndPiechart","thirdTypeFinalArray"], function(barAndPiechart,thirdTypeFinalArray){return(
barAndPiechart(thirdTypeFinalArray, "stars")
)});
  main.variable(observer("gmap3")).define("gmap3", ["md"], function(md){return(
md`### Google Map: Precise location`
)});
  main.variable(observer("ThirdTypeSearchDataGoogle")).define("ThirdTypeSearchDataGoogle", ["html","google","thirdTypeFinalArray"], function*(html,google,thirdTypeFinalArray)
{
  let div = html`<div style='height:400px;'></div>`;

  const mapHolder = [0];

  // Like Leaflet and Mapbox GL JS, Google Maps is very picky about
  // needing to be initialized on a div that's already included
  // in the page. So I yield the div first, to establish it in
  // the page.
  yield div;
  let map = new google.maps.Map(div, {
    center: { lng: -71, lat: 42.5 },
    zoom: 10
  });
  mapHolder[0] = map;
  
  const marker = thirdTypeFinalArray.nodes.map(
    p =>
      new google.maps.Marker({
        position: { lng: p.longitude, lat: p.latitude },
        map: mapHolder[0],
        title: p.name,
      })
  );
}
);
  main.variable(observer("data_abstraction")).define("data_abstraction", ["md"], function(md){return(
md`## Data Abstraction:
The data is from YELP, but we download it from Kaggle:
https://www.kaggle.com/yelp-dataset/yelp-dataset?select=yelp_academic_dataset_business.json

The original dataset is a JSON file. It includes most businesses in great cities of Canada and the US, and their information like the position and their attributes.

We clean the data and select the data we want. The final dataset only includes the restaurants, and their stars, position, zip code, city, states, and food type. We finish this step by Jupyter Notebook: https://colab.research.google.com/drive/1XeoOHY9GAYoVfmaOxdNDz0wuhqLCYfKg?usp=sharing

Then we import the data to Neo4j and use neo4j as a server.

The original dataset type: Table

The final dataset type: Network

Items (Nodes):
* City - The city restaurants located.
* Food - The food type restaurants provide.
* Hours - The day restaurant is open.
* Restaurant - Certain restaurant.
* State - The state cities belong to.
* stars - The average evaluation of restaurants from the customers.

Links (Relationships):
* Assoc - Our network is not complicated, so we do not specify the relationships.

Attributes:
* Stars - The attribute of node stars, shows the number of stars a restaurant gets. (Quantitative)
* Time - Shows when will a restaurant be open on a certain day (like Monday). (Temporal)
* ZIPCode - The zip code of a certain restaurant. (Categorical)
* address - The address of a certain restaurant. (Categorical)
* categories - The food type shown by Food node. (Categorical)
* city - The city name of City node. (Categorical)
* latitude - The latitude of a certain restaurant. (Quantitative)
* longitude - The longitude of a certain restaurant. (Quantitative)
* name - The name of a certain restaurant. (Categorical)
* state - The name of State node. (Categorical)

We processing the data to present the nodes and links in different tables at the beginning of this page. It can help you understand the data more easily.

#### Ordering Direction:
Longitude, latitude, and Time are *cyclic*, Stars is *Sequential*

#### Data Availability: 
*Dynamic*
`
)});
  main.variable(observer("insights")).define("insights", ["md"], function(md){return(
md`## Insight:
#### Insight 1: (Ruizhe)

The review count mean of 5 stars restaurants in Boston is only 15, which is 15% of the review count mean of 4 stars restaurants.

The review count usually has positive relationship with customers number. In this case, this insight can lead to two possible thinking: 1. This insight mean the customers number of 5 stars restaurants is much less than 4 stars restaurants. 2. Maybe, when the review count is low, the customers are mainly the people who like this restaurants. But when the customers increase, the rating will tend to show the evaluation of most people. And it may lead to the decrease of stars.

#### Insight 2: (Ruizhe)

Though "Bars" and "NightLife" are the most popular categores, the most popular categories in 02128 area is "Breakfast&Brunch" and "Sandwiches". So 02128 area may be the living area.

(The areas in Boston which is prosperity in food field are: 02116, 02139, 02169, 02215. For thouse vistors want to play and enjoy food, these areas might be good choice)

#### Insight 3: (Tianhao）

Bars is the most popular category among restaurants in greater Boston area (Boston and Cambridge).
#### Insight 4: (Tianhao)

For those Breakfast and Brunch restaurants interested in attracting more customers, adding Traditional American food or Cafe food to their menu could possibly help base on rating distribution.

#### Something we need to mention：
\nBesides insights that we developed, the user will also be able to discover their own insight via specifying zip code, food type(category) as well as other attributes.

For instance: In the area with zip code 02115, the food type closest to Pizza is sandwich.

In Boston, restaurants that are similar to Taco Bell and are still open are The Lower Depths, Boloco, Chipotle, Currito, and Restaurante Montecri. And their user ratings are ranging from 3.5 to 4.5.
`
)});
  main.variable(observer("data_used_insight")).define("data_used_insight", ["md"], function(md){return(
md`## Data Used for Each Insight:
* Insight 1: Review Count (Quantitative), Stars(Quantitative).
* Insight 2: Categories (Categorical), Zip Code (Categorical).
* Insight 3: Categories (Categorical), City (Categorical), Stars(Quantitative).
* Insight 4: Stars(Quantitative), Categories (Categorical), City(Categorical).
`
)});
  main.variable(observer("task_abstraction")).define("task_abstraction", ["md"], function(md){return(
md`## Task Abstraction:

#### End User(Target Audience):
The customers who want to find some new restaurants. The restaurants who want to identify the average level of restaurants in Boston.

#### Task 1:
Explore the Trend. (Find the trend of the relationship betweenreview count and stars)

#### Task 2:
Explore the outliers. (Find the special place of the relationship between category popularity and area)

#### Task 3:
Locate the feature. (Find the most popular category in great Boston and Cambridge)

#### Task 4:
Discover food options. (Dicover food options in addition to the selected food category base on the popularity and rating distribution.)

`
)});
  main.variable(observer("m_c")).define("m_c", ["md"], function(md){return(
md`## Marks and Channels:
#### Geometry:
Marks: points (each restaurant is a point), map (shows the geometry information).
Channels: The position of point (shows the actual position of the restaurants).

#### Network: 
Marks: points (each node is a point), lines (each link is a line).
Channels: The color of points shows their type (color cannot be change). The original positions of nodes also shows their type (it can be changed by user). The size of nodes shows how many times they appear in the dataset. In another words, the size shows the preference of customers.

#### Boxplot Chart (For insight 1):
Marks: area (box shows the general information of certain stars level) and points (each point is a restaurant)
Channels: The color/y-coordinate of box and points shows their type. The x-coordinate position shows their review count number. The range/size of box shows the Q1, mean, and Q3 of the review counts for all restaurants in this star level.

#### Point Chart (For insight 2):
Marks: area (each circle is the number of certain category in certain area)
Channels: The channels are mainly location and size. The x coordinate shows the category of the point. The y coordinate shows the area of the point. The size of point shows how many restaurants in this area (y coordinate) have this category (x corrdinate).


#### Bar Chart (For insight 3/4):
Marks: area (each area is a bar, shows the number of review count of certain category in certain stars level)
Channels: The channels are mainly the length of bar (which shows the number of review count), the x-coordinate of the bar (which shows the stars level), and the color of the bars (which shows the categories). 
`
)});
  main.variable(observer("codes")).define("codes", ["md"], function(md){return(
md`## Code that supports all visualizations/UI above:

*Click on the left side of the cell to see the source code. Do not try to modify anything as it might break the code.*`
)});
  main.variable(observer("popular_categories")).define("popular_categories", ["nodefilterer","data","linkfilterer","findNodeConnected","find_and_add_attr"], function(nodefilterer,data,linkfilterer,findNodeConnected,find_and_add_attr)
{ var og_data = nodefilterer(data)
  var og_link = linkfilterer(data)
  var array = og_data.filter(d => d.Label === "Food");
  array.map(d => d.count = og_link.filter(a => d.ID === a.source || d.ID === a.target).length).filter(d => d.count !== 0);
  var topValues = array.map(d => d.count).sort((a,b) => b-a).slice(0,10);
  array = array.filter(d => topValues.includes(d.count)).filter(d => d.name !== "Restaurants" && d.name != "Food");
  var list_array_id = array.map(d => d.ID);
  
  var res_with_these_food = list_array_id.map(d => findNodeConnected(d))
  .map(d => d.map(obj => Object.assign({}, obj, {star: find_and_add_attr(obj)})));
 
 var update_list = [];
 
 for (let i = 0; i < array.length; i++) {
   var res_food = res_with_these_food[i].map(d => Object.assign({}, d, {category: array[i].name}));
   update_list.push(res_food);
 }

  return update_list;
}
);
  main.variable(observer("find_and_add_attr")).define("find_and_add_attr", ["allResWithTheirInfo"], function(allResWithTheirInfo){return(
function find_and_add_attr(node) {
     var obj = allResWithTheirInfo.filter(a => a.name === node.name);
     return obj[0].stars
}
)});
  main.variable(observer("findNodeConnected")).define("findNodeConnected", ["linkfilterer","data","nodefilterer"], function(linkfilterer,data,nodefilterer){return(
function findNodeConnected(nodeid) {
  var links = linkfilterer(data).filter(d=> d.target === nodeid).map(d => d.source)
  var nodewithid = nodefilterer(data).filter(d => links.includes(d.ID))
  return nodewithid
}
)});
  main.variable(observer("income_data")).define("income_data", ["income_data_raw"], function(income_data_raw){return(
income_data_raw.map(d => ({
zipcode:  d.zipcode,
Income: parseFloat(d.Income)
}))
)});
  main.variable(observer("income_data_raw")).define("income_data_raw", ["FileAttachment"], function(FileAttachment){return(
FileAttachment("Income.csv").csv()
)});
  main.variable(observer("firster_type_search_filter")).define("firster_type_search_filter", ["md"], function(md){return(
md`### First Type Search Filter`
)});
  main.variable(observer("filters_keyword")).define("filters_keyword", ["cityfilter","categoryfilter","starfilter"], function(cityfilter,categoryfilter,starfilter){return(
[cityfilter,categoryfilter, starfilter]
)});
  main.variable(observer("filter_keyword")).define("filter_keyword", ["cityfilter","categoryfilter","starfilter","data"], function(cityfilter,categoryfilter,starfilter,data)
{
  var city = cityfilter;
  var category = categoryfilter;
  var star = starfilter;
  
//  if (star.includes("No preference")) {
//    star = starArray;
//  }
  
//  if (city.includes("No preference")) {
//    city = cityArray;
//  }

//  if (category.includes("No preference")) {
//    category = categoryArray;
//  }
  
  var filters_keyword = [cityfilter,categoryfilter, starfilter];
  var filters = [];
  
  for (let i = 0; i < 3; i++) {
    var newNode = data.nodes
    .filter(d => filters_keyword[i].includes(d.name))
    .map(d => d.ID);
    filters[i] = newNode;
  }

  
  let selection = new Set(data.links.map(d => d.source));

  for (let filter of filters) {
    
    selection = new Set(
      data.links
        .filter(d => filter.includes(d.target))
        .filter(d => selection.has(d.source))
        .map(d => d.source)
    )
   
  }

  return selection;
  //return filters;
}
);
  main.variable(observer("result_filtered")).define("result_filtered", ["result","filter_keyword"], function(result,filter_keyword)
{
  return result.filter(d => filter_keyword.has(d.ID));
}
);
  main.variable(observer("filterData")).define("filterData", ["buildDataArray","nodefilterer","data","linkfilterer"], function(buildDataArray,nodefilterer,data,linkfilterer){return(
buildDataArray(nodefilterer(data), linkfilterer(data))
)});
  main.variable(observer("import_attribute")).define("import_attribute", ["md"], function(md){return(
md`### Import Attribute`
)});
  main.variable(observer("categoryArrayOriginal")).define("categoryArrayOriginal", ["buildDataArrayOriginal"], function(buildDataArrayOriginal){return(
buildDataArrayOriginal("match (n:Food) return distinct n.categories order by n.categories")
)});
  main.variable(observer("categoryArray")).define("categoryArray", ["categoryArrayOriginal"], function(categoryArrayOriginal){return(
categoryArrayOriginal.records.map(d => d._fields[0])
)});
  main.variable(observer("zipcodeArrayOriginal")).define("zipcodeArrayOriginal", ["buildDataArrayOriginal"], function(buildDataArrayOriginal){return(
buildDataArrayOriginal("MATCH ()-[r]-() WHERE EXISTS(r.ZIPCode) RETURN DISTINCT r.ZIPCode order by r.ZIPCode")
)});
  main.variable(observer("zipcodeArray")).define("zipcodeArray", ["zipcodeArrayOriginal"], function(zipcodeArrayOriginal){return(
zipcodeArrayOriginal.records.map(d => d._fields[0])
)});
  main.variable(observer("starArrayOriginal")).define("starArrayOriginal", ["buildDataArrayOriginal"], function(buildDataArrayOriginal){return(
buildDataArrayOriginal("match (n:stars) return distinct n.Stars order by n.Stars")
)});
  main.variable(observer("starArray")).define("starArray", ["starArrayOriginal"], function(starArrayOriginal){return(
starArrayOriginal.records.map(d => d._fields[0])
)});
  main.variable(observer("cityArrayOriginal")).define("cityArrayOriginal", ["buildDataArrayOriginal"], function(buildDataArrayOriginal){return(
buildDataArrayOriginal("match (n:City) return distinct n.city order by n.city")
)});
  main.variable(observer("cityArray")).define("cityArray", ["cityArrayOriginal"], function(cityArrayOriginal){return(
cityArrayOriginal.records.map(d => d._fields[0])
)});
  main.variable(observer("timeArray")).define("timeArray", function(){return(
["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday","Sunday"]
)});
  main.variable(observer("import_all_data")).define("import_all_data", ["md"], function(md){return(
md`## Import All Data`
)});
  main.variable(observer("allNodeOriginal")).define("allNodeOriginal", ["buildDataArrayOriginal"], function(buildDataArrayOriginal){return(
buildDataArrayOriginal("MATCH (n) RETURN n")
)});
  main.variable(observer("allRelationshipOriginal")).define("allRelationshipOriginal", ["buildDataArrayOriginal"], function(buildDataArrayOriginal){return(
buildDataArrayOriginal("MATCH ()-[r:Assoc]->() RETURN r")
)});
  main.variable(observer("allNode")).define("allNode", ["allNodeOriginal"], function(allNodeOriginal){return(
allNodeOriginal.records
)});
  main.variable(observer("allRelationship")).define("allRelationship", ["allRelationshipOriginal"], function(allRelationshipOriginal){return(
allRelationshipOriginal.records
)});
  main.variable(observer("all")).define("all", ["allNode","allRelationship"], function(allNode,allRelationship){return(
allNode.concat(allRelationship)
)});
  main.variable(observer("data")).define("data", ["dealWithData"], function(dealWithData){return(
dealWithData()
)});
  main.variable(observer("filterCity")).define("filterCity", ["data"], function(data)
{
  data.nodes.filter(d  => d.Label === "City")
}
);
  main.variable(observer("filterLinkType")).define("filterLinkType", ["data"], function(data){return(
function filterLinkType(type) {
  var filter = data.nodes.filter(d => d.Label === type);
  var filterID = filter.map(d => d.ID);
  var resultLink = data.links.filter(d => filterID.includes(d.target));
  return resultLink;
}
)});
  main.variable(observer("cityLink")).define("cityLink", ["filterLinkType"], function(filterLinkType){return(
filterLinkType("City")
)});
  main.variable(observer("foodLink")).define("foodLink", ["filterLinkType"], function(filterLinkType){return(
filterLinkType("Food")
)});
  main.variable(observer("resNode")).define("resNode", ["data"], function(data){return(
data.nodes.filter(d => d.Label === "Restaurant")
)});
  main.variable(observer("starNode")).define("starNode", ["data"], function(data){return(
data.nodes.filter(d => d.Label === "stars")
)});
  main.variable(observer("starLink")).define("starLink", ["filterLinkType"], function(filterLinkType){return(
filterLinkType("stars")
)});
  main.variable(observer("cityNode")).define("cityNode", ["data"], function(data){return(
data.nodes.filter(d => d.Label === "City")
)});
  main.variable(observer("city")).define("city", ["cityNode","cityLink"], function(cityNode,cityLink){return(
cityNode.filter(d => d.ID === cityLink[0].target)[0]
)});
  main.variable(observer("allResWithTheirInfo")).define("allResWithTheirInfo", ["FileAttachment"], function(FileAttachment){return(
FileAttachment("MA Dataset sample 2000.json").json()
)});
  main.variable(observer("divide")).define("divide", function(){return(
function divide(res, key, expected) {
  var yes = [];
  var no = [];
  
  for (let i = 0; i < res.length; i++) {
    if (res[i].attributes.hasOwnProperty(key)) {
      if (res[i].attributes[key] === expected) {
        yes.push(res[i]);
      } else {
        no.push(res[i]);
      }
    } else {
      no.push(res[i]);
    }
  }
  
  return {yes: yes, no: no};
}
)});
  main.variable(observer("selectedCity")).define("selectedCity", ["cityNode","countRelations","data"], function(cityNode,countRelations,data){return(
cityNode.map(d => Object.assign({}, d, {resNumber: countRelations(d, data)-1})).filter(d => d.resNumber > 40)
)});
  main.variable(observer("foodNode")).define("foodNode", ["data"], function(data){return(
data.nodes.filter(d => d.Label === "Food")
)});
  main.variable(observer("selectedFood")).define("selectedFood", ["foodNode","countRelations","data"], function(foodNode,countRelations,data){return(
foodNode.map(d => Object.assign({}, d, {resNumber: countRelations(d, data)-1})).filter(d => d.resNumber > 150).filter(d => d.name != "Restaurants" && d.name !== "Food")
)});
  main.variable(observer("addZipNode")).define("addZipNode", ["zipcodeArray"], function(zipcodeArray){return(
function addZipNode() {
  var zipcodeNode = [];
  for (let i = 0; i < zipcodeArray.length; i++) {
    var zip_code = {name: zipcodeArray[i]};
    zipcodeNode.push(zip_code);
  }
  return zipcodeNode;
}
)});
  main.variable(observer("zipcodeNode")).define("zipcodeNode", ["addZipNode"], function(addZipNode){return(
addZipNode()
)});
  main.variable(observer("selectedZipcode")).define("selectedZipcode", ["zipcodeNode","countRelationsForZip","data"], function(zipcodeNode,countRelationsForZip,data){return(
zipcodeNode.map(d => Object.assign({}, d, {resNumber: countRelationsForZip(d, data)-1})).filter(d => d.resNumber > 10).filter(d => d.resNumber > 35)
)});
  main.variable(observer("getZipFood")).define("getZipFood", ["selectedZipcode","selectedFood","allResWithTheirInfo"], function(selectedZipcode,selectedFood,allResWithTheirInfo){return(
function getZipFood() {
  var zipcode_food = []
  for (let i1 = 0; i1 < selectedZipcode.length; i1++) {
    for (let i2 = 0; i2 < selectedFood.length; i2++) {
      var zip_name = selectedZipcode[i1].name;
      var food_name = selectedFood[i2].name;
      var count_list = allResWithTheirInfo.filter(d => d.postal_code === zip_name && d.categories.includes(food_name));
      zipcode_food.push({zip: zip_name, food: food_name, count: count_list.length})
    }
  }
  return zipcode_food;
}
)});
  main.variable(observer("zipcode_food")).define("zipcode_food", ["getZipFood"], function(getZipFood){return(
getZipFood()
)});
  main.variable(observer("sorted_percentage")).define("sorted_percentage", ["popular_categories"], function(popular_categories)
{
  var og_df = popular_categories.flat();
  var categories = og_df.map(d => d.category)
  
  const distinct = (value, index, self) => {
    return self.indexOf(value) === index;
  }
  
  var distinct_cat = categories.filter(distinct);
  var resultset = [];
  
  for (let i = 0; i < distinct_cat.length; i++) {
    var target_cat = distinct_cat[i];
    var primary_filter = og_df.filter(d => d.category === target_cat);
    var total_num = primary_filter.length;
    var star_list = [1,1.5,2,2.5,3,3.5,4,4.5,5]
    
    for (let j = 0; j < star_list.length; j++) {
      var star = primary_filter.filter(d => d.star === star_list[j]).length / total_num * 100;
      resultset.push({"category": target_cat, "star" : star_list[j], "percentage": star})
    }
    
  }
  return resultset

}
);
  main.variable(observer()).define(["md"], function(md){return(
md`## Import Filter Data`
)});
  main.variable(observer("third_type_data")).define("third_type_data", ["md"], function(md){return(
md` ## Import Third Type Search Data`
)});
  main.variable(observer("thirdQuery")).define("thirdQuery", ["addApostrophe","Restaurant","cityForThird","timeForThird"], function(addApostrophe,Restaurant,cityForThird,timeForThird){return(
"call {match (f:Food)<-[:Assoc]-(r:Restaurant {name:"+addApostrophe(Restaurant)+"})-[:Assoc]->(c:City {city:"+addApostrophe(cityForThird)+"}) where f.categories <> 'Restaurants' and f.categories <> 'Food' return collect(f.categories) as cats} match (f2:Food)<-[:Assoc]-(r2:Restaurant)-[:Assoc]->(c2:City {city:"+addApostrophe(cityForThird)+"}) with r2, f2, cats where f2.categories in cats with id(r2) as rid, count(f2) as outgoing, cats order by outgoing desc limit 10 match (s:stars)<-[rel1:Assoc]-(r3:Restaurant)-[rel2:Assoc]->(c3:City {city:"+addApostrophe(cityForThird)+"}) where rid = id(r3) with rel1, s, r3, rel2, c3, cats order by s.Stars desc limit 10 match (r3)-[rel3:Assoc]->(h3:Hours) where h3.name = "+addApostrophe(timeForThird)+" and time(head(split(rel3.Time, '-'))) <= time() + duration({hours:-4}) UNWIND cats as food match (f:Food {categories:food}) match (r3:Restaurant) - [rel4:Assoc] -> (f:Food) return r3, rel1, s, rel2, c3, h3, f, rel3, rel4"
)});
  main.variable(observer("thirdQueryArrayOriginal")).define("thirdQueryArrayOriginal", ["buildDataArrayOriginal","thirdQuery"], function(buildDataArrayOriginal,thirdQuery){return(
buildDataArrayOriginal(thirdQuery)
)});
  main.variable(observer("thirdQueryArray")).define("thirdQueryArray", ["thirdQueryArrayOriginal"], function(thirdQueryArrayOriginal){return(
thirdQueryArrayOriginal.records
)});
  main.variable(observer("thirdTypeFinalArray")).define("thirdTypeFinalArray", ["dealWithDataWithParallel","thirdQueryArray"], function(dealWithDataWithParallel,thirdQueryArray){return(
dealWithDataWithParallel(thirdQueryArray)
)});
  main.variable(observer("mapValue")).define("mapValue", ["thirdTypeFinalArray"], function(thirdTypeFinalArray)
{
  thirdTypeFinalArray.links.map(d => d.value = 1)
}
);
  main.variable(observer("mapRadius")).define("mapRadius", ["thirdTypeFinalArray"], function(thirdTypeFinalArray)
{
  thirdTypeFinalArray.nodes.map(d => d.radius = thirdTypeFinalArray.links.filter(a => a.source === d.ID || a.target === d.ID).length)
}
);
  main.variable(observer("func")).define("func", ["md"], function(md){return(
md`## Function`
)});
  main.variable(observer("data_func")).define("data_func", ["md"], function(md){return(
md`### Data Function`
)});
  main.variable(observer("buildDataArrayOriginal")).define("buildDataArrayOriginal", ["driver"], function(driver){return(
function buildDataArrayOriginal(q) {
  const session3 = driver.session();
  const dataArrayOriginal = session3.run(q);
  return dataArrayOriginal;
}
)});
  main.variable(observer("addApostrophe")).define("addApostrophe", function(){return(
function addApostrophe(d) {
  return "'" + d + "'"
}
)});
  main.variable(observer("dealWithDataWithParallel")).define("dealWithDataWithParallel", ["buildDataArray"], function(buildDataArray){return(
function dealWithDataWithParallel(queryArray) {
  var NodeIdArray = [];
  var RelationshipIdArray = [];
  var nodeArray = [];
  var relArray = []
  
  for (let index = 0; index < queryArray.length; index++) {
    var sampleArray = queryArray[index]._fields
    for (let i = 0; i < sampleArray.length; i++) {
      var id = sampleArray[i].identity.low
      if (sampleArray[i].constructor.name === "Node") {
        if (!(NodeIdArray.includes(id))) {
          NodeIdArray.push(id)
          if (sampleArray[i].labels[0] === "Restaurant") {
            var res = sampleArray[i].properties
            res["ID"] = id
            res["Label"] = sampleArray[i].labels[0]
            nodeArray.push(sampleArray[i].properties)
          } else {
            var otherNode = sampleArray[i].properties;
            nodeArray.push({name:otherNode[Object.keys(otherNode)[0]], ID: id, Label:sampleArray[i].labels[0]})
          }
        }
      } else {
        if (!(RelationshipIdArray.includes(id))) {
          RelationshipIdArray.push(id)
          var link = sampleArray[i].properties
          link.ID = sampleArray[i].identity.low
          link.source = sampleArray[i].start.low
          link.target = sampleArray[i].end.low
          relArray.push(sampleArray[i].properties)
        }
      }
    }
  }
  
  var finalArray = buildDataArray(nodeArray, relArray);
  
  return finalArray
}
)});
  main.variable(observer("dealWithData")).define("dealWithData", ["all","buildDataArray"], function(all,buildDataArray){return(
function dealWithData() {
  var NodeIdArray = [];
  var RelationshipIdArray = [];
  var nodeArray = [];
  var relArray = []
  
  for (let index = 0; index < all.length; index++) {
    var sample = all[index]._fields[0]
      var id = sample.identity.low
      if (sample.constructor.name === "Node") {
        if (!(NodeIdArray.includes(id))) {
          NodeIdArray.push(id)
          if (sample.labels[0] === "Restaurant") {
            var res = sample.properties
            res["ID"] = id
            res["Label"] = sample.labels[0]
            nodeArray.push(sample.properties)
          } else {
            var otherNode = sample.properties;
            nodeArray.push({name:otherNode[Object.keys(otherNode)[0]], ID: id, Label:sample.labels[0]})
          }
        }
      } else {
        if (!(RelationshipIdArray.includes(id))) {
          RelationshipIdArray.push(id)
          var link = sample.properties
          link.ID = sample.identity.low
          link.source = sample.start.low
          link.target = sample.end.low
          link.value = 1
          relArray.push(sample.properties)
        }
      }
  }
  
  function addRadius(d) {
    d["radius"] = relArray.filter(a => a.source === d.ID || a.target === d.ID).length;
    return d;
  }
  
  
  nodeArray.map(addRadius);
  
  var finalArray = buildDataArray(nodeArray, relArray);
  
  return finalArray
}
)});
  main.variable(observer("buildDataArray")).define("buildDataArray", function(){return(
function buildDataArray(node, link) {
  const dataArray = {nodes: node, links: link}
  return dataArray;
}
)});
  main.variable(observer("countRelations")).define("countRelations", function(){return(
function countRelations(obj, array) {
  return array.links.filter(d => obj.ID === d.source || obj.ID === d.target).length
}
)});
  main.variable(observer("countRelationsForZip")).define("countRelationsForZip", function(){return(
function countRelationsForZip(obj, array) {
  return array.links.filter(d => obj.name === d.ZIPCode).length
}
)});
  main.variable(observer("linkfilterer")).define("linkfilterer", ["result_filtered"], function(result_filtered){return(
function linkfilterer(data) {
  var ids = result_filtered.map(d => d.ID);
  var pre_result = data.links.filter(
    a => ids.includes(a.source) || ids.includes(a.target)
  );
  return data.links.filter(
    a => ids.includes(a.source) || ids.includes(a.target)
  );
}
)});
  main.variable(observer("nodefilterer")).define("nodefilterer", ["linkfilterer"], function(linkfilterer){return(
function nodefilterer(data) {
  var templist = [];
  var lin2 = linkfilterer(data);

  for (const i of lin2) {
    if (!templist.includes(i.source) || !templist.includes(i.target)) {
      templist.push(i.source);
      templist.push(i.target);
    }
  }
  var unique_temp = [];
  templist.forEach(c => {
    if (!unique_temp.includes(c)) {
      unique_temp.push(c);
    }
  });
  return data.nodes.filter(a => templist.includes(a.ID));
  // return templist;
}
)});
  main.variable(observer("nullFilter")).define("nullFilter", function(){return(
function nullFilter(filter) {
  if (filter === "No preference") {
    return "";
  } else {
    return filter;
  }
}
)});
  main.variable(observer("vis_func")).define("vis_func", ["md"], function(md){return(
md`### Vis Function`
)});
  main.variable(observer("barAndPiechart")).define("barAndPiechart", ["countRelations","vl","d3"], function(countRelations,vl,d3){return(
function barAndPiechart(data, field) {
  var array = data.nodes.filter(d => d.Label === field);
  array.map(d => d.count = countRelations(d, data)).filter(d => d.count !== 0);
  
  const bar = vl.markBar()
  .data(array)
  .encode(
    vl.x().fieldN("name"),
    vl.y().fieldQ("count"),
    vl.color().fieldN("name"),
      vl.tooltip([
      { field: "name", type: "Categorical"},
      { field: "count", type: "quantitative" }
    ])
  )
  
  const color = d3.scaleSequential(d3.interpolateViridis).domain([0, array.length-1]);
  
  const colors = {
    domain: array.map(d=>d.group),
    range: array.map( (i,j) => color(j) )
  };
  
  const pie = vl.markArc({outerRadius: 150})
    .data(array)
    .encode(
      vl.theta().fieldQ('count'),
      vl.color().fieldN('name'),
      vl.tooltip([
        { field: "name", type: "nominal" },
        { field: "count", type: "quantitative" }
      ])
    )
    .config({view: {stroke: null}})
    .width(300)
    .height(300)
  
  return vl.hconcat(
    vl.layer(bar),
    vl.layer(pie)
  ).render();
}
)});
  main.variable(observer("geometry")).define("geometry", ["vl","MA"], function(vl,MA){return(
function geometry(data) {
  const map = vl.markGeoshape({fill: '#ddd', stroke: '#fff', strokeWidth: 1})
    .data(vl.topojson(MA).feature('cb_2015_massachusetts_county_20m'));
  
  var points = null;
  
  points = vl.markCircle({size: 9})
  .data(data)
  .encode(
    vl.longitude().fieldQ('longitude'),
    vl.latitude().fieldQ('latitude'),
    vl.tooltip([
      { field: "name", type: "categorical" },
    ])
  );
  
    return vl.layer(map, points)
    .project(vl.projection('albersUSA').translate(-7300, 2600).scale(23000))
    .width(300).height(300)
    .config({view: {stroke: null}})
    .render()
}
)});
  main.variable(observer("geo_file")).define("geo_file", ["md"], function(md){return(
md` #### Geometry File`
)});
  main.variable(observer("MA")).define("MA", ["FileAttachment"], function(FileAttachment){return(
FileAttachment("MA-25-massachusetts-counties.json").json()
)});
  main.variable(observer("google")).define("google", ["require"], function(require){return(
require('https://maps.googleapis.com/maps/api/js?key=AIzaSyB4JQkUKSUqHQmteJ5xdk4RdrFqHi04hdg').catch(
  () => window.google
)
)});
  main.variable(observer("neo4j_driver")).define("neo4j_driver", ["md"], function(md){return(
md` ### Neo4j Driver`
)});
  main.variable(observer("neo4j")).define("neo4j", ["require"], async function(require)
{
  const neo4j = await require('neo4j-driver');
  return neo4j;
}
);
  main.variable(observer("driver")).define("driver", ["neo4j"], function(neo4j){return(
neo4j.driver(
  "neo4j+s://df82a806.databases.neo4j.io:7687",
  neo4j.auth.basic("Reader", "Reader")
)
)});
  main.variable(observer("d3_js_set")).define("d3_js_set", ["md"], function(md){return(
md` ### D3.js Set`
)});
  main.variable(observer("radius")).define("radius", ["d3","data"], function(d3,data){return(
d3
  .scaleLinear()
  .domain(d3.extent(data.nodes, d => d.radius))
  .range([4, 20])
)});
  main.variable(observer("x")).define("x", ["d3","data","width"], function(d3,data,width){return(
d3
  .scalePoint()
  .domain(d3.group(data.nodes, d => d.Label).keys())
  .range([-width / 2 + 50, width / 2 - 50])
)});
  main.variable(observer("y")).define("y", ["d3","data","height"], function(d3,data,height){return(
d3
  .scalePoint()
  .domain(d3.group(data.nodes, d => d.Label).keys())
  .range([-height / 2 + 50, height / 2 - 50])
)});
  main.variable(observer("height")).define("height", function(){return(
680
)});
  main.variable(observer("color")).define("color", ["d3"], function(d3)
{
  const scale = d3.scaleOrdinal(d3.schemeCategory10);
  const res = d => scale(d.Label)
  res.scale = scale;
  return res;
}
);
  main.variable(observer("releasenode")).define("releasenode", function(){return(
simulation =>
  function(d) {
    d.fx = null;
    d.fy = null;
    simulation.alphaTarget(0.3).restart();
  }
)});
  main.variable(observer("drag")).define("drag", ["d3"], function(d3){return(
simulation => {
  function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
  }

  function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(0);

    d.fixed = false;
    simulation.resume();
    // d.fx = null;
    // d.fy = null;
  }

  return d3
    .drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended);
}
)});
  main.variable(observer("import_file")).define("import_file", ["md"], function(md){return(
md` ### Import`
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("d3@6")
)});
  const child1 = runtime.module(define1);
  main.import("Search", child1);
  main.import("Table", child1);
  main.import("Checkbox", child1);
  main.import("Select", child1);
  const child2 = runtime.module(define1);
  main.import("Button", child2);
  const child3 = runtime.module(define2);
  main.import("swatches", child3);
  const child4 = runtime.module(define3);
  main.import("vl", child4);
  const child5 = runtime.module(define4);
  main.import("text", child5);
  return main;
}
