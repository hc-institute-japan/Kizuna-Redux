import { useQuery } from "@apollo/react-hooks";
import { IonContent } from "@ionic/react";
import React from "react";
import GET_PROFILE_QUERY from "../../graphql/query/getProfileQuery";

const Home = () => {
  const { data } = useQuery(GET_PROFILE_QUERY, {
    variables: { address: localStorage.getItem("user_address") },
  });

  // console.log(data);

  return <IonContent></IonContent>;
};

export default Home;
