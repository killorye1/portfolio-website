// ExamGraphs class
var ExamGraphs = function() {
  var _this = this;
  
  // Converts rgb to rgba with provided opacity
  _this.transparent = function(rgb, opacity) {
    if (!opacity) opacity = 0.3;
    var rgba = rgb.replace(')', ', '+opacity+')').replace('rgb', 'rgba');
    return rgba;
  }
  
  // Generate a ChartJS graph based on a
  // provided type and an array of data
  $.fn.graph = function(type, data) {
    var $this = $(this);
    if (!$this.length) return false;
    
    var graphData = {
      labels:   [],
      datasets: []
    };
    var graphOptions = {
      maintainAspectRatio: true
    };
    var customLegend;
    
    // Set ChartJS options based on graph type
    switch(type) {
      case "line":
        // Set month labels
        graphData.labels = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
        // Push each dataset
        $.each(data, function(index,value) {
          var newData = {
            label: value.year,
            lineTension: 0,
            backgroundColor: _this.transparent(value.color),
            borderColor: "transparent",
            pointBorderColor: "transparent",
            pointBackgroundColor: value.color,
            pointBorderWidth: 0,
            pointHoverRadius: 5,
            pointRadius: 3,
            data: value.data
          }
          graphData.datasets.push(newData);
        });
            
        break;
      case "horizontalBar":
        var dataArray  = [];
        var colorArray = [];
        $.each(data, function(index,value) {
          // Push labels
          graphData.labels.push(value.label);
          // Push data
          dataArray.push(value.data);
          // Push color
          colorArray.push(value.color);
        });
        var newData = {
            data: dataArray,
            backgroundColor: colorArray
        };
        // Push new data
        graphData.datasets.push(newData);
        // Set options
        graphOptions.legend = false;
        break;
      case "doughnut":
        var dataArray  = [];
        var colorArray = [];
        $.each(data, function(index,value) {
          // Push labels
          graphData.labels.push(value.label);
          // Push data
          dataArray.push(value.data);
          // Push color
          colorArray.push(value.color);
        });
        var newData = {
            data: dataArray,
            backgroundColor: colorArray
        };
        // Push new data
        graphData.datasets.push(newData);
        // Set options
        graphOptions.cutoutPercentage = 55;
        graphOptions.legend = false;
        graphOptions.legendCallback = function(chart) {
          var text = [];
          text.push('<ul class="' + chart.id + '-legend">');
          for (var i = 0; i < chart.data.datasets[0].data.length; i++) {
            text.push(
              '<li><div class="legend__key">' + 
              '<span class="legend__color" style="background-color:' +         
                chart.data.datasets[0].backgroundColor[i] +'"></span>' +
                '<span class="legend__value" style="color:' +
                chart.data.datasets[0].backgroundColor[i] + '">' +
                chart.data.datasets[0].data[i]+'%</span></div>'
            );
            if (chart.data.labels[i]) {
              text.push('<div class="legend__label">'+chart.data.labels[i]+'</div>');
            }
            text.push('</li>');
          }
          text.push('</ul>');
          return text.join("");
        };
        // Add custom legend div
        customLegend = $('<div class="legend legend--donut" />');
        break;
      default:
        break;
    }
    
    // Create canvas element to draw chart
    var canvas = $('<canvas />');
    canvas = canvas.appendTo($this);
    if (type === 'line') {
      canvas.css({
        width: '100%',
        height: 300
      });
    } else if (type === 'doughnut') {
      var wrap = $('<div />');
      wrap.css({
        padding: '20px 40px 0'
      });
      canvas.wrap(wrap);
    } else if (type === 'horizontalBar') {
    }
    var ctx = canvas[0].getContext('2d');
    
    // Finally generate the chart
    var chart = new Chart(ctx, {
      type: type,
      data: graphData,
      options: graphOptions
    });
    
    // Generate custom legend if applicable
    if (customLegend) {
      customLegend = customLegend.appendTo($this);
      customLegend.html(chart.generateLegend());
    }
  }
  
  _this.init = function() {
    // Use the $('element').graph() function to create graphs.
    // First argument is the type (line, horizontalBar, doughnut)
    // and the second argument is an array of the required data.
    // For colors, make sure to use the rgb() format.
    
    // Thilina: how to fetch the data is up to you, as long as
    // you follow the format outlined here :)
    
    // Exam Volume (YTD)
    var examVolData = [
      {
        year: "Average %",
        data: [54,52,52,58,76,56,53,41,44,60,82,64],
        color: "rgb(255,255,0)"
      },
      
      
      
    ];
    $('#exam-vol').graph("line", examVolData);
    var novSunData = [
      {
        year: "# of Sunspots",
        data: [95,196,121,105,162,159,70,108,120,70,117,175],
        color: "rgb(252,207,64)"
      },
    ];
    $('#nov').graph("line", novSunData);
    // Incomplete Exams (YTD)
    var incompData = [
      {
        label: "2008",
        data: 26,
        color: "rgb(252 207 64)"
      },
      {
        label: "2009",
        data: 46,
        color: "rgba(252,207,64, .5)"
      },
      {
        label: "2010",
        data: 323,
        color: "rgb(252 207 64)"
      },
      {
        label: "2011",
        data: 1005,
        color: "rgba(252,207,64, .5)"
      },
      {
        label: "2012",
        data: 1123,
        color: "rgb(252 207 64)"
      },
      {
        label: "2013",
        data: 1362,
        color: "rgba(252,207,64, .5)"
      },
      {
        label: "2014",
        data: 1498,
        color: "rgb(252 207 64)"
      },
      {
        label: "2015",
        data: 856,
        color: "rgba(252,207,64, .5)"
      },
      {
        label: "2016",
        data: 532,
        color: "rgb(252 207 64)"
      },
      {
        label: "2017",
        data: 147,
        color: "rgba(252,207,64, .5)"
      }
    ];
    $('#incomp').graph("horizontalBar", incompData);
    // Get tallest and make others same height
    var maxH = 0;
    $('.exam-module').each(function() {
      var h = $(this).outerHeight();
      if (h > maxH) maxH = h;
    });
    $('.exam-module').css('height', maxH);
  }
}

var examGraphs = new ExamGraphs();
examGraphs.init();