function CustomMarker(latlng, map, text, cssClass) {
    this.latlng_ = latlng;

    this.text_ = text;
    this.cssClass_ = cssClass;
    this.offset_ = 12;
    // Once the LatLng and text are set, add the overlay to the map.  This will
    // trigger a call to panes_changed which should in turn call draw.
    this.setMap(map);
  }

  CustomMarker.prototype = new google.maps.OverlayView();

  CustomMarker.prototype.draw = function() {
    var me = this;

    // Check if the div has been created.
    var div = this.div_;
    if (!div) {
      // Create a overlay text DIV
      div = this.div_ = document.createElement('DIV');
      // Create the DIV representing our CustomMarker
      //div.style.border = "none";
      div.style.position = "absolute";
      div.style.paddingLeft = "0px";
      div.style.cursor = 'pointer';
      
      div.setAttribute('class', this.cssClass_);

//      var img = document.createElement("img");
//      img.src = "http://gmaps-samples.googlecode.com/svn/trunk/markers/circular/bluecirclemarker.png";
//      div.appendChild(img);

      var p = document.createElement("p");
      p.appendChild(document.createTextNode(this.text_));
      div.appendChild(p);
      
      google.maps.event.addDomListener(div, "click", function(event) {
        google.maps.event.trigger(me, "click");
      });
      
      google.maps.event.addDomListener(div, "mouseover", function(event) {
        google.maps.event.trigger(me, "mouseover");
      });
      
      google.maps.event.addDomListener(div, "mouseout", function(event) {
        google.maps.event.trigger(me, "mouseout");
      });
      
//      google.maps.event.addDomListener(div, "mousemove", function(event) {
//        google.maps.event.trigger(me, "mousemove");
//      });

      // Then add the overlay to the DOM
      var panes = this.getPanes();
      panes.overlayImage.appendChild(div);
    }

    // Position the overlay 
    var point = this.getProjection().fromLatLngToDivPixel(this.latlng_);
    if (point) {
      div.style.left = point.x - this.offset_ + 'px';
      div.style.top = point.y - this.offset_ + 'px';
    }
  };

  CustomMarker.prototype.remove = function() {
    // Check if the overlay was on the map and needs to be removed.
    if (this.div_) {
      this.div_.parentNode.removeChild(this.div_);
      this.div_ = null;
    }
  };

  CustomMarker.prototype.getPosition = function() {
   return this.latlng_;
  };