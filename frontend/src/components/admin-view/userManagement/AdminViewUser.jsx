import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import userprofile from '../../../assets/userimge.png';
import logo from '../../../assets/Logo.png';
import Cookies from 'js-cookie';
import axios from 'axios';
import "./css/profile.css";
import Swal from "sweetalert2";

const AdminviewProfile = () => {
  const navigate = useNavigate();
  const userSession = Cookies.get('user') ? JSON.parse(Cookies.get('user')) : {};
  const myemail = userSession.user?.email || "";

  const { id } = useParams();
  const [user, setUser] = useState([]);
  const [event, setEvent] = useState([]);
  const [order, setOder] = useState([]);
  const [statusFilter, setStatusFilter] = useState(""); // 🔹 NEW: filter state

  useEffect(() => {
    axios.get("http://localhost:5000/getuserdeatiles", { params: { id } })
      .then((result) => {
        setUser(result.data.user);
        setEvent(result.data.eventbooking);
        setOder(result.data.order);
        console.log("Users:", result.data.user);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  // 🔹 Filter utility function
  const filterByStatus = (data, status) => {
    if (!status) return data;
    return data.filter((item) => item.status.toLowerCase() === status.toLowerCase());
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'accepted':
      case 'processing':
      case 'Completed':
        return 'green';
      case 'canceled':
      case 'rejected':
        return 'red';
      case 'pending':
        return 'blue';
      default:
        return 'black';
    }
  };

  return (
    <div className="profile-container" style={{ background: "linear-gradient(to right,rgba(51, 51, 51, 0.48),rgba(238, 238, 238, 0.81))" }}>
      <header className="profile-header">
        <Link
          to={userSession.user?.role === "admin" ? "/admin/dashboard" : "/client/home"}
          className="back-button"
          style={{ backgroundColor: "rgb(59, 74, 122)" }}
        >
          <b>Back</b>
        </Link>
      </header>

      <div className="profile-content">
        <div className="orders-container">
          <div>
            <h1 style={{ color: "white" }}>
              <b>{user.username}</b> Orders & Photography Bookings
            </h1>
          </div>

          {/* 🔹 Status Filter Dropdown (Admin Only) */}
          {userSession.user?.role === "admin" && (
            <div style={{ marginBottom: "15px" }}>
              <label htmlFor="statusFilter" style={{ color: "white", marginRight: "10px" }}>Filter by Status:</label>
              <select
                id="statusFilter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All</option>
                <option value="Accepted">Accepted</option>
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Completed">Completed</option>
                <option value="Canceled">Canceled</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          )}

          <h2 style={{ color: "white" }}>Event Photography</h2>
          <div className="table-wrapper">
            <table className="styled-table">
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Duration</th>
                  <th>Price</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(event) && filterByStatus(event, statusFilter).length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', color: 'red' }}>
                      No event booking found
                    </td>
                  </tr>
                ) : (
                  filterByStatus(event, statusFilter).map((ob, index) => (
                    <tr
                      key={`${ob.email}-${index}`}
                      style={{ backgroundColor: index % 2 === 0 ? '#fafafa' : '#fff' }}
                    >
                      <td>{ob.eventType}</td>
                      <td>{ob.duration}</td>
                      <td>{Number(ob.budgetRange).toLocaleString()}</td>
                      <td>{ob.eventDate.slice(0, 10)}</td>
                      <td style={{ color: getStatusColor(ob.status) }}>
                        {ob.status}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <h2 style={{ color: "white" }}>Orders</h2>
          <div className="table-wrapper">
            <table className="styled-table">
              <thead>
                <tr>
                  <th>Products Cart Details</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(order) && filterByStatus(order, statusFilter).length === 0 ? (
                  <tr>
                    <td colSpan="2" style={{ textAlign: 'center', color: 'red' }}>
                      No orders found
                    </td>
                  </tr>
                ) : (
                  filterByStatus(order, statusFilter).map((ob, index) => (
                    <tr
                      key={`${ob._id || ob.email || index}`}
                      style={{ backgroundColor: index % 2 === 0 ? '#fafafa' : '#fff' }}
                    >
                      <td>
                        <table className="styled-table2" style={{ width: '95%', margin: '10px auto', borderCollapse: 'collapse' }}>
                          <thead style={{ background: "linear-gradient(to right, #6a82fb, #fc5c7d)" }}>
                            <tr>
                              <th>Product</th>
                              <th>Size</th>
                              <th>Quantity</th>
                              <th>Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Array.isArray(ob.items) &&
                              ob.items.map((item, idx) => (
                                <tr
                                  key={item._id || idx}
                                  style={{
                                    backgroundColor: idx % 2 === 0 ? '#fafafa' : '#fff',
                                  }}
                                >
                                  <td>{item.productName}</td>
                                  <td>{item.size}</td>
                                  <td>{item.quantity}</td>
                                  <td>{Number(item.total).toLocaleString()}</td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </td>
                      <td style={{ color: getStatusColor(ob.status) }}>
                        {ob.status}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminviewProfile;
