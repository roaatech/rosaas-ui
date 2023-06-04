import { useDispatch } from "react-redux";
import { directionFun } from "../../store/slices/main";

const useGlobal = () => {
  const dispatch = useDispatch();
  const changeDirection = (direction) => {
    localStorage.setItem("direction", direction);
    dispatch(directionFun(direction));
    document.documentElement.dir = direction;
  };

  const DataTransform = (dateTime) => {
    // const dateObj = new Date(dateTime);

    // const month = dateObj.getMonth() + 1;
    // const day = dateObj.getDate();
    // const year = dateObj.getFullYear();
    // const hour = dateObj.getHours();
    // const minute = dateObj.getMinutes();

    // // Format date
    // const formattedDate = `${month}/${day}/${year}`;

    // // Format time
    // let formattedTime = "";
    // if (hour > 12) {
    //   formattedTime = `${hour - 12}:${minute.toString().padStart(2, "0")}PM`;
    // } else if (hour === 12) {
    //   formattedTime = `12:${minute.toString().padStart(2, "0")}PM`;
    // } else {
    //   formattedTime = `${hour}:${minute.toString().padStart(2, "0")}AM`;
    // }

    // return `${formattedDate}, ${formattedTime}`;

    const utcDateTime = new Date(dateTime + "Z"); // Appending 'Z' indicates UTC time
    const localDateTime = utcDateTime.toLocaleString(undefined, {
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });
    return localDateTime;
  };

  return { changeDirection, DataTransform };
};

export default useGlobal;
