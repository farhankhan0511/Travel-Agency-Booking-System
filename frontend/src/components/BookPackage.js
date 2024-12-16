import React from "react";
import { useFormik } from "formik";

const BookingForm = () => {
  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      price: "",
      availability: "",
    },
    validate: (values) => {
      const errors = {};
      if (!values.title) {
        errors.title = "Title is required";
      }
      if (!values.price) {
        errors.price = "Price is required";
      } else if (values.price <= 0) {
        errors.price = "Price must be greater than 0";
      }
      if (!values.availability) {
        errors.availability = "Availability is required";
      } else if (values.availability < 1) {
        errors.availability = "Availability must be at least 1";
      }
      return errors;
    },
    onSubmit: async (values) => {
      console.log("Submitting values:", values);
      try {
        const response = await fetch("/api/v1/bookings", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          throw new Error("Failed to submit form");
        }

        const data = await response.json();
        alert("Booking created successfully!");
        console.log("Server response:", data);
      } catch (error) {
        console.error("Error submitting form:", error);
        alert("Error: Could not create booking.");
      }
    },
  });

  return (
    <div className="max-w-md mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Create Booking</h1>
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Title</label>
          <input
            type="text"
            name="title"
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full p-2 border rounded border-gray-300"
          />
          {formik.touched.title && formik.errors.title && (
            <div className="text-red-600 text-sm">{formik.errors.title}</div>
          )}
        </div>

        <div>
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            name="description"
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full p-2 border rounded border-gray-300"
          ></textarea>
        </div>

        <div>
          <label className="block mb-1 font-medium">Price</label>
          <input
            type="number"
            name="price"
            value={formik.values.price}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full p-2 border rounded border-gray-300"
          />
          {formik.touched.price && formik.errors.price && (
            <div className="text-red-600 text-sm">{formik.errors.price}</div>
          )}
        </div>

        <div>
          <label className="block mb-1 font-medium">Availability</label>
          <input
            type="number"
            name="availability"
            value={formik.values.availability}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full p-2 border rounded border-gray-300"
          />
          {formik.touched.availability && formik.errors.availability && (
            <div className="text-red-600 text-sm">{formik.errors.availability}</div>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default BookingForm;
