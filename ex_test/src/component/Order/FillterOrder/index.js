/* eslint-disable eqeqeq */
import classNames from "classnames/bind";
import { useState } from "react";
import { Field, Form as FieldForm } from "react-final-form";
import {
  Button,
  ButtonToolbar,
  ControlLabel,
  Drawer,
  Form as RSForm,
  FormGroup,
} from "rsuite";
import PropTypes from "prop-types";

import { InputCustomField } from "../../../FinalFormComponents";
import styles from "./FillterOrder.module.scss";
const cx = classNames.bind(styles);

FillterOrder.propTypes = {
  data: PropTypes.array.isRequired,
  onGetdata: PropTypes.func.isRequired,
};
function FillterOrder(props) {
  const { data, onGetdata } = props;
  let arrData = [];

  // eslint-disable-next-line array-callback-return
  data.map((item) => {
    // eslint-disable-next-line array-callback-return
    if (item.orderItem) {
      item.orderItem.map((product) => {
        const newData = {
          ...item,
          product: product.productName,
        };
        arrData.push(newData);
      });
    }
  });

  const onSubmit = (values) => {
    // lọc userName
    if (values.userName && values.productName === undefined) {
      const arrayFilter = data.filter((value) => {
        return value.userName
          .toUpperCase()
          .includes(values.userName.toUpperCase());
      });

      if (arrayFilter.length !== 0) {
        onGetdata(arrayFilter);
      } else {
        alert("Không có đơn hàng phù hợp");
      }
    }

    // lọc productName
    if (values.productName && values.userName === undefined) {
      const arrayFilter = arrData.filter((value) => {
        return value.product
          .toUpperCase()
          .includes(values.productName.toUpperCase());
      });
      if (arrayFilter.length !== 0) {
        onGetdata(arrayFilter);
      } else {
        alert("Không có đơn hàng phù hợp");
      }
    }

    // lọc cả 2
    if (values.productName && values.userName) {
      const arrayFilter = arrData.filter((value) => {
        return (
          value.product
            .toUpperCase()
            .includes(values.productName.toUpperCase()) &&
          value.userName.toUpperCase().includes(values.userName.toUpperCase())
        );
      });
      if (arrayFilter.length !== 0) {
        onGetdata(arrayFilter);
      } else {
        alert("Không có đơn hàng phù hợp");
      }
    }
    handleClose()
  };

  // bật tắt modal
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className={cx("fillter_wrapper")}>
      <ButtonToolbar>
        <Button onClick={() => handleOpen()}>Bộ lọc</Button>
      </ButtonToolbar>

      <Drawer show={open} onHide={handleClose}>
        <Drawer.Header>
          <Drawer.Title>Lọc đơn hàng</Drawer.Title>
        </Drawer.Header>
        <Drawer.Body>
          <FieldForm
            onSubmit={onSubmit}
            initialValues={{}}
            render={({ handleSubmit, values, submitting, pristine, form }) => (
              <>
                <RSForm
                  layout="inline"
                  className={cx("modal_input")}
                  onSubmit={handleSubmit}
                  id="form"
                >
                  <div className={cx("input_wrapper")}>
                    <FormGroup>
                      <div>
                        <ControlLabel className={cx("input_lable_select")}>
                          Tên khách hàng
                        </ControlLabel>
                        <Field
                          className={cx("input_content")}
                          name="userName"
                          component={InputCustomField}
                          placeholder=" "
                        />
                      </div>
                    </FormGroup>
                  </div>

                  {/* ========================================= */}

                  <div className={cx("input_wrapper")}>
                    <FormGroup>
                      <div>
                        <ControlLabel className={cx("input_lable_select")}>
                          Tên sản phẩm
                        </ControlLabel>
                        <Field
                          className={cx("input_content")}
                          name="productName"
                          component={InputCustomField}
                          placeholder=" "
                        />
                      </div>
                    </FormGroup>
                  </div>

                  <ButtonToolbar className={cx("form_footer")}>
                    <Button
                      type="submit"
                      disabled={submitting || pristine}
                      className="bg-blue text-white"
                      loading={submitting}
                      appearance="primary"
                    >
                      Lọc
                    </Button>
                    <Button
                      onClick={() => window.location.reload()}
                      loading={submitting}
                    >
                      Thoát bộ lọc
                    </Button>
                  </ButtonToolbar>
                </RSForm>
              </>
            )}
          />
        </Drawer.Body>
      </Drawer>
    </div>
  );
}

export default FillterOrder;
