import React, { useState } from "react";
import { AutoComplete } from "primereact/autocomplete";

let x = 0;
export default function AutoCompleteFiled({
  placeHolder,
  dataFunction,
  setSelectedProduct,
  name,
  id,
  className,
  label,
}) {
  const [value, setValue] = useState("");
  const [items, setItems] = useState([]);

  const search = async (currentValue) => {
    console.log("search");
    x++;
    const y = x;

    setTimeout(async () => {
      if (x === y) {
        const searchData = await dataFunction(currentValue);
        const productNameArray = searchData.data.map((item) => item.name);
        setItems(productNameArray);
        if (productNameArray.includes(currentValue)) {
          const index = productNameArray.indexOf(currentValue);
          setSelectedProduct(searchData.data[index].id);
        } else {
          setSelectedProduct("");
        }
      }
    }, 1000);
  };

  return (
    // <div className="card flex justify-content-center">
    <div className="inputContainerWithIcon">
      <span className={className}>
        <AutoComplete
          placeholder={placeHolder}
          value={value}
          style={{ width: "100%" }}
          name={name}
          id={id}
          suggestions={items}
          completeMethod={(e) => search(e.query)}
          onChange={(e) => {
            setValue(e.target.value);
            search(e.target.value);
          }}
        />

        {label ? (
          <label htmlFor="product">
            Product:<span style={{ color: "red" }}>*</span>
          </label>
        ) : null}
      </span>
    </div>
  );
}
