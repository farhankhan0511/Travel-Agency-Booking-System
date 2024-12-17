import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { cloudinaryurl, url } from '../utils/constant'
import { useNavigate } from 'react-router-dom'
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { Post } from '../utils/Post';
import InvoiceGenerator from './Invoicegenerator';
import jsPDF from 'jspdf';

const Tourbook = () => {
    const navigate=useNavigate()
    const user=useSelector((store)=>store?.user)
    const accesstoken=useSelector((store)=>store?.accesstoken)
    console.log(accesstoken)
    useEffect(()=>{
        
        if(!user){
            navigate("/browse")
        }
    })
    const tourinfo=useSelector((store)=>store?.tobook)
    console.log(tourinfo)

    const TravellersFormSchema = z.object({
        NumberofTravellers: z
          .number()
          .min(1, "At least 1 traveller is required")
          .max(10, "You cannot have more than 10 travellers"),
        specialrequest: z
          .string()
          .min(10, "Special request must be at least 10 characters long")
          .optional(),
        Customerdetails: z
          .array(
            z.object({
              name: z.string().min(2, "Name must have at least 2 characters"),
              age: z
                .number()
                .min(1, "Age must be greater than 0")
                .max(120, "Age must be realistic"),
              gender: z.enum(["Male", "Female", "Other"]),
              phone: z
                .string()
                .regex(/^[0-9]{10}$/, "Phone number must be exactly 10 digits"),
            })
          )
          .nonempty("At least one customer detail is required"),
      });
      
      const initialValues = {
        NumberofTravellers: 1,
        specialrequest: "",
        Customerdetails: [
          { name: "", age: "", gender: "", phone: "" },
        ],
      };
    

      const handleSubmit = async(values) => {
        console.log(values)
           try {
             const data=await Post(`${url}booking/book/${tourinfo._id}`,{
                 method: 'POST',
                 credentials:"include",
                 headers: {
                   'Content-Type': 'application/json',
                   'Authorization': "Bearer "+`${accesstoken}`
                 },
                 body: JSON.stringify(values),
               });
               console.log(data)
               
             if(!data){
                 throw new Error("Error while booking!!!");
                 }
             // navigate("/browse")
             
             alert("Booking Successfull")
            //  {<InvoiceGenerator bookingData={data?.data} />}
            generateInvoicePDF(data?.data)
           } catch (error) {
            console.log(error.message)
            alert("Booking failed")
           }
      };

      const generateInvoicePDF = (data) => {
        const { BookedBy, Customerdetails, Tourpackage, specialrequest, message } = data;
    
        const doc = new jsPDF();
    
        // Add title
        doc.setFontSize(22);
        doc.text('Booking Invoice', 20, 20);
    
        // Booking details
        doc.setFontSize(14);
        doc.text(`Booking Message: ${message}`, 20, 40);
        doc.text(`Booked By: ${BookedBy.Name}`, 20, 50);
        doc.text(`Email: ${BookedBy.email}`, 20, 60);
        doc.text(`Username: ${BookedBy.username}`, 20, 70);
        doc.text(`Booking Date: ${new Date(BookedBy.createdAt).toLocaleDateString()}`, 20, 80);
        doc.text(`Tour Package: ${Tourpackage.Title}`, 20, 130 + (Customerdetails.length * 10));
        doc.text(`Description: ${Tourpackage.Description}`, 20, 140 + (Customerdetails.length * 10));
        doc.text(`Price: $${Tourpackage.Price}`, 20, 150 + (Customerdetails.length * 10));
        doc.text(`Special Request: ${specialrequest}`, 20, 160 + (Customerdetails.length * 10));
      
    
        // Customer details
        doc.text('Customer Details:', 20, 100);
        Customerdetails.push([])
        Customerdetails.forEach((customer, index) => {
          doc.text(
            `Customer ${index + 1}: ${customer[0].name}, Age: ${customer[0].age}, Gender: ${customer[0].gender}, Phone: ${customer[0].phone}`,
            20,
            110 + (index * 10)
          );
          doc.save(`${Tourpackage.Title}_Invoice.pdf`);
        });}
    

  return (
    <div>
        

<div className="flex  w-3/4  text-white mx-auto mt-5">
        <div className='w-1/2'>
        <img className=" w-[80%] aspect-auto" src={cloudinaryurl+tourinfo?.Image}  alt={tourinfo?.Title}/>
        </div>
        <div className='w-1/2 mt-8'>

        <h1 className="font-bold text-2xl m-2">{tourinfo?.Title}</h1>
        <h3 className='text-wrap font-semibold m-2'>Description: { tourinfo?.Description}</h3>
        <h3 className=' font-semibold m-2'>Availability: {tourinfo?.Availability}</h3>
        <h3 className='font-semibold m-2' >Price: {tourinfo?.Price}</h3>

        </div>
        
        
        
    
        
        </div>



<div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-2xl font-bold mb-4 ">Travellers Information</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={toFormikValidationSchema(TravellersFormSchema)}
        onSubmit={handleSubmit}
      >
        {({ values }) => (
          <Form className="w-full max-w-2xl p-6 bg-gray-800 rounded-md shadow-md">
            {/* Number of Travellers */}
            <div className="mb-4">
              <label className="block mb-2">Number of Travellers</label>
              <Field
                type="number"
                name="NumberofTravellers"
                min="1"
                max="10"
                className="w-full p-2 bg-gray-700 rounded-md"
              />
              <ErrorMessage
                name="NumberofTravellers"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            {/* Special Request */}
            <div className="mb-4">
              <label className="block mb-2">Special Request</label>
              <Field
                as="textarea"
                name="specialrequest"
                placeholder="Enter any special request..."
                className="w-full p-2 bg-gray-700 rounded-md"
              />
              <ErrorMessage
                name="specialrequest"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            {/* Customer Details */}
            <FieldArray name="Customerdetails">
              {({ push, remove }) => (
                <div>
                  <h2 className="text-lg font-bold mb-2">Customer Details</h2>
                  {values.Customerdetails.map((_, index) => (
                    <div
                      key={index}
                      className="p-4 mb-4 bg-gray-700 rounded-md shadow-md"
                    >
                      {/* Name */}
                      <div className="mb-2">
                        <label>Name</label>
                        <Field
                          name={`Customerdetails.${index}.name`}
                          placeholder="Enter Name"
                          className="w-full p-2 bg-gray-800 rounded-md"
                        />
                        <ErrorMessage
                          name={`Customerdetails.${index}.name`}
                          component="div"
                          className="text-red-500 text-sm"
                        />
                      </div>

                      {/* Age */}
                      <div className="mb-2">
                        <label>Age</label>
                        <Field
                          name={`Customerdetails.${index}.age`}
                          type="number"
                          placeholder="Enter Age"
                          className="w-full p-2 bg-gray-800 rounded-md"
                        />
                        <ErrorMessage
                          name={`Customerdetails.${index}.age`}
                          component="div"
                          className="text-red-500 text-sm"
                        />
                      </div>

                      {/* Gender */}
                      <div className="mb-2">
                        <label>Gender</label>
                        <Field
                          as="select"
                          name={`Customerdetails.${index}.gender`}
                          className="w-full p-2 bg-gray-800 rounded-md"
                        >
                          <option value="" label="Select Gender" />
                          <option value="Male" label="Male" />
                          <option value="Female" label="Female" />
                          <option value="Other" label="Other" />
                        </Field>
                        <ErrorMessage
                          name={`Customerdetails.${index}.gender`}
                          component="div"
                          className="text-red-500 text-sm"
                        />
                      </div>

                      {/* Phone */}
                      <div className="mb-2">
                        <label>Phone</label>
                        <Field
                          name={`Customerdetails.${index}.phone`}
                          placeholder="Enter 10-digit Phone Number"
                          className="w-full p-2 bg-gray-800 rounded-md"
                        />
                        <ErrorMessage
                          name={`Customerdetails.${index}.phone`}
                          component="div"
                          className="text-red-500 text-sm"
                        />
                      </div>

                      {/* Remove Customer */}
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove Customer
                      </button>
                    </div>
                  ))}

                  {/* Add Customer */}
                  <button
                    type="button"
                    onClick={() =>
                      push({ name: "", age: "", gender: "", phone: "" })
                    }
                    className="p-2 bg-blue-600 hover:bg-blue-700 rounded-md"
                  >
                    Add Customer
                  </button>
                </div>
              )}
            </FieldArray>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full mt-4 p-2 bg-green-600 hover:bg-green-700 rounded-md"
            >
              Submit
            </button>
          </Form>
        )}
      </Formik>
    </div>
    </div>
    

        
  )
}

export default Tourbook



