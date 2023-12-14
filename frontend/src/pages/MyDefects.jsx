import { useEffect, useState } from "react";
import { DefectsList } from "./DefectsList";
import config from "../config";

export const MyDefects = () => {
  const [defects, setDefects] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const options = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${localStorage.getItem("access_token")}`,
          },
        };
        const response = await fetch(
          `${config.backendUrl}/furniture_defects_user`,
          options
        );
        if (response.ok) {
          const data = await response.json();
          setDefects(data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return <DefectsList defects={defects} />;
};
