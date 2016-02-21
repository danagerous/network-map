/*global window,OpenLayers,CUR*/
/*jslint plusplus: false */
CUR = window.CUR || {};

CUR.InfoPanel = function(config){
    var _el = $('.infoPanel');
    var _respondent = $('.respondentInfo')
    _respondent.
        mouseover(
            function(e){
                CUR.MapPage.highlightRespondent();
            }
        ).
        mouseout(
            function(e){
                CUR.MapPage.unhighlightRespondent();
            }
    );
    
    var _network = $('#networkLinks');
    
    var _networkLinks = {};

    var renderRespondent = function(org){
        _respondent.empty();
        _respondent.append(
            $('<div class="respondent" style="float:left;cursor:pointer;"><p>O</p></div>') //Changed R to O
//                .mouseover(
//                    function(e){
//                        CUR.MapPage.highlightRespondent();
//                    }
//                ).
//                mouseout(
//                    function(e){
//                        CUR.MapPage.unhighlightRespondent();
//                    }
//                )
        );
        
        
         
        var textDiv = $('<div style="padding-left:32px;margin-top:2px;"></div>');
        textDiv.append('<span style="display:block;font-size:14px;font-weight:bold;">' + org.OrgName + '</span>');
        if(org.GeoAddress || org.GeoCity){
            textDiv.append('<span style="display:block;">' + org.GeoCity + ' ' + org.GeoState +'</span>');
        }
        /* Removed GeoAddress and GeoZip
        {
            textDiv.append('<span style="display:block;">' + org.GeoAddress+ '</span>').
                append('<span style="display:block;">' + org.GeoCity + ' ' + org.GeoState + ', ' + org.GeoZip +'</span>');
        } */
        else {
            textDiv.append('<span style="display:block;">' + org.FullGeoAddress.replace(/\\n/g, '<br />') + '</span>');
        }
            
        textDiv.append('<a href="' + org.Website + '" style="display:block;" target="_blank">' + org.Website + '</a>').
            //append('<a href="http://www.oasisnyc.net/stewardship/organizationdetails.aspx?id=' + org.Id + '" style="display:block;" target="_blank">SEE ME ON OASIS!</a>').
            append($('<div class="linkButton">Zoom to me</div>').
                click(
                    function(e){
                        CUR.MapPage.zoomToRespondent();
                    }
                )
            ).
            append( $('<div class="linkButton">Zoom to my network</div>').
                click( 
                    function(e){
                        CUR.MapPage.zoomToNetwork();
                    } 
                )
            );
        _respondent.append(textDiv);
    
    
    
    
    };
    
    var renderNetworkLink = function(id, rowIdx, attr){
        var item = $('<div style="clear:both;border:solid 1px #ffffff;"></div>').
            mouseover(
                function(e){
                    CUR.MapPage.highlightNetworkLink(id);                         
                }
            ).mouseout(
                function(e){
                    CUR.MapPage.unhighlightNetworkLink(id);
                }
        );
        item.append( 
            $('<div class="labels" style="float:left;cursor:pointer;"><p>' + rowIdx + '</p></div>')
//            .mouseover(
//                function(e){
//                    CUR.MapPage.highlightNetworkLink(id);                         
//                }
//            ).mouseout(
//                function(e){
//                    CUR.MapPage.unhighlightNetworkLink(id);
//                }
//            ).click(
//                function(e){
//                                                
//                }
//            )
        );
        var p = $('<p style="margin:0;margin-top:4px;padding-left:32px;padding-top:2px;"><span style="font-weight:bold;">' + attr['OrgName'] + '</span></p>'); //<span style="color:#AAAAAA;">(' + id +')</span></p>');
        p.append('<span style="display:block;">' + attr['GeoCity'] + ' ' + attr['GeoState'].replace(/\\n/g, '<br />') + '</span>'). //Changed FullGeoAddress to GeoCity and GeoState
            //append('<span style="display:block;">ADDRESS' + table.getValue(i,3) + '</span>').
            //append('<span style="display:block;">CITY' + table.getValue(i,4) + ' ' + table.getValue(i,5) + ', ' + table.getValue(i,6) +'</span>').
            append('<a href="' + attr['Website'] + '" style="display:block;" target="_blank">' + attr['Website'] + '</a>').
            //append('<a href="http://www.oasisnyc.net/stewardship/organizationdetails.aspx?id=' + id + '" style="display:block;" target="_blank">SEE ME ON OASIS!</a>').
            append( 
                $('<div class="linkButton">Zoom to me</div>').
                    click(
                        function(e){
                            CUR.MapPage.zoomToNetworkLink(id);
                        }
                    )
            );
//            append(
//                $('<div class="linkButton">See my network</div>').
//                    click(
//                        function(e){
//                            var latLng = CUR.MapPage.getLatLngById(id);
//                            CUR.MapPage.setRespondent({
//                                latLng: latLng,
//                                Id: id, 
//                                OrgName: attr['OrgName'], 
//                                FullGeoAddress: attr['FullGeoAddress'],
//                                GeoAddress: attr['GeoAddress'], 
//                                GeoCity: attr['GeoCity'],
//                                GeoState: attr['GeoState'], 
//                                GeoZip: attr['GeoZip'],
//                                Website: attr['Website']
//                            });
//                        }
//                    )
//            );

        
        item.append(p);
        _network.append(item);
        _networkLinks[id] = item;
        
    };
    
//    var renderNetworkLinks = function(table){
//        for(var i=0,len=table.getNumberOfRows(); i<len; i++){
//            _network.append(renderNetworkLink(table, i));
//        }
//    };
    
    
    return {
        renderRespondent: renderRespondent,
        //renderNetworkLinks: renderNetworkLinks,
        renderNetworkLink: renderNetworkLink,
        clearNetworkLinks: function(){
            _network.empty();
            _networkLinks = {};
        },
        highlightRespondent: function(){
            _respondent.find('.respondent').attr('class','respondent-highlight');
            _respondent.css({'color':'#222222', 'background-color': '#C0D5FF', 'border': 'solid 1px #333333', 'border-radius':'15px'});
        },
        unhighlightRespondent: function(){
            _respondent.find('.respondent-highlight').attr('class','respondent');
            _respondent.css({'color':'#555555', 'background-color': '#FFFFFF','border': 'solid 1px #FFFFFF' });
        },
        highlightNetworkLink: function(id){
            _networkLinks[id].find('.labels').attr('class','labels-highlight');
            _networkLinks[id].css({'color':'#222222','background-color': '#FEF1B5', 'border': 'solid 1px #333333', 'border-radius':'15px'});
            
        },
        unhighlightNetworkLink: function(id){
            _networkLinks[id].find('.labels-highlight').attr('class','labels');
            _networkLinks[id].css({'color':'#555555','background-color': '#FFFFFF', 'border': 'solid 1px #FFFFFF'});
        },
        setNetworkLinkGeocodeStatus: function(id, geocoded){
            if(!geocoded){
                if(_networkLinks[id]){
                    _networkLinks[id].find('.linkButton').css({'visibility': 'hidden'});
                    _networkLinks[id].find('.labels').css({'background-color': '#FFFFFF'});
                    _networkLinks[id].find('.labels-highlight').css({'background-color': '#FFFFFF'});
                }
            }
        },
        toggleShowBusy: function(busy){
            var mask = $('.infoPanel .loadingMask');
            if(busy){
                mask.css('display', 'block');
            } else {
                mask.css('display', 'none');
            }
        }
    };
};