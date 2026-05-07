// import {useAuth} from "../hooks/useAuth";
// import React, { Children } from 'react'


// const Protected = () => {
//   const {loading, user} = useAuth()
//   const navigate = useNavigate()

//   if(loading){
//     return (<main><h1>Loading...</h1></main>)
//   }
//   if(!user){
//  return <Navigate to = {'/login'} />
//   }
//   return Children
// }
// export default Protected

import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Protected = ({ children }) => {
  const { loading, user } = useAuth();

  if (loading) {
    return (
      <main>
        <h1>Loading...</h1>
      </main>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default Protected;