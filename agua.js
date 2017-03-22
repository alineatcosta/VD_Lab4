var
  width = 350,
  height = 550;

var svg2 = d3.select("#chartinformacao2")
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

function informacoesAgua() {
  var color = d3.scaleThreshold();
  var svg2 = d3.select("#chartinformacao2");

  d3.csv("data/indicadores_operacionais_agua.csv", function(error, informacao) {
    if (error) throw error;
    color
        .domain([20, 40, 60, 80, 100])
            .range([d3.rgb(8, 48, 107, 0.2), d3.rgb(8, 48, 107, 0.4), d3.rgb(8, 48, 107, 0.6), d3.rgb(8, 48, 107, 0.8), d3.rgb(8, 48, 107, 1)]);

    for (var i in informacao) {
        if (informacao[i].consumo_de_agua_percentual !== "NA" && informacao[i].consumo_de_agua_percentual != undefined) {
          svg2.select(".municipio_"+informacao[i].codigo_municipio)
            .attr("fill", color(+informacao[i].consumo_de_agua_percentual));
        } else {
          svg2.select(".municipio_"+informacao[i].codigo_municipio)
            .attr("fill", "#708090");
        }
    };
  
  });
}

d3.json("data/municipios_sab.json", function(error, pb) {
  if (error) throw error;
      
  var municipios = topojson.feature(pb, pb.objects.municipios_sab);

  svg2.selectAll(".municipio")
    .data(municipios.features)
    .enter().append("path")
    .attr("d", path)
    .attr("id", function(d) { return "municipio_" + d.properties.ID; });

  d3.csv("data/municipios_sab.csv", function(error, informacao) {
    if (error) throw error;
        
    for (var i in informacao) {
      if (informacao[i].GEOCODIGO) {
        svg2.select("#municipio_"+informacao[i].GEOCODIGO)
          .attr("class", function() { return "municipio_"+informacao[i].GEOCODIGO1; });
      }
    };
    informacoesAgua();    
  })
});