import React from "react";
import { useState } from "react";
import { redirect, useNavigate } from "react-router-dom";
export default function Review() {
  const [form, setForm] = useState({ description: "", score: "" });
  const navigate = useNavigate();

  const onChangeHandler = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    navigate("/");
    //fetch send data
    //values from form.description, form.score
    //https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
  };
  console.log(form);
  return (
    <div>
      <h1>add Review</h1>

      <form onSubmit={onSubmitHandler}>
        <label htmlFor="">description</label>
        <input type="text" name="description" onChange={onChangeHandler} />
        <label htmlFor="">score</label>
        <input type="text" name="score" onChange={onChangeHandler} />
        <input type="submit" />
      </form>
    </div>
  );
}
