AFRAME.registerComponent("add-markers", {
  init: async function(){
    var scene = document.querySelector("#scene");

    var items = await this.getItems();

    items.map(item =>{
      var marker = document.createElement("a-marker");
        marker.setAttribute("id", item.id);
        marker.setAttribute("type", "pattern");
        marker.setAttribute("url", item.marker_pattern_url);
        marker.setAttribute("marker-handler", {});
        marker.setAttribute("cursor", {rayOrigin: "mouse"});
      scene.appendChild(marker);

      var model = document.createElement("a-entity");
        model.setAttribute("id",`model-${item.id}`);
        model.setAttribute("position", item.model_geometry.position);
        model.setAttribute("rotation", item.model_geometry.rotation);
        model.setAttribute("scale", item.model_geometry.scale);
        model.setAttribute("gltf-model", `url(${item.model_url})`);
        model.setAttribute("gesture-handler", {});
        model.setAttribute("visible", false);
      marker.appendChild(model);

      var mainPlane = document.createElement("a-plane");
        mainPlane.setAttribute("id", `main-plane-${item.id}`);
        mainPlane.setAttribute("position", {x:1,y:0,z:0});
        mainPlane.setAttribute("width", 1.8);
        mainPlane.setAttribute("height", 1.5);
        mainPlane.setAttribute("rotation", {x:-90, y:0, z:0});
        mainPlane.setAttribute("color", "orange");
        mainPlane.setAttribute("visible", false);
      marker.appendChild(mainPlane)

      var titlePlane = document.createElement("a-plane");
        titlePlane.setAttribute("id", `title-plane-${item.id}`);
        titlePlane.setAttribute("position", {x:0, y:0.89, z:0.02});
        titlePlane.setAttribute("width", 1.89);
        titlePlane.setAttribute("height", 0.3);
        titlePlane.setAttribute("rotation","0 0 0");
        titlePlane.setAttribute("color","#ff0000");
      mainPlane.appendChild(titlePlane);

      var titleText = document.createElement("a-entity");
        titleText.setAttribute("id", `title-text-${item.id}`);
        titleText.setAttribute("position", { x: 0, y: 0, z: 0.1 });
        titleText.setAttribute("rotation", { x: 0, y: 0, z: 0 });
        titleText.setAttribute("text", {
          font: "monoid",
          color: "black",
          width: 1.8,
          height: 1,
          align: "center",
          value: item.toy_name.toUpperCase()
        });
      titlePlane.appendChild(titleText);

      var desc = document.createElement("a-entity");
        desc.setAttribute("id", `text-${item.id}`);
        desc.setAttribute("position", { x: 0, y: 0, z: 0.1 });
        desc.setAttribute("rotation", { x: 0, y: 0, z: 0 });
        desc.setAttribute("text",{
          font: "monoid",
          color: "black",
          width: 1.5,
          height: 1,
          align: "center",
          value: item.description.join("\n")  
        });
      mainPlane.appendChild(desc);

      var price = document.createElement("a-entity");
        price.setAttribute("id", `price-${item.id}`);
        price.setAttribute("position", {x:0.03, y:0.05, z:0.1});
        price.setAttribute("rotation", {x:0,y:0,z:0});
        price.setAttribute("text",{
          font: "mozillavr",
          color: "white",
          width: 3,
          align: "center",
          value: `Only\n $${item.price}`
        });

      var pricePlane = document.createElement("a-image");
        pricePlane.setAttribute("id", `price-plane-${item.id}`);
        pricePlane.setAttribute("src", "https://raw.githubusercontent.com/whitehatjr/menu-card-app/main/black-circle.png");
        pricePlane.setAttribute("width", 0.8);
        pricePlane.setAttribute("height", 0.8);
        pricePlane.setAttribute("position",{x:-1.3, y:0,z:0.3});
        pricePlane.setAttribute("rotation", {x:-90,y:0,z:0});
        pricePlane.setAttribute("visible", false);
        pricePlane.appendChild(price);
      marker.appendChild(pricePlane)

      var ratingPlane = document.createElement("a-entity");
      ratingPlane.setAttribute("id", `rating-plane-${item.id}`);
      ratingPlane.setAttribute("position", {x:2, y:0, z:0.5});
      ratingPlane.setAttribute("geometry", {
        primitive: "plane",
        width: 1.5,
        height: 0.3
      });
      ratingPlane.setAttribute("material", {color: "#F0C30F"});
      ratingPlane.setAttribute("rotation", {x:-90, y:0, z:0});
      ratingPlane.setAttribute("visible", false)

      var rating = document.createElement("a-entity");
      rating.setAttribute("id", `rating-${item.id}`);
      rating.setAttribute("position", {x:0, y:0.05,z:0.1});
      rating.setAttribute("rotation", {x:0,y:0,z:0});
      rating.setAttribute("text",{
        font: "mozillavr",
        color: "black",
        width: 2.4,
        align: "center",
        value: `Customer Rating:  ${item.last_rating}`
      })
      ratingPlane.appendChild(rating);
      marker.appendChild(ratingPlane);

      var reviewPlane = document.createElement("a-entity");
      reviewPlane.setAttribute("id", `review-plane-${item.id}`);
      reviewPlane.setAttribute("position",{x:2,y:0,z:0});
      reviewPlane.setAttribute("geometry",{
        primitive: "plane",
        width: 1.5,
        height: 0.3
      });
      reviewPlane.setAttribute("material",{color: "#F0C30F"});
      reviewPlane.setAttribute("rotation", {x:-90, y:0, z:0});
      reviewPlane.setAttribute("visible", false);
     
      var review = document.createElement("a-entity");
      review.setAttribute("id", `review-${item.id}`);
      review.setAttribute("position", {x:0, y:0.05,z:0.1});
      review.setAttribute("rotation", {x:0,y:0,z:0});
      review.setAttribute("text",{
        font: "mozillavr",
        color: "black",
        width: 2.4,
        align: "center",
        value: `Customer Review:  \n${item.last_review}`
      });
      reviewPlane.appendChild(review);
      marker.appendChild(reviewPlane);
    })

    },

    getItems: async function(){
        return await firebase.firestore()
        .collection("toys")
        .get()
        .then(snap =>{
          return snap.docs.map(doc => doc.data());
        })
    }
})