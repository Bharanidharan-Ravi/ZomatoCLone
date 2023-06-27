import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "./header";


const Search = (props) => {
  /* pagination - start */
  const [pageIndex, setPageIndex] = useState(0);
  const [pageNumberList, setPageNumberList] = useState([]);
  const [slicedPageNumberList, setSlicedPageNumberList] = useState([]);

  const populatePageNumberList = (totalNoOfRecords) => {
    const perPageCount = 2;
    let counter = 0;
    let pageNumberList = [];
    while (totalNoOfRecords > 0) {
      counter += 1;
      pageNumberList.push(counter);
      totalNoOfRecords -= perPageCount;
    }
    setPageNumberList(pageNumberList);
    if (slicedPageNumberList.length == 0) {
      setSlicedPageNumberList(pageNumberList.slice(0, 5));
    }
  }
  const handlePageChange = (index) => {
    if (index == -1) {
      index = 0;
    } else if (index > pageNumberList.length - 1) {
      index = pageNumberList.length - 1;
    }
    setPageIndex(index);
    setFilterData({ ...filterData, page: index + 1 });
    getFilterData();
    if (index == slicedPageNumberList[slicedPageNumberList.length - 1]) {
      let val = index + 1;
      setSlicedPageNumberList(pageNumberList.slice(val-slicedPageNumberList.length, val));
    } else if(index == 0){
      let val = index;
      setSlicedPageNumberList(pageNumberList.slice(val-slicedPageNumberList.length, val));
    }
  }
  /* pagination - end */

  let { locationList } = props;
  let { id, name } = useParams();
  let [filterData, setFilterData] = useState({
    MealType: id,
    sort: 1,
  })
  let navigate = useNavigate();

  let [restaurants, setRestaurantsList] = useState([]);

  let getFilterData = async () => {
    let url = "http://localhost:3001/api/filter";
    let { data } = await axios.post(url, filterData);
    setRestaurantsList(data.RestaurantList);
    populatePageNumberList(data.totalNoOfRecords);
  };

  let filterForPage = (event) => {
    let { value, name } = event.target;

    switch (name) {
      case "location":
        if (value === "") {
          delete filterData.loc_id;
          setFilterData({ ...filterData })
        } else {
          setFilterData({ ...filterData, loc_id: Number(value) });
        }
        break;
      case "cuisine":
        let menu = value.split("-");
        if (value === "") {
          delete filterData.cuisine;
          setFilterData({ ...filterData })
        } else {
          setFilterData({
            ...filterData,
            cuisine: Number(menu[0]),
          });
        }
        break;
      case "sort":
        setFilterData({ ...filterData, sort: Number(value) });
        break;
      case "min_price":
        let array = value.split("-");
        setFilterData({
          ...filterData,
          lCost: Number(array[0]),
          hCost: Number(array[1]),
        })
        break;
    }

  };

  useEffect(() => {
    getFilterData()
  }, [filterData]);

  return (
    <>
      <div className="container-fluid">
        <div className="row bg-danger justify-content-center">
          <Header user={props.user} />
        </div>
        {/* <!-- section --> */}
        <div className="row">
          <div className="col-12 px-5 pt-4">
            <p className="h3">Breakfast Places In Mumbai</p>
          </div>
          {/* <!-- food item --> */}
          <div className="col-12 d-flex flex-wrap px-lg-5 px-md-5 pt-4">
            <div className="food-shadow col-12 col-lg-3 col-md-4 me-5 p-3 mb-4">
              <div className="d-flex justify-content-between">
                <p className="fw-bold m-0">Filter</p>
                <button
                  className="d-lg-none d-md-none btn"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseFilter"
                  aria-controls="collapseFilter"
                >
                  <span className="fa fa-eye"></span>
                </button>
              </div>
              {/* <!-- Collapse start  --> */}
              <div className="collapse show" id="collapseFilter">
                <div>
                  <label htmlFor="" className="form-label">
                    Select Location
                  </label>
                  <select className="form-select form-select-sm" name="location" onChange={filterForPage}>
                    <option value="">--- Select Location ---</option>
                    {
                      locationList.map((location, index) => {
                        return <option key={index} value={location.location_id}>{location.name}, {location.city}</option>
                      })
                    }
                  </select>
                </div>
                <p className="mt-4 mb-2 fw-bold">Cuisine</p>
                <div>
                  <div className="ms-1">
                    <input type="checkbox" className="form-check-input" name="cuisine" value="1" onChange={filterForPage} />
                    <label htmlFor="" className="form-check-label ms-1">
                      North Indian
                    </label>
                  </div>
                  <div className="ms-1">
                    <input type="checkbox" className="form-check-input" name="cuisine" value="2" onChange={filterForPage} />
                    <label htmlFor="" className="form-check-label ms-1">
                      South Indian
                    </label>
                  </div>
                  <div className="ms-1">
                    <input type="checkbox" className="form-check-input" name="cuisine" value="4" onChange={filterForPage} />
                    <label htmlFor="" className="form-check-label ms-1">
                      Fast food
                    </label>
                  </div>
                  <div className="ms-1">
                    <input type="checkbox" className="form-check-input" name="cuisine" value="3" onChange={filterForPage} />
                    <label htmlFor="" className="form-check-label ms-1">
                      Street food
                    </label>
                  </div>
                  <div className="ms-1">
                    <input type="checkbox" className="form-check-input" name="cuisine" value="5" onChange={filterForPage} />
                    <label htmlFor="" className="form-check-label ms-1">
                      chinese
                    </label>
                  </div>
                </div>
                <p className="mt-4 mb-2 fw-bold">Cost For Two</p>
                <div>
                  <div className="ms-1">
                    <input
                      type="radio"
                      className="form-check-input"
                      name="min_price"
                      value="0-500"
                      onChange={filterForPage}
                    />
                    <label htmlFor="" className="form-check-label ms-1">
                      less then 500
                    </label>
                  </div>
                  <div className="ms-1">
                    <input
                      type="radio"
                      className="form-check-input"
                      name="min_price"
                      value="500-1000"
                      onChange={filterForPage}
                    />
                    <label htmlFor="" className="form-check-label ms-1">
                      500 to 1000
                    </label>
                  </div>
                  <div className="ms-1">
                    <input
                      type="radio"
                      className="form-check-input"
                      name="min_price"
                      value="1000-1500"
                      onChange={filterForPage}
                    />
                    <label htmlFor="" className="form-check-label ms-1">
                      1000 to 1500
                    </label>
                  </div>
                  <div className="ms-1">
                    <input
                      type="radio"
                      className="form-check-input"
                      name="min_price"
                      value="1500-2000"
                      onChange={filterForPage}
                    />
                    <label htmlFor="" className="form-check-label ms-1">
                      1500 to 2000
                    </label>
                  </div>
                  <div className="ms-1">
                    <input
                      type="radio"
                      className="form-check-input"
                      name="min_price"
                      value="2000-99999"
                      onChange={filterForPage}
                    />
                    <label htmlFor="" className="form-check-label ms-1">
                      2000+
                    </label>
                  </div>
                </div>
                <p className="mt-4 mb-2 fw-bold">Sort</p>
                <div>
                  <div className="ms-1">
                    <input type="radio" className="form-check-input" value="1" name="sort"
                      checked={filterData.sort == 1 ? true : false}
                      onChange={filterForPage} />
                    <label htmlFor="" className="form-check-label ms-1">
                      Price low to high
                    </label>
                  </div>
                  <div className="ms-1">
                    <input type="radio" className="form-check-input" value="-1" name="sort"
                      checked={filterData.sort == -1 ? true : false}
                      onChange={filterForPage} />
                    <label htmlFor="" className="form-check-label ms-1">
                      Price high to low
                    </label>
                  </div>
                </div>
              </div>
              {/* <!-- Collapse end --> */}
            </div>
            {/* <!-- search result --> */}
            <div className="col-12 col-lg-8 col-md-7">
              {
                restaurants.length == 0 ? (
                  <>
                    <p className="text-center h4 text-danger">No restaurant found</p>
                  </>
                ) : (
                  restaurants.map((restaurant, index) => {
                    return <div onClick={() => navigate("/restaurant/" + restaurant._id)} key={index} className="col-12 food-shadow p-4 mb-4">
                      <div className="d-flex align-items-center">
                        <img src="/images/food-item.png" className="food-item" />
                        <div className="ms-5">
                          <p className="h4 fw-bold">{restaurant.name}</p>
                          <span className="fw-bold text-muted">FORT</span>
                          <p className="m-0 text-muted">
                            <i
                              className="fa fa-map-marker fa-2x text-danger"
                              aria-hidden="true"
                            ></i>
                            {restaurant.locality}, {restaurant.city}
                          </p>
                        </div>
                      </div>
                      <hr />
                      <div className="d-flex">
                        <div>
                          <p className="m-0">CUISINES:</p>
                          <p className="m-0">COST FOR TWO:</p>
                        </div>
                        <div className="ms-5">
                          <p className="m-0 fw-bold">
                            {restaurant.cuisine
                              .map((value) => {
                                return value.name;
                              })
                              .join(", ")}
                          </p>
                          <p className="m-0 fw-bold">
                            <i className="fa fa-inr" aria-hidden="true"></i>
                            {restaurant.min_price}
                          </p>
                        </div>
                      </div>
                    </div>
                  }))

              }

              {slicedPageNumberList && slicedPageNumberList.length > 0 ? <div className="col-12 pagination d-flex justify-content-center">
                <ul className="pages">
                  <li onClick={() => handlePageChange(pageIndex - 1)}>&lt;</li>
                  {slicedPageNumberList && slicedPageNumberList.map((pageNumber, index) => {
                    return <li key={index} className={pageNumber-1 == pageIndex ? 'active' : ''} onClick={() => handlePageChange(pageNumber-1)}>
                      {pageNumber}
                    </li>
                  })}
                  <li onClick={() => handlePageChange(pageIndex + 1)}>&gt;</li>
                </ul>
              </div> : null}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Search;
