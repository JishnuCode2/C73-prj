var uid = null;
AFRAME.registerComponent("marker-handler", {
    init: async function () {

      var toys = await this.getItems();
      var id = this.el.id;
  
      this.el.addEventListener("markerFound", () => {
        console.log("marker is found")
        this.handleMarkerFound(toys, id);
      });
  
      this.el.addEventListener("markerLost", () => {
        console.log("marker is lost")
        this.handleMarkerLost();
      });
    },

    askUserId: function(){
         swal({
            title: "Welcome to Toy Shop!!",
            icon: "none",
            content: {
              element: "input",
              attributes: {
                placeholder: "Type Your Customer Id",
                type: "number",
                min: 1
              }
            },
            closeOnClickOutside: false
        }).then(inputValue =>{
          return inputValue;
        })
    },

    handleMarkerFound: function (toys, id) {
      var toy = toys.filter(toy => toy.id === id)[0];
      if(toy.is_out_of_stock){
         swal({
          icon: "warning",
          title: toy.toy_name.toUpperCase(),
          text: `The Requested Toy - ${toy.toy_name} Is Currently Unavailable`,
          timer: 2500,
          button: false
         });
      }
      else{
        var model = document.querySelector(`#model-${toy.id}`);
        model.setAttribute("visible", true);
        
        var mainPlane = document.querySelector(`#main-plane-${toy.id}`);
        mainPlane.setAttribute("visible", true);

        var pricePlane = document.querySelector(`#main-plane-${toy.id}`);
        pricePlane.setAttribute("visible", true);

        var buttonDiv = document.getElementById("button-div");
        buttonDiv.style.display = "flex";
    
        var summaryButton = document.getElementById("rating-button");
        var orderButtton = document.getElementById("order-button");
        var orderSummaryButton = document.getElementById("order-summary-button");
        var payButton = document.getElementById("pay-button");
        var rateButton = document.getElementById("rating-button");

        rateButton.addEventListener("click", ()=>{
          this.handleRatings(toy)
        })
      
        summaryButton.addEventListener("click", function () {
          swal({
            icon: "warning",
            title: "Order Summary",
            text: "Work In Progress"
          });
        });
    
        orderButtton.addEventListener("click", () => {
          uid = this.askUserId()
          if(uid != null){
            var user_id;
            uid <= 9 ? (user_id = `U0${uid}`) : `U${uid}`
            this.handleOrder(user_id, toy);
          }
          swal({
            icon: "https://i.imgur.com/4NZ6uLY.jpg",
            title: "Thanks For Order!",
            text: "Your order will soon be registered"
          });
        });

        orderSummaryButton.addEventListener("click", ()=>{
          this.handleOrderSummary()
        });

        payButton.addEventListener("click", ()=>{
          this.handlePayment()
        })
      }
    },

    handleOrderSummary: async function(){
      var user_id;
      uid <= 9 ? (user_id =`U0${uid}`) : `U${uid}`;

      var orderSummary = await this.getOrderSummary(user_id);
      
      var modalDiv = document.getElementById("modal-div");
      modalDiv.style.display = "flex";

      var tableBodyTag = document.getElementById("bill-table-body");
      tableBodyTag.innerHTML = "";

      var currentOrders = Object.keys(orderSummary.current_orders);
      currentOrders.map(i =>{
        var tr = document.createElement("tr");

        var item = document.createElement("td");
        var price = document.createElement("td");
        var quantity = document.createElement("td");
        var subtotal = document.createElement("td");

        item.innerHTML = orderSummary.current_orders[i].item;

        price.innerHTML ="$" + orderSummary.current_orders[i].price;
        price.setAttribute("class", "text-center");

        quantity.innerHTML = orderSummary.current_orders[i].quantity;
        quantity.setAttribute("class", "text-center");

        subtotal.innerHTML = "$" + orderSummary.current_orders[i].subtotal;
        subtotal.setAttribute("class", "text-center");

        tr.appendChild(item);
        tr.appendChild(price);
        tr.appendChild(quantity);
        tr.appendChild(subtotal);

        tableBodyTag.appendChild(tr);
      });

      var totalTr = document.createElement("tr");

      var td1 = document.createElement("td")
      td1.setAttribute("class", "no-line");
      
      var td2 = document.createElement("td")
      td2.setAttribute("class", "no-line");

      var td3 = document.createElement("td")
      td3.setAttribute("class", "no-line text-center");

      var strongTag = document.createElement("strong");
      strongTag.innerHTML ="Total";
      td3.appendChild(strongTag);

      var td4 = document.createElement("td");
      td4.setAttribute("class", "no-line text-right");
      td4.innerHTML = "$" + orderSummary.total_bill;

      totalTr.appendChild(td1);
      totalTr.appendChild(td2);
      totalTr.appendChild(td3);
      totalTr.appendChild(td4);
      
      tableBodyTag.appendChild(totalTr);
    },

    getOrderSummary: async function(uid){
      return await firebase
        .firestore()
        .collection("users")
        .doc(uid)
        .get()
        .then(doc => doc.data())
    },

    handlePayment: function(){
      document.getElementById("modal-div").style.display = "none";

      var user_id;
      uid <=9? (user_id = `U0${uid}`): `U${uid}`
  
      firebase
        .firestore()
        .collection("users")
        .doc(user_id)
        .update({
          current_orders: {},
          total_bill: 0
        })
        .then(()=>{
          swal({
            icon: "success",
            title: "Thanks For Paying!!",
            text: "We hope you enjoy your Order!!",
            timer: 2500,
            buttons: false
          })
        })
    },

    handleMarkerLost: function () {
      var buttonDiv = document.getElementById("button-div");
      buttonDiv.style.display = "none";
    },

    getItems: async function(){
      return await firebase.firestore()
      .collection("toys")
      .get()
      .then(snap =>{
        return snap.docs.map(doc => doc.data());
      })
    },

    handleRatings: async function(toy){
      var user_id;
      uid <=9 ? (user_id = `U0${uid}`): `U${uid}`;
      var orderSummary = await this.getOrderSummary(user_id);

      var currentOrders = Object.keys(orderSummary.current_orders);
      if(currentOrders.length > 0 && currentOrders == toy.id){
        document.getElementById("rating-modal-div").style.display = "flex";
        document.getElementById("rating-input").value = "0";
        document.getElementById("feedback-input").value = "";

        var saveRatingButton = document.getElementById("save-rating-button");
        saveRatingButton.addEventListener("click",()=>{
          document.getElementById("rating-modal-div").style.display = "none";
          var rating = document.getElementById("rating-input").value;
          var review = document.getElementById("feedback-input").value;

          firebase
          .firestore()
          .collection("toys")
          .doc(toy.id)
          .update({
            last_review: review,
            last_rating: rating
          })
          .then(()=>{
            swal({
              icon: "success",
              title: "Thanks for rating",
              text: "We hope that you like your purchase!!",
              timer: 2500,
              buttons: false
            });
          });
        });
      }
      else{
        swal({
         icon: "warning",
         title: "Oops!",
         text: "No item found to give ratings",
         timer: 2500,
         buttons: false
        })
      }
    },

    handleOrder: function(uid, toy){
      firebase.firestore()
        .collection("users")
        .doc(uid)
        .get()
        .then(doc => {
          var details = doc.data();
          if (details["current_orders"][toy.id]) {
            details["current_orders"][toy.id]["quantity"] += 1;
            var currentQuantity = details["current_orders"][toy.id]["quantity"];
            details["current_orders"][toy.id]["subtotal"] = currentQuantity * toy.price;
          } else {
            details["current_orders"][toy.id] = {  
              item: toy.toy_name,
              price: toy.price,
              quantity: 1,
              subtotal: toy.price*1
            };
          };
          details.total_bill = toy.price;

          firebase
          .firestore()
          .collection("users").doc(doc.id)
          .update(details);
        });
    },
  
  });
  