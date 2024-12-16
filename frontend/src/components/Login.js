import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";

const Login = () => {
  const [isSignin, setIsSignin] = useState(true);
  const [errormsg, setErrormsg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch=useDispatch();

  const SignupSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .regex(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/,
        "Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, and one digit"
      ),
  });

  const SigninSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .regex(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/,
        "Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, and one digit"
      ),
  });

  const toggleSignin = () => {
    setIsSignin(!isSignin);
    setErrormsg(null);
  };

  const schema = isSignin ? SigninSchema : SignupSchema;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <Formik
        initialValues={
          isSignin
            ? { email: "", password: "" }
            : { username: "", name: "", email: "", password: "" }
        }
        validationSchema={toFormikValidationSchema(schema)}
        onSubmit={async (values, { resetForm }) => {
          setIsLoading(true);
          try {
            const endpoint = isSignin
              ? "http://localhost:3000/api/v1/user/signin"
              : "http://localhost:3000/api/v1/user/signup";
            const response = await fetch(endpoint, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(values),
            });

            const data = await response.json();

            if (!response.ok) {
              throw new Error(data.message || "An error occurred");
            }

            // alert(isSignin ? "Login successful!" : "Signup successful!");
            console.log(data)
            if(isSignin){
              dispatch(addUser(data?.data?.user))
            }
            
            resetForm();
          } catch (error) {
            setErrormsg(error.message);
          } finally {
            setIsLoading(false);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form className="w-full max-w-md p-6 bg-gray-800 rounded-md shadow-md">
            <h1 className="text-2xl font-bold mb-4">
              {isSignin ? "Sign In" : "Sign Up"}
            </h1>
            {errormsg && (
              <p className="text-red-500 text-sm text-center mb-4">
                {errormsg}
              </p>
            )}
            {!isSignin && (
              <>
                <Field
                  type="text"
                  name="username"
                  placeholder="Username"
                  className="w-full p-2 mb-4 bg-gray-700 rounded-md"
                />
                <ErrorMessage
                  name="username"
                  component="p"
                  className="text-red-500 text-sm"
                />
                <Field
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  className="w-full p-2 mb-4 bg-gray-700 rounded-md"
                />
                <ErrorMessage
                  name="name"
                  component="p"
                  className="text-red-500 text-sm"
                />
              </>
            )}
            <Field
              type="email"
              name="email"
              placeholder="Email Address"
              className="w-full p-2 mb-4 bg-gray-700 rounded-md"
            />
            <ErrorMessage
              name="email"
              component="p"
              className="text-red-500 text-sm"
            />
            <Field
              type="password"
              name="password"
              placeholder="Password"
              className="w-full p-2 mb-4 bg-gray-700 rounded-md"
            />
            <ErrorMessage
              name="password"
              component="p"
              className="text-red-500 text-sm"
            />
            <button
              type="submit"
              className={`w-full p-2 rounded-md ${
                isSubmitting || isLoading
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
              disabled={isSubmitting || isLoading}
            >
              {isSubmitting || isLoading
                ? "Submitting..."
                : isSignin
                ? "Sign In"
                : "Sign Up"}
            </button>
            <p
              onClick={toggleSignin}
              className="mt-4 text-sm text-center cursor-pointer hover:underline"
            >
              {isSignin
                ? "New here? Create an account"
                : "Already have an account? Sign In"}
            </p>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Login;
