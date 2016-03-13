/*global window,OpenLayers,CUR*/
/*jslint plusplus: false */
CUR = window.CUR || {};

CUR.MapPage = (function() {

    var _map;
    var _infoPanel;
    
    var _googleQuery;
    var _geocoder;
    
    var _respondent;
    
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
                    if (status == google.maps.GeocoderStatus.OK){
                        _map.renderNetworkLink(id, results[0].geometry.location, count); 
                    } else {
                        if(status === google.maps.GeocoderStatus.OVER_QUERY_LIMIT){
                            _geocodingProcesses.push( setTimeout(function(){geocodeOrg(id, address, count)}, 500) );
                        } else {
                            _infoPanel.setNetworkLinkGeocodeStatus(id, false);
                        }
                        
                    }
                }
            ); 
        }
    };

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




















