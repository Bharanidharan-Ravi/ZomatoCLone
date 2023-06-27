import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import Header from "./header";

const Restaurant = (props) => {
    let {id} = useParams();
    const [rDetails ,setRDetail] = useState({});
    const [MenuItemList ,setMenuItemList] = useState([]);
    const [total, setTotal] = useState(0);
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [mobile, setMobile] = useState();
    const [address, setAddress] = useState();

      let getRestaurantDetails =async ()=>{
      let url = "http://localhost:3001/api/get-RestaurantDetails-By-Restaurant-Id/" + id;
      let {data} = await axios.get(url);
      setRDetail(data.restaurant);
    };

    let getMenuItems = async ()=>{
      let url = "http://localhost:3001/api/get-MenuItems-By-Restaurant-Id/" + id;
      let {data} = await axios.get(url);
      console.log(data);
      setTotal(0);
      setMenuItemList(data.MenuItemList)
    };
    let addQty = (index) => {
      console.log(index);
      let _menuItemList = [...MenuItemList];
      _menuItemList[index].qty += 1;
      let newTotal = Number(_menuItemList[index].price) + Number(total);
      setTotal(newTotal);
      setMenuItemList(_menuItemList);
    };
    let removeQty = (index) =>{
      let _menuItemList = [...MenuItemList];
      _menuItemList[index].qty -= 1;
      let newTotal =total - _menuItemList[index].price
      setTotal(newTotal);
      setMenuItemList(_menuItemList);
    };

    let makePayment = async() =>{
      let url = "http://localhost:3001/api/gen-order-details";
      let { data } = await axios.post(url, {amount:total}) 
      console.log(data);
      if (data.status === false){
        alert("unable to create order details")
        return false;
      };
     let {order} = data;
var options = {
    key: "rzp_test_RB0WElnRLezVJ5",
    amount: order.amount, 
    currency: order.currency,
    name: "Zomoto",
    description: "Online Food Delivery",
    image: "https://upload.wikimedia.org/wikipedia/commons/b/bb/Square_zomato_logo_new.png?20180511061014",
    order_id: order.id, 
    handler: async  (response) => {

      let userOrders = MenuItemList.filter((menu_item)=> {
        return menu_item.qty > 0
      })

      let sendData = {
      pay_id: response.razorpay_payment_id,
      order_id: response.razorpay_order_id,
      signature: response.razorpay_signature,
      orders : userOrders,
      name: name,
      email: email,
      contact: mobile,
      address : address,
      totalAmount : total,
      rest_id : rDetails._id,
      rest_name : rDetails.name,
      }
      console.log(response);

      let url = "http://localhost:3001/api/verify-payment";
        let { data } = await axios.post(url, sendData);
        if (data.status === true) {
          alert("Payment done successfully");
        } else {
          alert("Payment Fail, try again.");
        }
        console.log(sendData);
    },

    prefill: {
        name: name,
        email: email,
        contact: mobile
    },
    notes: {
        address: "Razorpay Corporate Office"
    },
    theme: {
        color: "#3399cc"
    }
};
var razorpay = new window.Razorpay(options);
razorpay.on('payment.failed', function (response){
        alert(response.error.code);
        alert(response.error.description);
        alert(response.error.source);
        alert(response.error.step);
        alert(response.error.reason);
        alert(response.error.metadata.order_id);
        alert(response.error.metadata.payment_id);
});
    razorpay.open();
    };
    useEffect(()=>{
      getRestaurantDetails();

    },[]);
    
    return (
      <>
       {/* modal */}
      <div
        className="modal fade"
        id="slideShow"
        tabIndex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg " style={{ height: "75vh " }}>
          <div className="modal-content">
            <div className="modal-body h-75">
              {rDetails.thumb ?(
              <Carousel showThumbs={false} infiniteLoop={true}>
                {rDetails.thumb.map((value, index) => {
                  return (
                    <div key={index} className="w-100">
                      <img src={"/images/" + value} />
                    </div>
                  );
                })}
              </Carousel> ):null}
            </div>
          </div>
        </div>
      </div>
      <div
        className="modal fade"
        id="modalMenuItem"
        aria-hidden="true"
        aria-labelledby="exampleModalToggleLabel"
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalToggleLabel">
                 {rDetails.name}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            
            <div className="modal-body ">
            {MenuItemList.map((item, index)=>{
              return(
                  <div className="row p-2" key={index}>
                    <div className="col-8">
                      <p className="mb-1 h6">{item.name}</p>
                      <p className="mb-1">Rs.{item.price} </p>
                      <p className="small text-muted">{item.description}</p>
                    </div>
                    <div className="col-4 d-flex justify-content-end">
                      <div className="menu-food-item">
                        <img src={"/images/"+ item.image} alt="" />
                        {item.qty > 0 ?(
                          <div className="order-item-count section ">
                            <span
                              className="hand"
                              onClick={() => removeQty(index)}
                            >
                              -
                            </span>
                            <span>{item.qty}</span>
                            <span
                              className="hand"
                              onClick={() => addQty(index)}
                            >
                              +
                            </span>
                          </div>
                          ):(
                          <button
                            className="btn btn-primary btn-sm add"
                            onClick={() => addQty(index)}
                          >
                            Add
                          </button>
                          )}
                      </div>
                    </div>
                    <hr className=" p-0 my-2" />
                  </div>
               );
               })}
            {total > 0 ? (
                <div className="d-flex justify-content-between">
                  <h3>Total {total}</h3>
                  <button
                    className="btn btn-danger"
                    data-bs-target="#userForm"
                    data-bs-toggle="modal"
                  >
                    Process
                  </button>
                </div>
              ) : null}
            </div> 
          </div>
        </div>
      </div>

      {/* user form modal */}
      <div
        className="modal fade"
        id="userForm"
        aria-hidden="true"
        aria-labelledby="exampleModalToggleLabel2"
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalToggleLabel2">
                {rDetails.name} User Form
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label
                  htmlFor="exampleFormControlInput1"
                  className="form-label"
                  
                >
                  Full Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="exampleFormControlInput1"
                  placeholder="Enter full Name"
                  // value = "name"
                  onChange={(event) => {setName(event.target.value)}}
                />
              </div>
              <div className="mb-3">
                <label
                  htmlFor="exampleFormControlInput1"
                  className="form-label"
                  
                >
                  Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="exampleFormControlInput1"
                  placeholder="name@example.com"
                  value = "g.bharani@gmail.com"
                  onChange={(event) => {setEmail(event.target.value)}}
                />
              </div>
              <div className="mb-3">
                <label
                  htmlFor="exampleFormControlTextarea1"
                  className="form-label"
                 
                >
                  Address
                </label>
                <textarea
                  className="form-control"
                  id="exampleFormControlTextarea1"
                  rows="3"
                  value = "india"
                  onChange={(event) => {setAddress(event.target.value)}}
                ></textarea>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-danger"
                data-bs-target="#modalMenuItem"
                data-bs-toggle="modal"
              >
                Back
              </button>
              <button className="btn btn-success" onClick={makePayment}>
                Make Payment
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid">
        <div className="row bg-danger justify-content-center">
          <Header user = {props.user}/>
        </div>
        {/* <!-- section -->  */}
        <div className="row justify-content-center">
          <div className="col-10">
            <div className="row">
              <div className="col-12 mt-5">
                <div className="restaurant-main-image position-relative">
                  <img src={"/images/"+ rDetails.image} alt="" className="" />
                  <button
                    className="btn btn-outline-light position-absolute btn-gallery"
                    data-bs-toggle="modal"
                    data-bs-target="#slideShow"
                  >
                    Click To Get Image Gallery
                  </button>
                </div>
              </div>
              <div className="col-12">
                <h3 className="mt-4">{rDetails.name}</h3>
                <div className="d-flex justify-content-between">
                  <ul className="list-unstyled d-flex gap-3">
                    <li>Overview</li>
                    <li>Contact</li>
                  </ul>
                  <button
                    className="btn btn-danger align-self-start"
                    data-bs-toggle="modal"
                    href="#modalMenuItem"
                    role="button"
                    onClick={getMenuItems}
                    disabled = {props.user ? false : true}
                  >
                    Menu Item
                    
                  </button>
                </div>
                <hr className="mt-0" />

                <div className="over-view">
                  <p className="h5 mb-4">About this place</p>

                  <p className="mb-0 fw-bold">Cuisine</p>
                  <p>
                  {rDetails.cuisine
                      ? rDetails.cuisine
                          .map((value) => {
                            return value.name;
                          })
                          .join(", ")
                      : null}
                  </p>

                  <p className="mb-0 fw-bold">MinCost</p>
                  <p>₹{rDetails.min_price }</p>
                </div>

                <div className="over-view">
                  <p className="mb-0 fw-bold">Phone Number</p>
                  <p>{rDetails.contact_number}</p>

                  <p className="mb-0 fw-bold">Address</p>
                  <p>
                    {rDetails.locality}, {rDetails.city}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </>
    );
  };
  
  export default Restaurant;