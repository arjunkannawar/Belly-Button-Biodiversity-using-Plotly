function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);

}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  console.log(sample);
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {

    // 3. Create a variable that holds the samples array. 
    var sampleArray = data.samples;
    console.log(sampleArray);
    // 4. Create a variable that filters the samples for the object with the desired sample number.

    var filteredSample = sampleArray.filter(function (item) {
      return item.id == sample;
    });

    console.log("Sample number: ", filteredSample);
    //var sampleNumber = 
    //  5. Create a variable that holds the first sample in the array.


    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = filteredSample[0].otu_ids;
    var otu_labels = filteredSample[0].otu_labels;
    var sample_values = filteredSample[0].sample_values;

    console.log("otu_ids : ", otu_ids);
    console.log("otu_labels : ", otu_labels);
    console.log("sample_values : ", sample_values);

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    var topOtu_ids = otu_ids.slice(0, 10);
    console.log("topOtu_ids ", topOtu_ids);
    var sortedOtu_ids = topOtu_ids.sort((a, b) => (a - b));
    descOtu_ids = sortedOtu_ids.reverse();
    console.log("descOtu_ids : ", descOtu_ids);
    var yticks = descOtu_ids;

    top10Otu_Labels = otu_labels.slice(0,10);

    console.log("yticks : ", yticks);

    var topsample_values = sample_values.slice (0, 10)

    // 8. Create the trace for the bar chart. 
    var trace = {
      x: topsample_values,
      y: yticks,
      yref: yticks,
      type: 'bar',
      text: top10Otu_Labels,
      marker: {
        color: 'rgb(142,124,195)'
      },
      orientation: 'h'
    };

    var barData = [trace];
    // 9. Create the layout for the bar chart. 
    var barLayout = {

      title: "Top 10 Bacteria Cultures Found",
      showticklabels: true,
      width: 600,
      height: 400,
      range: [0, 10]

    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar",barData, barLayout);


    // 1. Create the trace for the bubble chart.

    var trace1 = {
      x: descOtu_ids,
      y: topsample_values,
      text: top10Otu_Labels,
      mode: 'markers',
      marker: {
        color: ['black', 'red', 'brown', 'blue', 'pink', 'orange', 'green', 'yellow', 'light blue'],
        size: 80
      }
    }
    var bubbleData = [trace1];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: 'Bacteria Cultures Per Sample',
      xaxis: {title: "OTU ID"}
    };

    // 3. Use Plotly to plot the data with the layout.

    Plotly.newPlot("bubble",bubbleData, bubbleLayout);


    // 4. Create the trace for the gauge chart.
    var metadataArray = data.metadata;

    var filteredMetadata = metadataArray.filter(function (item) {
      return item.id == sample;
    });

    console.log("Metadata : ", filteredMetadata);

    var wfreq = parseFloat(filteredMetadata[0].wfreq).toFixed(2);

    console.log("wfreq", wfreq);

    var trace2 = {
      domain: { 
        x: [0, 1], 
        y: [0, 1] 
      },
      value: wfreq,
      title: { text: "Belly Button Washing Frequency <br> Scrubs per Week", font: {size: 18}},
      type: "indicator",
      mode: "gauge+number", 
      range: 10,
      bar: { color: "darkblue" },
      gauge: {
        axis: { range: [null, 10] },
        steps: [
          { range: [0, 2], color: "red" },
          { range: [2, 4], color: "orange" },
          { range: [4, 6], color: "yellow"},
          { range: [6, 8], color: "lightgreen"},
          { range: [8, 10], color: "green"},
        ],
      }
    }
    var gaugeData = [trace2];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 600, 
      height: 500, 
      margin: { t: 0, b: 0 }
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge",gaugeData, gaugeLayout);
  });
}
