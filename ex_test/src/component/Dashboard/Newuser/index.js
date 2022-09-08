import classNames from "classnames/bind";
import { useEffect, useState } from "react";
import { getAllUser, getOrder } from "../../../Api/ApiOrder";
import { handleCustomNumber } from "../../Order/AddOrder";
import styles from "./Newuser.module.scss";

const cx = classNames.bind(styles);

function Newuser() {
  const [arrayOrder, setArrayOrder] = useState([]);
  const [dataUser, setDataUser] = useState([]);

  useEffect(() => {
    let change = true;
    getOrder().then((items) => {
      if (change) {
        setArrayOrder(items);
      }
    });
    return () => (change = false);
  }, []);

  useEffect(() => {
    const fetchApi = async () => {
      const userList = await getAllUser();
      setDataUser(userList.users);
    };
    fetchApi();
  }, []);

  if (dataUser && arrayOrder) {
    let newDataUser = dataUser.map((e) => {
      let num = arrayOrder.filter((element) => element.userName === e.lastName);
      if (num.length >= 1) {
        const total = num.reduce((agr, item) => {
          agr += Number(
            item.total
              .slice(0, item.total.length - 7) 
              .split(".")
              .join("")
          );
          return agr;
        }, 0);
        e.allTotal = total;
      } else {
        e.allTotal = 0;
      }
      return e;
    });

    const newArr = newDataUser.sort(function (user1, user2) {
      return -Number(user1.allTotal) + Number(user2.allTotal);
    });

    var data = newArr.slice(0,10)
  }

  return (
    <div className={cx("new_user")}>
      <h1 className={cx("new_user_title")}>Khách hàng tiềm năng</h1>
      <ul className={cx("new_user_list")}>
        {data
          ? data.map((item,index) => (
              <li key={index}>
                <img src={item.image} alt={item.lastName} />
                <div>
                  <h2>{item.firstName + " " + item.lastName}</h2>
                  <p>Số tiền đã mua sắm {handleCustomNumber(item.allTotal)}</p>
                </div>
              </li>
            ))
          : null}
      </ul>
    </div>
  );
}

export default Newuser;
