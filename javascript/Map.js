﻿/*global window,OpenLayers,CUR*/
/*jslint plusplus: false */
CUR = window.CUR || {};

CUR.Map = function(config){
    var _map;
    var _respondent;
    var _networkLinks= {};
    var _linkLines = {};

    var onRespondentLayerClick = function(e){
        var respondent = {
            latLng:e.latLng,
            Id: e.row['RespondID'].value,
            OrgName: e.row['OrgName'].value,
            FullGeoAddress: e.row['FullGeoAddress'].value,
            GeoAddress: e.row['GeoAddress'].value,
            GeoCity: e.row['GeoCity'].value,
            GeoState: e.row['GeoState'].value,
            GeoZip: e.row['GeoZip'].value,
            Website: e.row['Website'].value
        };
        CUR.MapPage.setRespondent(respondent);
    };
    

    var myOptions = {
        zoom: 8,
        center: new google.maps.LatLng(50.0267110, -116.907234),
        //center: new google.maps.LatLng(40.7711329, -73.8741874),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        overviewMapControl:true,
        overviewMapControlOptions:{opened:true}
    };
    _map = new google.maps.Map(
        document.getElementById('map'),
        myOptions
    );

    var layer = new google.maps.FusionTablesLayer({
        query: {
            //select: 'FullGeoAddress',
            select: 'GeoZip',
            from: '1PAQGJi5iiAGig88llfKnN5GGf8Z_7gJ5139wY-4m'
            //from: '3824029'
        },
        suppressInfoWindows:true
    });
    layer.setMap(_map);
    google.maps.event.addListener(layer, 'click', onRespondentLayerClick);
    
    return {
        map: _map,
        renderRespondent: function(latLng){
            if(_respondent){
                _respondent.setMap(null);
            }
            _respondent = new CustomMarker(latLng, _map, 'O', 'respondent'); // Changed 'R' to 'O'
            google.maps.event.addListener(_respondent, 'mouseover', function(e) {
                CUR.MapPage.highlightRespondent();
            });
            google.maps.event.addListener(_respondent, 'mouseout', function(e) {
                CUR.MapPage.unhighlightRespondent();
            });

        },
        clearNetworkLinks: function(){
            for(var key in _networkLinks){
                _networkLinks[key].setMap(null);
            }
            _networkLinks = {};
            for(var key in _linkLines){
                _linkLines[key].setMap(null);
            }
            _linkLines = {};
        },
        renderNetworkLink: function(id, latLng, label){
        
            _networkLinks[id] = (new CustomMarker(latLng, _map, label, 'labels'));
            google.maps.event.addListener(_networkLinks[id], 'mouseover', function(e) {
                CUR.MapPage.highlightNetworkLink(id);
            });
//            google.maps.event.addListener(_networkLinks[id], 'mousemove', function(e) {
//                CUR.MapPage.highlightNetworkLink(id);
//            });
            google.maps.event.addListener(_networkLinks[id], 'mouseout', function(e) {
                CUR.MapPage.unhighlightNetworkLink(id);
            });
            this.renderLinkLine(id, _respondent.getPosition(), latLng);
        },
        renderLinkLine: function(id, latLng1, latLng2){
            var lineCoords = [
                latLng1,
                latLng2
            ];
                       
            var linkLineL = new google.maps.Polyline({
                path: lineCoords,
                strokeColor: '#000000',
                strokeOpacity: 0.8,
                strokeWeight: 7,
                geodesic: true
            });
            linkLineL.setMap(_map);
            _linkLines[id + '_L'] = linkLineL;
                                        
            var linkLineU = new google.maps.Polyline({
                path: lineCoords,
                strokeColor: '#CCCCCC',
                strokeOpacity: 1,
                strokeWeight: 5,
                geodesic: true
            });
            linkLineU.setMap(_map);
            _linkLines[id + '_U'] = linkLineU;
        
        },
        highlightRespondent: function(){
            if(_respondent){
                _respondent.div_.setAttribute('class', 'respondent-highlight');
            }
        },
        unhighlightRespondent: function(){  
            if(_respondent){
                _respondent.div_.setAttribute('class', 'respondent');
            }     
        },
        highlightNetworkLink: function(id){
            if(_networkLinks[id]){
                _networkLinks[id].div_.setAttribute('class', 'labels-highlight');
                
                _linkLines[id + '_L'].setOptions({strokeWeight: 10, zIndex:10000});
                _linkLines[id + '_U'].setOptions({strokeWeight: 8, strokeColor:'gold', zIndex:10001});
            }
           
        },
        unhighlightNetworkLink: function(id){
            if(_networkLinks[id]){
                $(_networkLinks[id].div_).attr('class', 'labels');
                _linkLines[id + '_L'].setOptions({strokeWeight: 7, zIndex:10});
                _linkLines[id + '_U'].setOptions({strokeWeight: 5, strokeColor:'#CCCCCC',  zIndex:11});
            }
            
        },
        zoomToRespondent: function(){
            _map.setCenter(_respondent.getPosition())
            _map.setZoom(16);
        },
        zoomToNetworkLink: function(id){
            if(_networkLinks[id]){
                _map.setCenter(_networkLinks[id].getPosition());
                _map.setZoom(16);
            }

        },
        zoomToNetwork: function(){
            var bounds = new google.maps.LatLngBounds();
            bounds.extend(_respondent.getPosition());
            for(var key in _networkLinks){
                bounds.extend(_networkLinks[key].getPosition());
            }
            _map.fitBounds(bounds);
        },
        getLatLngById: function(id){
            if(_networkLinks[id]){
                return _networkLinks[id].getPosition();
            } else {
                return null;
            }
            
        }
    
    };
};