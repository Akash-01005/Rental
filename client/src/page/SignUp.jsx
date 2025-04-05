import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store";
import { FaSpinner } from "react-icons/fa";

const SignUp = () => {
  const [formData, setFormData] = useState({ userName: "", email: "", password: ""});
  const [show, setShow] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const { signup, loading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // if (formData.password !== formData.confirmPassword) {
    //   alert("Passwords do not match");
    //   return;
    // }
    await signup(formData);
    navigate("/");
  };
  console.log(formData)

  return (
    <div className="h-screen flex justify-center items-center">
      <form onSubmit={handleSubmit} className="shadow-lg h-fit p-3 w-[300px] rounded-lg">
        <h1 className="font-semibold text-center text-3xl">Sign Up</h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <div className="flex flex-col">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
            className="border rounded-md p-1 focus:outline-none"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="border rounded-md p-1 focus:outline-none"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="password">Password</label>
          <div className="flex">
            <input
              type={show ? "text" : "password"}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="border w-4/5 rounded-md p-1 focus:outline-none"
            />
            <span
              className={`${
                show ? "bg-red-400 hover:bg-red-600" : "bg-green-400 hover:bg-green-600"
              } cursor-pointer transition w-1/5 ml-3 p-1 text-center rounded-md text-white`}
              onClick={() => setShow((prev) => !prev)}
            >
              {show ? "Hide" : "Show"}
            </span>
          </div>
        </div>
        
        <button
          type="submit"
          disabled={loading || !acceptTerms}
          className={`btn p-1 text-white mt-3 transition-all rounded w-full flex items-center justify-center ${acceptTerms ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"}`}
        >
          {loading ? (
            <>
              <FaSpinner className="animate-spin mr-2" />
              <span>Loading...</span>
            </>
          ) : (
            "Sign Up"
          )}
        </button>
        <div className="flex items-center justify-center mt-2">
          <input type="checkbox" checked={acceptTerms} htmlFor="check" onChange={(e) => setAcceptTerms(e.target.checked)} className="mr-2 mt-1"/>
          <label id="check">I, accept the terms and conditions.</label>
        </div>
        <p className="text-center mt-1">
          Already have an account? <span className="text-blue-600 underline cursor-pointer" onClick={() => navigate("/login")}>Login.</span>
        </p>
      </form>
    </div>
  );
};

export default SignUp;
