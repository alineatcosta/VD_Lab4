var
  width = 350,
  height = 550;

var svg = d3.select("#chart")
  .append("svg")
  .attr('version', '1.1')
  .attr('viewBox', '0 0 '+width+' '+height)
  .attr('width', '100%')
  .attr('class', 'map-chart');

var projection = d3.geoAlbers()
  .center([-29.855833, -11.303889])
  .rotate([0, 0])
  .parallels([0, 0])
  .scale(1500);

var path = d3.geoPath().projection(projection);

function informacoesPopulacao() {
  var color = d3.scaleThreshold();
  var svg = d3.select("#chart");

  d3.csv("data/geral.csv", function(error, informacao) {
    if (error) throw error;

    color
        .domain([500, 2500, 6500, 10500, 500500])
      .range([d3.rgb(8, 48, 107, 0.2), d3.rgb(8, 48, 107, 0.4), d3.rgb(8, 48, 107, 0.6), d3.rgb(8, 48, 107, 0.8), d3.rgb(8, 48, 107, 1)]);

    for (var i in informacao) {
      if (informacao[i].codigo) {
        if (informacao[i].populacao_total !== "NA") {
          svg.select(".municipio_"+informacao[i].codigo)
            .attr("fill", color(+informacao[i].populacao_total));
        } else {
          svg.select(".municipio_"+informacao[i].codigo)
            .attr("fill", "#708090");
        }
      }
    };
  });
}

d3.json("data/municipios_sab.json", function(error, pb) {
  if (error) throw error;
      
  var municipios = topojson.feature(pb, pb.objects.municipios_sab);

  svg.selectAll(".municipio")
    .data(municipios.features)
    .enter().append("path")
    .attr("d", path)
    .attr("id", function(d) { return "municipio_" + d.properties.ID; });

  d3.csv("data/municipios_sab.csv", function(error, informacao) {
    if (error) throw error;
        
    for (var i in informacao) {          
      if (informacao[i].GEOCODIGO) {
        svg.select("#municipio_"+informacao[i].GEOCODIGO)
          .attr("class", function() { return "municipio_"+informacao[i].GEOCODIGO1; });
      }
    };
    informacoesPopulacao();    
  })
});