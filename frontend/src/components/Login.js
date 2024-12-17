import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { z } from 'zod';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { Post } from '../utils/Post';
import { url } from '../utils/constant';
import { useDispatch } from 'react-redux';
import { addUser } from '../utils/userSlice';
import { useNavigate } from 'react-router-dom';

const SignInSignUpForm = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [userType, setUserType] = useState('user');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // API Call for Sign Up
  const signup = async (url, values) => {
    const data = await Post(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    });

    if (!data) {
      throw new Error('Error in Signing up');
    }
    console.log(data);
    dispatch(addUser(data?.data?.user));
    navigate('/browse');
  };

  // API Call for Sign In
  const signin = async (url, values) => {
    const data = await Post(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    });

    if (!data) {
      throw new Error('Error in Signing in');
    }
    console.log(data);
    dispatch(addUser(data?.data?.user));
    navigate('/browse');
  };

  // Initial values for the form
  const initialValues = {
    Name: '',       // Fixed to match the name attribute
    username: '',
    email: '',
    password: '',
    isadmin: false,
  };

  // Validation schemas for Sign In and Sign Up
  const signUpSchema = z.object({
    Name: z.string().nonempty('Name is required'), // Fixed field name
    username: z.string().nonempty('Username is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    isadmin: z.boolean(),
  });

  const signInSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  });

  const validationSchema = isSignUp ? signUpSchema : signInSchema;

  // Handle form submission
  const handleSubmit = (values, { resetForm }) => {
    console.log(values);
    isSignUp
      ? signup(url + 'user/signup', values)
      : signin(url + 'user/signin', values);

    resetForm();
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold text-center mb-4">
        {isSignUp ? 'Sign Up' : 'Sign In'}
      </h2>
      <Formik
        initialValues={initialValues}
        validationSchema={toFormikValidationSchema(validationSchema)}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, setFieldValue }) => (
          <Form className="space-y-4">
            {isSignUp && (
              <>
                {/* User Type Dropdown */}
                <div>
                  <label
                    htmlFor="userType"
                    className="block text-sm font-medium text-gray-700"
                  >
                    User Type
                  </label>
                  <select
                    id="userType"
                    name="userType"
                    value={userType}
                    onChange={(e) => {
                      setUserType(e.target.value);
                      setFieldValue('isadmin', e.target.value === 'admin');
                    }}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                {/* Full Name Field */}
                <div>
                  <label
                    htmlFor="Name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Name
                  </label>
                  <Field
                    type="text"
                    name="Name" // Matches the key in initialValues
                    placeholder="Enter name"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  <ErrorMessage
                    name="Name"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* Username Field */}
                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Username
                  </label>
                  <Field
                    type="text"
                    name="username"
                    placeholder="Enter username"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  <ErrorMessage
                    name="username"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* Admin Checkbox */}
                {userType === 'admin' && (
                  <div className="flex items-center">
                    <Field
                      type="checkbox"
                      name="isadmin"
                      id="isadmin"
                      className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <label
                      htmlFor="isadmin"
                      className="ml-2 block text-sm text-gray-700"
                    >
                      Are you an admin?
                    </label>
                  </div>
                )}
              </>
            )}

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <Field
                type="email"
                name="email"
                placeholder="Enter email"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <Field
                type="password"
                name="password"
                placeholder="Enter password"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isSignUp ? 'Sign Up' : 'Sign In'}
            </button>
          </Form>
        )}
      </Formik>

      {/* Toggle Form Type */}
      <button
        className="w-full mt-4 text-indigo-600 hover:underline text-center"
        onClick={() => setIsSignUp((prev) => !prev)}
      >
        {isSignUp
          ? 'Already have an account? Sign In'
          : "Don't have an account? Sign Up"}
      </button>
    </div>
  );
};

export default SignInSignUpForm;
