import { useDispatch } from "react-redux";
import { directionFun } from "../../store/slices/main";

const useGlobal = () => {
  const dispatch = useDispatch();
  const changeDirection = (direction) => {
    localStorage.setItem("direction", direction);
    dispatch(directionFun(direction));
    document.documentElement.dir = direction;
  };

  return { changeDirection };
};

export default useGlobal;
