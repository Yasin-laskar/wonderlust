  
    mapboxgl.accessToken = mapToken;


      const map = new mapboxgl.Map({
          container: 'map', // container ID
          center: coordinate, // starting position [lng, lat]. Note that lat must be set between -90 and 90
          zoom: 9 // starting zoom
      });

  
    map.on('load', () => {
        const marker = new mapboxgl.Marker({ color: 'red' })
          .setLngLat(coordinate) // Use coordinates here
          .setPopup(
            new mapboxgl.Popup({ offset: 25 })
              .setHTML('<h4>Hello World!</h4>') // Dynamic content can go here
          )
          .addTo(map);
      });
    
   

    

