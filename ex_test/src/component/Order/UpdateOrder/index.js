import classNames from "classnames/bind";
import arrayMutators from "final-form-arrays";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { Field, Form as FieldForm } from "react-final-form";
import { FieldArray } from "react-final-form-arrays";
import {
  Button,
  ButtonToolbar,
  ControlLabel,
  Form as RSForm,
  FormGroup,
  Icon,
  Modal,
} from "rsuite";
import {
  getAllProduct,
  getAllUser,
  getOneOrder,
  getOneUser,
  handleUpdateOrder,
} from "../../../Api/ApiOrder";
import {
  InputCustomField,
  InputPickerCustomField,
  NumberCustomField,
} from "../../../FinalFormComponents";
import { handleCheckVat } from "../AddOrder";
import styles from "./UpdateOrder.module.scss";
const cx = classNames.bind(styles);

const getIdUser = (listUser, valueAddress) => {
  if (valueAddress)
    return listUser.find((item) => item.lastName === valueAddress);
  else {
  }
};

const getIdProduct = (listProduct, unitPrice) => {
  if (unitPrice) return listProduct.find((item) => item.title === unitPrice);
  else {
  }
};
const required = (value) => (value ? undefined : "Required");

UpdateOrder.propTypes = {
  data: PropTypes.array.isRequired,
  updateUser: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired,
};

function UpdateOrder(props) {
  const { id, updateUser, data } = props;

  const [order, setOrder] = useState([]);
  const [arrUser, setArrUser] = useState([]);
  const [idNameUser, setIdNameUser] = useState();
  const [valueAddress, setValueAddress] = useState();
  const [phone, setPhone] = useState();

  const [arrProduct, setArrProduct] = useState([]);
  const [total, setTotal] = useState();
  const [allTotal, setAllTotal] = useState(0);
  

  //user
  // kiểm tra value của user
  const handleCheckValueUser = (value) => {
    if (value) {
      var res = getIdUser(arrUser, value);
      setIdNameUser(parseInt(res.id));
    } else {
      setValueAddress("");
      setPhone("");
    }
  };

  // lấy danh sách các user
  useEffect(() => {
    const fetchApi = async () => {
      const userList = await getAllUser();
      setArrUser(userList.users);
    };
    fetchApi();
  }, []);

  // lấy một user
  useEffect(() => {
    if (idNameUser !== undefined && Number.isNaN(idNameUser) !== true) {
      const fetchApi = async () => {
        const user = await getOneUser(idNameUser);
        setValueAddress(user.address.address);
        setPhone(user.phone);
      };
      fetchApi();
    } else {
      console.log("Chưa có id user");
      setPhone();
      setValueAddress();
    }
  }, [idNameUser]);

  // ======================

  // lấy danh sách product
  useEffect(() => {
    const fetchApi = async () => {
      const productList = await getAllProduct();
      setArrProduct(productList.products);
    };
    fetchApi();
  }, []);

  const handleCustomNumber = (value) => {
    let newValue = value * 1000;
    newValue = newValue.toLocaleString("it-IT", {
      style: "currency",
      currency: "VND",
    });
    return newValue;
  };

  const handleAllTotal = (values) => {
    if (values.orderItem) {
      if (values.orderItem.length) {
        let Total = 0;
        for (let i = 0; i < values.orderItem.length; i++) {
          if (values.orderItem[i] !== undefined && values.orderItem[i].total) {
            let oneTotle = values.orderItem[i].total;
            if (oneTotle !== "0 VND") {
              oneTotle = Number(
                oneTotle
                  .slice(0, oneTotle.length - 7)
                  .split(".")
                  .join("")
              );
              Total += oneTotle;
              setTotal(Total);
            } else {
              setTotal(0);
            }
          }
          var allTotal = 0;
          if (values.vat !== undefined) {
            var vat = values.vat;
            vat = Number(vat.slice(0, vat.length - 1));
          }

          if (values.voucher !== undefined) {
            var voucher = values.voucher;
            if (voucher === "15% giá trị đơn hàng") {
              voucher = Number(voucher.slice(0, 2));
            } else {
              voucher = Number(voucher.slice(0, voucher.length - 1));
            }
          }

          // khi có cả VAT và Voucher
          if (values.vat && values.voucher) {
            if (values.voucher === "100k" && total !== 0) {
              allTotal = total - voucher + ((total - voucher) * vat) / 100;
              if (allTotal > 0) {
                setAllTotal(handleCustomNumber(allTotal));
              } else {
                setAllTotal(handleCustomNumber(0));
              }
            }

            if (values.voucher === "5%") {
              allTotal =
                total -
                (total * voucher) / 100 +
                ((total - (total * voucher) / 100) * vat) / 100;
              if (allTotal > 0) {
                setAllTotal(handleCustomNumber(allTotal));
              } else {
                setAllTotal(handleCustomNumber(0));
              }
            }

            if (values.voucher === "15% giá trị đơn hàng") {
              allTotal =
                total -
                (total * voucher) / 100 +
                ((total - (total * voucher) / 100) * vat) / 100;
              if (allTotal > 0) {
                setAllTotal(handleCustomNumber(allTotal));
              } else {
                setAllTotal(handleCustomNumber(0));
              }
            }
          }
          //// khi không có cả VAT và voucher
          else {
            allTotal = total;
            setAllTotal(handleCustomNumber(allTotal));
          }

          // khi chỉ có voucher
          if (values.voucher && values.vat === undefined) {
            if (values.voucher === "100k" && total !== 0) {
              allTotal = total - voucher;
              if (allTotal > 0) {
                setAllTotal(handleCustomNumber(allTotal));
              } else {
                setAllTotal(handleCustomNumber(0));
              }
            }

            if (values.voucher === "5%") {
              allTotal = total - (total * voucher) / 100;
              if (allTotal > 0) {
                setAllTotal(handleCustomNumber(allTotal));
              } else {
                setAllTotal(handleCustomNumber(0));
              }
            }

            if (values.voucher === "15% giá trị đơn hàng") {
              allTotal = total - (total * voucher) / 100;
              if (allTotal > 0) {
                setAllTotal(handleCustomNumber(allTotal));
              } else {
                setAllTotal(handleCustomNumber(0));
              }
            }
          }

          // khi chỉ có VAT
          if (values.voucher === undefined && values.vat) {
            if (total !== 0) {
              allTotal = total + (total * vat) / 100;
              if (allTotal > 0) {
                setAllTotal(handleCustomNumber(allTotal));
              } else {
                setAllTotal(handleCustomNumber(0));
              }
            }
          }
        }
      }
    }
  };

  const onSubmit = async (values) => {
    const newValue = {
      ...values,
    };
    console.log(newValue);
    // gọi Api post user và truyền đi data
    await handleUpdateOrder(newValue, id);
    updateUser(newValue, id);
    setOrder(newValue);
    handleClose();
  };
  // bật tắt module
  const [open, setOpen] = useState(false);
  const handleOpen = (id) => {
    getOneOrder(id).then((item) => {
      setOrder(item);
    });

    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const arrVoucher = [
    {
      id: 1,
      lable: "100k",
    },
    {
      id: 2,
      lable: "5%",
    },
    {
      id: 3,
      lable: "15% giá trị đơn hàng",
    },
  ];

  return (
    <div className={cx("update_container")}>
      <Icon
        id={id}
        icon="pencil"
        onClick={() => handleOpen(id)}
        className={cx("update_icon")}
      />
      <Modal full show={open} sonHide={handleClose}>
        <Modal.Header onClick={() => handleClose()}>
          <Modal.Title>Sửa thông tin đơn hàng</Modal.Title>
        </Modal.Header>

        <Modal.Body className={cx("modal_body")}>
          <FieldForm
            onSubmit={onSubmit}
            initialValues={{
              idOrder: order.idOrder,
              vat: order.vat,
              voucher: order.voucher,
              userName: order.userName,
              phone: order.phone,
              addressOrder: order.addressOrder,
              total: order.total,
              orderItem: order.orderItem,
            }}
            mutators={{ ...arrayMutators }}
            render={({
              handleSubmit,
              values,
              submitting,
              pristine,
              form,
              form: {
                mutators: { push, pop },
              },
            }) => (
              <>
                {/* <pre>{JSON.stringify(values, 0, 2)}</pre> */}
                <RSForm
                  layout="inline"
                  className={cx("modal_input")}
                  onSubmit={handleSubmit}
                  id="form"
                >
                  <div>
                    <FormGroup style={{ width: 150 }}>
                      <div>
                        <Field
                          name="idOrder"
                          component={InputCustomField}
                          placeholder=""
                          validate={required}
                          disabled
                        />
                        <ControlLabel className={cx("input_lable_select")}>
                          Mã đơn hàng
                        </ControlLabel>
                      </div>
                    </FormGroup>
                    <FormGroup></FormGroup>
                  </div>
                  <div>
                    <FormGroup>
                      <div>
                        <Field
                          className={cx("input_content")}
                          name="userName"
                          component={InputPickerCustomField}
                          placeholder="Chọn"
                          inputValue={arrUser}
                          valueKey="lastName"
                          labelKey={"lastName"}
                          validate={required}
                          onSelect={(value) => {
                            console.log(value);
                            if (values.addressOrder) {
                              form.change("addressOrder", valueAddress);
                            }
                            if (values.phone) {
                              form.change("phone", phone);
                            }
                          }}
                          onChange={(value) => {
                            handleCheckValueUser(value);
                          }}
                        />
                        <ControlLabel className={cx("input_lable_select")}>
                          Tên khách hàng
                        </ControlLabel>
                      </div>
                    </FormGroup>

                    <FormGroup>
                      <div>
                        <Field
                          className={cx("input_content")}
                          name="phone"
                          component={InputCustomField}
                          placeholder=" "
                          initialValue={phone ? phone : order.phone}
                        />
                        <ControlLabel className={cx("input_lable_select")}>
                          SĐT
                        </ControlLabel>
                      </div>
                    </FormGroup>
                  </div>

                  {/* ========================================= */}

                  <div>
                    <FormGroup>
                      <div>
                        <Field
                          className={cx("input_content")}
                          name="addressOrder"
                          component={InputCustomField}
                          placeholder=" "
                          initialValue={
                            valueAddress ? valueAddress : order.addressOrder
                          }
                        />
                        <ControlLabel className={cx("input_lable_select")}>
                          Địa chỉ giao hàng
                        </ControlLabel>
                      </div>
                    </FormGroup>

                    <FormGroup>
                      <div>
                        <Field
                          className={cx("input_content")}
                          name="vat"
                          component={InputCustomField}
                          placeholder="Đơn vị %"
                          validate={handleCheckVat}
                        />
                        <ControlLabel className={cx("input_lable_select")}>
                          VAT
                        </ControlLabel>
                      </div>
                    </FormGroup>
                  </div>

                  {/* ============================================ */}

                  <div>
                    <FormGroup>
                      <div>
                        <Field
                          className={cx("input_content")}
                          name="voucher"
                          component={InputPickerCustomField}
                          inputValue={arrVoucher}
                          valueKey="lable"
                          labelKey={"lable"}
                          onChange={(value) => {}}
                        />
                        <ControlLabel className={cx("input_lable_select")}>
                          Voucher
                        </ControlLabel>
                      </div>
                    </FormGroup>

                    <FormGroup>
                      <div>
                        <Field
                          className={cx("input_content")}
                          name="total"
                          component={NumberCustomField}
                          disabled
                          initialValue={allTotal}
                        />
                        <ControlLabel className={cx("input_lable_select")}>
                          Tổng tiền đơn hàng
                        </ControlLabel>
                      </div>
                    </FormGroup>
                  </div>

                  {/* =========== */}

                  <div>
                    <div className={cx("list_order")}>
                      <h4>Danh sách đơn hàng</h4>
                      <Icon
                        icon="plus-square"
                        style={{
                          margin: "inherit",
                          fontSize: 18,
                          cursor: "pointer",
                        }}
                        onClick={() => push("orderItem", undefined)}
                      />
                      <Icon
                        icon="minus-square"
                        style={{
                          margin: "inherit",
                          fontSize: 18,
                          cursor: "pointer",
                        }}
                        onClick={() => pop("orderItem")}
                      />
                    </div>
                  </div>

                  <FieldArray name="orderItem">
                    {({ fields }) =>
                      fields.map((name, index) => (
                        <div
                          key={name}
                          style={{ display: "block", position: "relative" }}
                        >
                          <ControlLabel
                            style={{
                              marginLeft: 15,
                              fontSize: 14,
                              color: "green",
                            }}
                          >
                            Đơn: {index + 1}
                          </ControlLabel>
                          <div>
                            <FormGroup style={{ margin: 15 }}>
                              <div>
                                <Field
                                  className={cx("input_content")}
                                  name={`${name}.productName`}
                                  component={InputPickerCustomField}
                                  placeholder="Chọn"
                                  inputValue={arrProduct}
                                  valueKey="title"
                                  labelKey={"title"}
                                  validate={required}
                                  onSelect={(value) => {
                                    var data = getIdProduct(arrProduct, value);
                                    if (values.orderItem[index]) {
                                      if (values.orderItem[index].amount) {
                                        var newTotal =
                                          data.price *
                                          values.orderItem[index].amount;
                                        form.change(
                                          `${name}.unitPrice`,
                                          handleCustomNumber(data.price)
                                        );
                                        form.change(
                                          `${name}.total`,
                                          handleCustomNumber(newTotal)
                                        );
                                      }
                                    }
                                    form.change(
                                      `${name}.unitPrice`,
                                      handleCustomNumber(data.price)
                                    );
                                  }}
                                  onChange={(value) => {}}
                                />
                                <ControlLabel
                                  className={cx("input_lable_select")}
                                >
                                  Tên sản phẩm
                                </ControlLabel>
                              </div>
                            </FormGroup>

                            <FormGroup style={{ margin: 15 }}>
                              <div>
                                <Field
                                  className={cx("input_content")}
                                  name={`${name}.amount`}
                                  component={NumberCustomField}
                                  placeholder=" "
                                  validate={required}
                                  onChange={(value) => {
                                    if (value) {
                                      if (values.orderItem[index]) {
                                        let unitPrice =
                                          values.orderItem[index].unitPrice;
                                        unitPrice = Number(
                                          unitPrice
                                            .slice(0, unitPrice.length - 7)
                                            .split(".")
                                            .join("")
                                        );
                                        const total = unitPrice * value;
                                        form.change(
                                          `${name}.total`,
                                          handleCustomNumber(total)
                                        );
                                      }
                                    }
                                  }}
                                />
                                <ControlLabel
                                  className={cx("input_lable_select")}
                                >
                                  Số lượng
                                </ControlLabel>
                              </div>
                            </FormGroup>
                          </div>

                          {/* == */}

                          <div>
                            <FormGroup style={{ margin: 15 }}>
                              <div>
                                <Field
                                  name={`${name}.unitPrice`}
                                  component={NumberCustomField}
                                  placeholder=" "
                                  disabled
                                />
                                <ControlLabel
                                  className={cx("input_lable_select")}
                                >
                                  Đơn giá
                                </ControlLabel>
                              </div>
                            </FormGroup>

                            <FormGroup style={{ margin: 15 }}>
                              <div>
                                <Field
                                  className={cx("input_content")}
                                  name={`${name}.total`}
                                  // name="total"
                                  component={NumberCustomField}
                                  disabled
                                  // initialValue={total}
                                />
                                <ControlLabel
                                  className={cx("input_lable_select")}
                                >
                                  Thành tiền
                                </ControlLabel>
                              </div>
                            </FormGroup>
                          </div>

                          <Icon
                            icon="trash"
                            onClick={() => fields.remove(index)}
                            className={cx("list_order_icon")}
                          />
                        </div>
                      ))
                    }
                  </FieldArray>
                  {/* ========================================= */}

                  {handleAllTotal(values)}

                  <ButtonToolbar className={cx("form_footer")}>
                    <Button
                      type="submit"
                      disabled={submitting || pristine}
                      className="bg-blue text-white"
                      loading={submitting}
                      appearance="primary"
                    >
                      Lưu lại
                    </Button>
                    <Button
                      style={{ marginRight: 15 }}
                      onClick={handleClose}
                      loading={submitting}
                    >
                      Quay lại
                    </Button>
                  </ButtonToolbar>
                </RSForm>
              </>
            )}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default UpdateOrder;
