import PropTypes from "prop-types";
import { Checkbox, CheckboxGroup } from "rsuite";
import CustomField from "../CustomField";
// ====================================================
CheckboxCustomField.propTypes = {
  inputvalue: PropTypes.array,
};
// ====================================================
function CheckboxCustomField(props) {
  const { inputvalue, labelclassname, ...rest } = props;
  return (
    <CustomField {...props} accepter={CheckboxGroup} {...rest}>
      {inputvalue.map((e, i) => (
        <Checkbox key={i} className={labelclassname}>
          {e.label}
        </Checkbox>
      ))}
    </CustomField>
  );
}

export default CheckboxCustomField;
