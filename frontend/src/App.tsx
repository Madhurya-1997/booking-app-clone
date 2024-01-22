import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Layout from "./layouts/Layout";
import Register from "./pages/Register";
import SignIn from "./pages/SignIn";
import Home from "./pages/Home";
import AddHotel from "./pages/AddHotel";
import MyHotels from "./pages/MyHotels";
import EditHotel from "./pages/EditHotel";
import Search from "./pages/Search";
import HotelDetails from "./pages/HotelDetails";
import { useAppContext } from "./hooks/useAppContext";
import Booking from "./pages/Booking";
import MyBookings from "./pages/MyBookings";


function App() {
  const { isLoggedIn } = useAppContext();
  return (
    <Router>
      <Routes>
        <Route path='/' element={
          <Layout>
            <Home />
          </Layout>
        } />
        <Route path='/search' element={
          <Layout>
            <Search />
          </Layout>
        } />
        <Route path='/register' element={
          <Layout>
            <Register />
          </Layout>
        } />
        <Route path='/sign-in' element={
          <Layout>
            <SignIn />
          </Layout>
        } />
        <Route path='/details/:id' element={
          <Layout>
            <HotelDetails />
          </Layout>
        } />

        {isLoggedIn &&
          <>
            <Route path="add-hotel" element={
              <Layout>
                <AddHotel />
              </Layout>

            } />

            <Route path="my-hotels" element={
              <Layout>
                <MyHotels />
              </Layout>

            } />

            <Route
              path="/my-bookings"
              element={
                <Layout>
                  <MyBookings />
                </Layout>
              }
            />

            <Route path="/hotel/:hotelId/booking" element={
              <Layout>
                <Booking />
              </Layout>

            } />

            <Route path="edit-hotel/:hotelId" element={
              <Layout>
                <EditHotel />
              </Layout>

            } />
          </>
        }

        <Route path='*' element={<Navigate to="/" />} />
      </Routes>
    </Router>
  )
}

export default App
