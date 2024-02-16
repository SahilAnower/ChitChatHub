import React from "react";

const GenderCheckBox = ({ selectedGender, onCheckBoxChange }) => {
  return (
    <div className="flex">
      <div className="form-control">
        <label
          className={`cursor-pointer label ${
            selectedGender === "Male" && "selected"
          }`}
        >
          <span className="label-text mx-2 text-yellow-700">Male</span>
          <input
            type="checkbox"
            checked={selectedGender === "Male"}
            className="checkbox checkbox-warning"
            onChange={() => onCheckBoxChange("Male")}
          />
        </label>
      </div>
      <div className="form-control">
        <label
          className={`cursor-pointer label ${
            selectedGender === "Female" && "selected"
          }`}
        >
          <span className="label-text mx-2 text-yellow-700">Female</span>
          <input
            type="checkbox"
            checked={selectedGender === "Female"}
            className="checkbox checkbox-warning"
            onChange={() => onCheckBoxChange("Female")}
          />
        </label>
      </div>
      <div></div>
    </div>
  );
};

export default GenderCheckBox;
