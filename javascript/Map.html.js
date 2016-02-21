/*global window,OpenLayers,CUR*/
/*jslint plusplus: false */
CUR = window.CUR || {};

CUR.MapPage = (function() {

    var _map;
    var _infoPanel;
    
    var _googleQuery;
    var _geocoder;
    
    var _respondent;
    
    //var _networkLinks;
    //var markers = [];
    //var linkLines = [];
    
    var toggleShowBusy = function(busy){
        _infoPanel.toggleShowBusy(busy);
    };
    
    var setRespondent = function(respondent){
        toggleShowBusy(true);
        
        for(var i=0, len=_geocodingProcesses.length; i<len; i++){
            clearTimeout( _geocodingProcesses[i] );
        }
        _geocodingProcesses = [];
        
    
        _respondent = respondent;
        
        _map.renderRespondent(respondent.latLng);
        _infoPanel.renderRespondent(respondent);
        
        _map.clearNetworkLinks();
        _infoPanel.clearNetworkLinks();
        queryNetworkLinks(respondent.Id);
    };
    
    var queryNetworkLinks = function(id){
        
        //var queryText = encodeURIComponent("SELECT AnswerID, OrgName, FullGeoAddress, GeoAddress, GeoCity, GeoState, GeoZip, Website, Geocoded FROM 4183834 WHERE RespondID=" + id + " ORDER BY OrgName");
        //var query = new google.visualization.Query('http://www.google.com/fusiontables/gvizdata?tq=' + queryText); 
        //query.send(handleNetworkQueryResponse);
        
        _googleQuery.getNetworkLinksByRespondent(id, handleNetworkQueryResponse);
    };
    
    var handleNetworkQueryResponse = function(response){

        var table = response.getDataTable();
        if(table !== null){
            for (var i=0, len=table.getNumberOfRows(); i<len; i++){
                var address = table.getValue(i,2);
                (function(count, id, attr){
                    _infoPanel.renderNetworkLink(id, count, attr);
                    geocodeOrg(id, address, count);  
                })(i + 1, table.getValue(i,0), {OrgName: table.getValue(i,1), FullGeoAddress: table.getValue(i,2), GeoAddress: table.getValue(i,3), GeoCity: table.getValue(i,4), GeoState: table.getValue(i,5), GeoZip: table.getValue(i,6), Website: table.getValue(i,7), Geocoded: table.getValue(i,8)});
            }
            //_infoPanel.renderNetworkLinks(table);  
        }  
        toggleShowBusy(false);

    
    };
    
    var _geocodingProcesses = [];
    var geocodeOrg= function(id, address, count){
        if(address === ''){
            _infoPanel.setNetworkLinkGeocodeStatus(id, false);
        } else {
            _geocoder.geocode({'address': address}, 
                function(results, status) {
                    //alert(status + ' ' + geocoded);
                    if (status == google.maps.GeocoderStatus.OK){
                        //alert(count + ' GEOCODED');
                        _map.renderNetworkLink(id, results[0].geometry.location, count); 
                    } else {
                        //alert(count + ' ' + status);
                        if(status === google.maps.GeocoderStatus.OVER_QUERY_LIMIT){
                            //alert(count + ' OVERLIMIT');
                            _geocodingProcesses.push( setTimeout(function(){geocodeOrg(id, address, count)}, 500) );
    //                                    _geocoder.geocode({'address': address}, 
    //                                        function(results, status) {
    //                                            if (status == google.maps.GeocoderStatus.OK){
    //                                                alert(count + ' GEOCODED');
    //                                                _map.renderNetworkLink(id, results[0].geometry.location, count); 
    //                                            } 
    //                                        }
    //                                    );  
                        } else {
                            _infoPanel.setNetworkLinkGeocodeStatus(id, false);
                        }
                        
                    }
                }
            ); 
        }
    };
    
//    var addRespondentToMap = function(respondent){
//        var marker = new CustomMarker(respondent.latLng, _map, 'R', 'respondent');
//        markers.push(marker);
//            
//        google.maps.event.addListener(marker, "mouseover", function(e,b,c) {
//            marker.div_.setAttribute('class', 'respondent-highlight');
//        });
//        
//        google.maps.event.addListener(marker, "mouseout", function(e,b,c) {
//            marker.div_.setAttribute('class', 'respondent');
//        });
//    
//    };

//    var onRespondentLayerClick = function(e){
//        var latLng = e.latLng;
//        
//        _infoPanel.renderRespondent(e);
//                
//        var respondId = e.row['RespondID'].value;

////
//        var queryText = encodeURIComponent("SELECT AnswerID, OrgName, FullGeoAddress, GeoAddress, GeoCity, GeoState, GeoZip, Website FROM 4183834 WHERE RespondID=" + respondId + "");
//        var query = new google.visualization.Query('http://www.google.com/fusiontables/gvizdata?tq=' + queryText);
//      
//        var ul = $('#networkLinks');
//        ul.empty();
//        if (markers) {
//            for (i in markers) {
//                markers[i].setMap(null);
//            }
//            markers.length = 0;
//        }
//        if (linkLines) {
//            for (i in linkLines) {
//                linkLines[i].setMap(null);
//            }
//            linkLines.length = 0;
//        }

//        var marker = new CustomMarker(latLng, _map, 'R', 'respondent');
//        markers.push(marker);
//            
//        google.maps.event.addListener(marker, "mouseover", function(e,b,c) {
//            marker.div_.setAttribute('class', 'respondent-highlight');
//        });
//        
//        google.maps.event.addListener(marker, "mouseout", function(e,b,c) {
//            marker.div_.setAttribute('class', 'respondent');
//        });
//        

//        query.send(
//            function(response){
//                var table = response.getDataTable();
//                if(table !== null){
//                
//                    for (var i=0, len=table.getNumberOfRows(); i<len; i++){
//                        var address = table.getValue(i,2);
//                        (function(count){
//                            _geocoder.geocode({'address': address}, 
//                                function(results, status) {
//                                    if (status == google.maps.GeocoderStatus.OK){
//                                        _map.renderNetworkLink(results[0].geometry.location, count);
//                                    
////                                        var marker2 = new CustomMarker(results[0].geometry.location, _map, count, 'labels');
////                                        markers.push(marker2);
////                                                
////                                        google.maps.event.addListener(marker2, "mouseover", function(e) {
////                                            marker2.div_.setAttribute('class', 'labels-highlight');
////                                        });
////                                        google.maps.event.addListener(marker2, "mouseout", function(e) {
////                                            marker2.div_.setAttribute('class', 'labels');
////                                        });
////                                        
////                                        
////                                        
////                                        
////                                        
////                                        
////                                        
////                                        var lineCoords = [
////                                            latLng,
////                                            results[0].geometry.location
////                                        ];
////                                        
////                                        
////                                        var linkLine2 = new google.maps.Polyline({
////                                            path: lineCoords,
////                                            strokeColor: "#000000",
////                                            strokeOpacity: 0.8,
////                                            strokeWeight: 7,
////                                            geodesic: true
////                                        });
////                                        linkLine2.setMap(_map);
////                                        linkLines.push(linkLine2);
////                                        
////                                        var linkLine = new google.maps.Polyline({
////                                            path: lineCoords,
////                                            strokeColor: "#CCCCCC",
////                                            strokeOpacity: 1,
////                                            strokeWeight: 5,
////                                            geodesic: true
////                                        });
////                                        linkLine.setMap(_map);
////                                        linkLines.push(linkLine);
//                                        
//                                        
//                                        
//                                        
//                                        
//                                        
//                                    }
//                                }
//                            );
//                        })(i + 1);
//                    }

//                    
//                    _infoPanel.renderNetworkLinks(table);  
//                }  
//            }
//        );
//        
//        
//        
//        
//        
//        
//        
//        
//        
//        
//        
//        
//        
//        
//        
//        
//        
//        
//        
//        
//        
//        return false;
//    
//    };

    return{
        init: function(config){
            
            _map = CUR.Map();
            
            _googleQuery = CUR.GoogleQuery();
            
            _geocoder = new google.maps.Geocoder();
                        
            _infoPanel = CUR.InfoPanel();
            
            $(window).resize(function(e) {
                $('.ui-autocomplete').css({'display':'none', 'max-height': $(window).height() - 100});
            });
            
            _googleQuery.getAllRespondents(function(response){
                var rows = response['table']['rows'];
                var ddl = $('#ddlRespondents');
               
                ddl[0].options.add(new Option('select a respondent...',''));
                for(var i=0, len=rows.length; i < len; i++) {
                    ddl[0].options.add(new Option(rows[i][1],rows[i][0]));
                } 
                
                $("#ddlRespondents").combobox({
                    selected: function(e, ui){
                      toggleShowBusy(true);
                      _googleQuery.getRespondentById(ui.item.value, function(response){
                            var rows = response['table']['rows'];
                            
                            _geocoder.geocode({'address': rows[0][2]}, 
                                function(results, status) {
                                    //alert(status + ' ' + geocoded);
                                    if (status == google.maps.GeocoderStatus.OK){
                                        setRespondent({latLng:results[0].geometry.location, Id: rows[0][0], OrgName:rows[0][1], FullGeoAddress:rows[0][2], Website:rows[0][3]});    
                                    } 
                                }
                            );
                        })  
                    }
                });
            });
 
        },
        //END OF init
        setRespondent: setRespondent,
        highlightRespondent: function(){
            _map.highlightRespondent();
            _infoPanel.highlightRespondent();
        },
        unhighlightRespondent: function(){
            _map.unhighlightRespondent();
            _infoPanel.unhighlightRespondent();
        },
        highlightNetworkLink: function(id){
            _map.highlightNetworkLink(id);
            _infoPanel.highlightNetworkLink(id);
        },
        unhighlightNetworkLink: function(id){
            _map.unhighlightNetworkLink(id);
            _infoPanel.unhighlightNetworkLink(id);
        },
        zoomToRespondent: function(){
            _map.zoomToRespondent();
        },
        zoomToNetworkLink: function(id){
           _map.zoomToNetworkLink(id);
        },
        zoomToNetwork: function(){
            _map.zoomToNetwork();
        },
        getLatLngById: function(id){
            return _map.getLatLngById(id);
        }
    };
})();




















