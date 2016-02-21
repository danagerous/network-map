/*global window,OpenLayers,CUR*/
/*jslint plusplus: false */
CUR = window.CUR || {};

CUR.GoogleQuery = function(config){
    var VISUALIZATION_BASE_URL = 'http://www.google.com/fusiontables/gvizdata?tq=';
    var FUSION_SQL_BASE_URL = 'https://www.google.com/fusiontables/api/query';


    return {
        getRespondentById: function(id, callback){
            var query = "SELECT RespondID, OrgName, FullGeoAddress, Website FROM 1PAQGJi5iiAGig88llfKnN5GGf8Z_7gJ5139wY-4m WHERE RespondID=" + id;//3824029   1fJcgj0sX5Dcg4xlP6QbpY01kyHDPWsAUnx9We6c    STEWMAP_PopulationXNetworkLinksFilteredForUniqueRespondents
            var encodedQuery = encodeURIComponent(query);
            var url = FUSION_SQL_BASE_URL + '?sql=' + encodedQuery + '&jsonCallback=?';
            $.ajax({
                url: url,
                dataType: 'jsonp',
                success: function (data) {
                    callback.call(null, data);
                }
            })

        },
        getAllRespondents: function(callback){
            var query = "SELECT RespondID, OrgName, FullGeoAddress, Website FROM 1PAQGJi5iiAGig88llfKnN5GGf8Z_7gJ5139wY-4m ORDER BY OrgName";//3824029   1fJcgj0sX5Dcg4xlP6QbpY01kyHDPWsAUnx9We6c    STEWMAP_PopulationXNetworkLinksFilteredForUniqueRespondents
            var encodedQuery = encodeURIComponent(query);
            var url = FUSION_SQL_BASE_URL + '?sql=' + encodedQuery + '&jsonCallback=?';
            $.ajax({
                url: url,
                dataType: 'jsonp',
                success: function (data) {
                    callback.call(null, data);
                }
            })

        },
        
        getNetworkLinksByRespondent: function(id, callback){
            var queryText = encodeURIComponent("SELECT AnswerID, OrgName, FullGeoAddress, GeoAddress, GeoCity, GeoState, GeoZip, Website, Geocoded FROM 15KtqMmt_TZUxBhgmmOoi1bblFHl0PcdBI0Tt0EDN WHERE RespondID=" + id + " ORDER BY OrgName"); // 4183834 https://www.google.com/fusiontables/data?dsrcid=4183834#rows:id=1
            var query = new google.visualization.Query(VISUALIZATION_BASE_URL + queryText); 
            query.send(
                function(response){
                    callback.call(null, response);
                }
            );
        }
    
    
    };
};