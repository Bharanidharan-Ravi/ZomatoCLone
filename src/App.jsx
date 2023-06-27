import Home from "./component/home";
import Search from "./component/search";
import Restaurant from "./component/restaurant";
import { Routes, Route } from "react-router-dom";
import { BASE_URL } from "./component/ApiUrl";
import { useEffect, useState } from "react";
import axios from "axios"
import jwt_decode from "jwt-decode";

function App() {
  let getUserDetails = () => {
  let token = localStorage.getItem ("zc_auth_token");
  if(token === null){
    return null
  }else{
    try {
      let data = jwt_decode (token);
      return data;
    } catch (error) {
      return null;
    }
  };
};
  let [user, setUser] = useState(getUserDetails)
  let [locationList, setLocationList] = useState([]);
  let getLocationList = async () => {
    try {
      let url = BASE_URL + "getLocationList";
      let { data } = await axios.get(url);
      setLocationList(data.location);
    } catch (error) {
      alert("server error");
    }
    
  };
  useEffect(() => {
    getLocationList();
  }, []);
  return (
  <>
   <Routes>
   <Route path="/" element={<Home locationList={locationList} user = {user}/>} />
        <Route path="/search/:id/:name" element={<Search locationList={locationList} user = {user}/>} />
        <Route path="/restaurant/:id" element={<Restaurant user = {user}/>} />
    </Routes>
  </>
  );
}

export default App;
