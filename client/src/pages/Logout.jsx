import React from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useNavigate } from "react-router-dom";

function Logout() {
    const MySwal = withReactContent(Swal);
    const navigate = useNavigate();

    if (Logout) {
        MySwal.fire({
          html: <i>Log Out Success!</i>,
          icon: 'success'
        }).then((value) => {
  
        //ลบ Token และออกจากระบบ
        localStorage.removeItem("token");
        navigate("/");
        })
      } 
  return () =>(
    <></>
  )
}

export default Logout;
