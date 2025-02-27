import { useEffect } from "react";
import { useParams } from "react-router";
import { Spin } from "antd";

function Redirect() {
  const { redirectID } = useParams();

  useEffect(() => {
    fetch(`https://short-service.corvux.co/${redirectID}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          window.location.href = "/";
          return;
        }
        window.location.href = data.url;
      });
  }, [redirectID]);

  return (
    <div className="bg-black flex items-center justify-center h-screen">
      <Spin />
    </div>
  );
}

export default Redirect;
