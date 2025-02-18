import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store";
import { FaSpinner } from "react-icons/fa";

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [show, setShow] = useState(false);
  const { login, loading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(formData);
    navigate("/");
  };

  return (
    <div className="h-screen flex justify-center items-center">
      <form onSubmit={handleSubmit} className="shadow-lg h-fit p-3 w-[300px] rounded-lg">
        <h1 className="font-semibold text-center text-3xl">Login</h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <div className="flex flex-col">
          <label htmlFor="email">Email</label>
          <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="border rounded-md p-1 focus:outline-none"/>
        </div>
        <div className="flex flex-col">
          <label htmlFor="password">Password</label>
          <div className="flex">
            <input type={show ? "text" : "password"} value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="border w-4/5 rounded-md p-1 focus:outline-none"/>
            <span className={`${show ? "bg-red-400 hover:bg-red-600" : "bg-green-400 hover:bg-green-600"} cursor-pointer transition w-1/5 ml-3 p-1 text-center rounded-md text-white`} onClick={() => setShow((prev) => !prev)}>
              {show ? "Hide" : "Show"}
            </span>
          </div>
        </div>
        <button type="submit" disabled={loading} className="btn bg-blue-600 p-1 text-white mt-3 transition-all rounded w-full hover:bg-blue-700 flex items-center justify-center">
          {loading ? (
            <>
              <FaSpinner className="animate-spin mr-2" />
              <span>Loading...</span>
            </>
          ) : (
            "Login"
          )}
        </button>
        <p className="text-center underline text-blue-600 mt-1 cursor-pointer">Forgot Password?</p>
        <p className="text-center mt-1">{"Don't"} have an account? <span className="text-blue-600 underline cursor-pointer">Sign up.</span></p>
      </form>
    </div>
  );
};

export default LoginPage;
