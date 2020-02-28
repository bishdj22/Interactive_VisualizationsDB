// Create Dropdown menu w/ samples populated from dataset --> samples.json
function __init__() {
    var dropdown = d3.select("#selDataset");
 
    d3.json("../samples.json").then((data)=> {
        console.log(data)

        data.names.forEach(function(name) {
            dropdown.append("option").text(name).property("value");
        });

        console.log(data.names)

        buildCharts(data.names[0]);
    });
}

// Build Charts function on id/sample selected through dropdown (event listener in HTML)

function buildCharts(id){
    d3.json("../samples.json").then(function(data) {
        console.log(data);

        var dropdown = d3.select("#selDataset");
        var dataSet = dropdown.property("value");

    // Printing Data to the Console - Testing

       var ImportedData = data;
   
       console.log(ImportedData.metadata);
       console.log(ImportedData.samples);
   
    // Isolate only the data needed for the OTU Chart (i.e. samples)

       var OTUchartdata =  ImportedData.samples;
       var metaData = ImportedData.metadata;

       console.log(metaData)
       console.log(OTUchartdata)

    // Filter chart & metadata
        var name = OTUchartdata.filter(val => val.id === id)[0];
        console.log(name);

        var name_meta = metaData.filter(val => val.id.toString() === id)[0];
        console.log(name_meta);
   
        
       
    // Build and populate MetaData Table -----
      
        
        var tbody = d3.select("tbody")
        tbody.html("");
        
        var obj = name_meta;
        
        Object.entries(obj).forEach(function([key, value]) {
            var row = tbody.append("tr");
            console.log(key, value);
            var cell = row.append("td");
            cell.text([key + " : " + value]);
        })
      


    // Bar Chart Top 10 OTUs

       var sample_val = []
       var otu_id = []
       var otu_label = []
       
       sample_val = name.sample_values.slice(0,10).reverse();
       otu_id = name.otu_ids.slice(0,10).reverse().map(val => `OTU ${val}`);
       otu_label = name.otu_labels.map(row => row.otu_labels);

       console.log(sample_val)
       console.log(otu_id)
       console.log(otu_label)

       var trace1 = {
           x: sample_val,
           y: otu_id,
        text: otu_label,
        name: "OTUs",
        type: "bar",
        orientation: "h"
      };

      var chartData = [trace1]
      
      var layout = {
        title: "Top 10 OTUs"
      };

      Plotly.newPlot("plot", chartData, layout);

    // Bubble Plot 

      var trace2 = {
        x: name.otu_ids,
        y: name.sample_values,
        text: name.otu_labels,
        mode: 'markers',
        marker: {
          color: ['rgb(93, 164, 214)', 'rgb(255, 144, 14)',  'rgb(44, 160, 101)', 'rgb(255, 65, 54)'],
          opacity: [1, 0.8, 0.6, 0.4],
          size: [40, 60, 80, 100]
        }
      };
      
      var data = [trace2];
      
      var layout = {
        title: 'OTUs and Levels',
        showlegend: false,
        height: 600,
        width: 1000
      };
      
      Plotly.newPlot('plot_2', data, layout);

      var trace3 = [
        {
          type: "indicator",
          mode: "gauge+number+delta",
          value: name_meta.wfreq,
          title: { text: "Scrubs per Week", font: { size: 24 } },
          gauge: {
            axis: { range: [null, 9], tickwidth: 4, tickcolor: "grey" },
            bar: { color: 'rgba(10, 51, 0, .5)'},
            bgcolor: "white",
            borderwidth: 3,
            bordercolor: "gray",
            steps: [
              {range: [0, 1], color: 'rgba(232, 226, 202, .5)' },
              {range: [1, 2], color: 'rgba(232, 226, 202, .5)' },
              {range: [2, 3], color:  'rgba(202, 209, 95, .5)' },
              {range: [3, 4], color: 'rgba(170, 202, 42, .5)' },
              {range: [4, 5], color: 'rgba(170, 202, 42, .5)'},
              {range: [5, 6], color: 'rgba(110, 154, 22, .5)'},
              {range: [6, 7], color: 'rgba(110, 154, 22, .5)'},
              {range: [7, 8], color: 'rgba(10, 51, 0, .5)'},
              {range: [8, 9], color: 'rgba(10, 51, 0, .5)' }

            ],
            threshold: {
              line: { color: "red", width: 4 },
              thickness: 0.75,
              value: name_meta.wfreq
            }
          }
        }
      ];

      

    // var guage_data = [trace3];
    
    var layout = { width: 600, height: 500, margin: { t: 0, b: 0 } };
    Plotly.newPlot('guage', trace3, layout);
   
     })
};

// d3.selectAll("#selDataset").on("change", updateCharts);

function updateCharts(id) {
    buildCharts(id);
}

__init__();


