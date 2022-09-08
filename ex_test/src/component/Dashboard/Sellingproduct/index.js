import { PRODUCT_SELLING } from "../../Data";

import classNames from "classnames/bind";
import styles from "./Sellingproduct.module.scss";
import { useEffect, useState } from "react";
import { getAllProduct, getOrder } from "../../../Api/ApiOrder";

const cx = classNames.bind(styles);

function Sellingproduct() {
  const [arrayOrder, setArrayOrder] = useState([]);
  const [arrayProduct, setArrayProduct] = useState([]);
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
    let change = true;
    getAllProduct().then((items) => {
      if (change) {
        setArrayProduct(items.products);
      }
    });
    return () => (change = false);
  }, []);

  if (arrayProduct && arrayOrder) {
    let newDataUser = arrayProduct.map((e) => {
      let num = arrayOrder.filter((element) =>
        element.orderItem.find((item) => item.productName === e.title)
      );
      if (num.length >= 1) {
        const totalAmount = num.reduce((allAmount, item) => {
          allAmount += item.orderItem.reduce((amount, item) => {
            if (item.productName === e.title) {
              amount += Number(item.amount);
            }
            return amount;
          }, 0);
          return allAmount;
        }, 0);
        e.amount = totalAmount;
      } else {
        e.amount = 0;
      }
      return e;
    });

    const newArr = newDataUser.sort(function (user1, user2) {
      return -Number(user1.amount) + Number(user2.amount);
    });
    var data = newArr.slice(0, 10);
  }

  return (
    <div className={cx("product_selling")}>
      <h1 className={cx("product_selling_title")}>Sản phẩm bán chạy</h1>
      <ul className={cx("product_selling_list")}>
        {data.map((item, index) => {
          return (
            <li key={index}>
              <div>
                <h2>{item.title}</h2>
                {item.images.map((image) => (
                  <img className={cx("image_product")} src={image} alt="" />
                ))}
              </div>
              <div className={cx("product_sale")}>
                <p className={cx("product_sale_title")}>Đã bán</p>
                <p className={cx("product_sale_amount")}>{item.amount}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Sellingproduct;
