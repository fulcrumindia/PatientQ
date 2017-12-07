var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];




Morris.Line({
    element: 'morris-area-chart',
    data: chartAnalytics.patient,
    xkey: 'period',
    ykeys: ['iphone', 'ipad', 'itouch'],
    labels: ['X', 'Y', 'Z'],
    pointSize: 3,
    fillOpacity: 0,
    pointStrokeColors:['#00bfc7', '#fdc006', '#9675ce'],
    behaveLikeLine: true,
    gridLineColor: '#e0e0e0',
    lineWidth: 1,
    hideHover: 'auto',
    lineColors: ['#00bfc7', '#fdc006', '#9675ce'],
    resize: true,
    xLabelFormat: function(x) { // <--- x.getMonth() returns valid index
        var month = months[x.getMonth()];
        return month;
      },
      dateFormat: function(x) {
        var month = months[new Date(x).getMonth()];
        return month;
      }
    
});

Morris.Bar({
    element: 'morris-area-chart1',
    data: chartAnalytics.visit,
    xkey: 'period',
    ykeys: ['OPD', 'ICU'],
    labels: ['X', 'Y'],
    pointSize: 0,
   
    pointStrokeColors:['#469fb4', '#01c0c8'],
    barColors:['#469fb4', '#01c0c8'],
    behaveLikeLine: true,
    gridLineColor: '#e0e0e0',
    lineWidth: 0,
    smooth: false,
    hideHover: 'true',
    lineColors: ['#469fb4', '#01c0c8'],
    resize: true,
    barSizeRatio:0.23,
    barGap:2
    
});

Morris.Area({
    element: 'morris-area-chart3',
    data:chartAnalytics.referrals,
    xkey: 'period',
    ykeys: ['iMac', 'iPhone'],
    labels: ['X', 'Y'],
    pointSize: 0,
    fillOpacity: 0.4,
    pointStrokeColors:['#b4becb', '#01c0c8'],
    behaveLikeLine: true,
    gridLineColor: '#e0e0e0',
    lineWidth: 0,
    smooth: true,
    hideHover: 'auto',
    lineColors: ['#b4becb', '#01c0c8'],
    resize: true,
    xLabelFormat: function(x) { // <--- x.getMonth() returns valid index
        var month = months[x.getMonth()];
        return month;
      },
      dateFormat: function(x) {
        var month = months[new Date(x).getMonth()];
        return month;
      }
    
});

