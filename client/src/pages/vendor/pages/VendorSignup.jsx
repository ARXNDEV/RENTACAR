import { Link, useNavigate } from "react-router-dom";
import styles from "../../../index";
import { useState } from "react";
import OAuth from "../../../components/OAuth";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

const schema = z.object({
  username: z.string().min(3, { message: "minimum 3 characters required" }),
  email: z
    .string()
    .min(1, { message: "email required" })
    .refine((value) => /\S+@\S+\.\S+/.test(value), {
      message: "Invalid email address",
    }),
  password: z.string().min(4, { message: "minimum 4 characters required" }),
});

function VendorSignup() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const [isLoading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  const onSubmit = async (formData, e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch("/api/vendor/vendorsignup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setLoading(false);
      
      if (res.ok === false || data.success === false) {
        const errorMsg = data.message || "Something went wrong. Please try again.";
        setErrorMessage(errorMsg);
        toast.error(errorMsg);
        return;
      }
      toast.success("Vendor account created successfully! Please sign in.");
      navigate("/vendorSignin");
    } catch (error) {
      setLoading(false);
      setErrorMessage("Network error. Please check your connection.");
      toast.error("Network error. Please check your connection.");
    }
  };

  return (
    <>
      <div
        className={`pb-10 max-w-lg mx-auto mt-16   rounded-lg overflow-hidden  shadow-2xl`}
      >
        <div
          className={`  bg-slate-950 px-6 py-2   rounded-t-lg flex justify-between items-center`}
        >
          <h1 className={`${styles.heading2} text-[28px] text-white`}>
            Sign Up <span className="text-[6px] text-white">as vendor</span>
          </h1>
          <Link to={"/"}>
            <div className=" px-3  font-bold  hover:bg-slate-700 rounded-md  shadow-inner text-white">
              x
            </div>
          </Link>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-5 pt-10 px-5"
        >
          <div>
            <input
              type="text"
              id="username"
              className="text-black bg-slate-100 p-3 rounded-md w-full"
              placeholder="UserName"
              {...register("username")}
            />
            {errors.username && (
              <p className="text-red-500 text-[10px]">
                {errors.username.message}
              </p>
            )}
          </div>

          <div>
            <input
              type="text"
              id="email"
              className="text-black bg-slate-100 p-3 rounded-md w-full"
              placeholder="Email"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-500 text-[10px]">{errors.email.message}</p>
            )}
          </div>

          <div>
            <input
              type="text"
              id="password"
              className="text-black bg-slate-100 p-3 rounded-md w-full"
              placeholder="Password"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-red-500 text-[10px]">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            className={`${styles.button} bg-slate-950 text-white  disabled:bg-slate-500 disabled:text-white`}
            disabled={isLoading}
          >
            {isLoading ? "Loading ..." : "Register"}
          </button>
          <div className="flex justify-between">
            <p className="text-[10px]">
              Have a account?{" "}
              <span className="text-blue-600">
                {" "}
                <Link to={`/vendorsignin`}>Sign in</Link>
              </span>
            </p>
            <p className="text-[10px] text-red-600">
              {errorMessage && errorMessage}
            </p>
          </div>
        </form>
        <div>
          <h3 className="text-center text-slate-700 pt-3 pb-3 text-[10px]">
            OR
          </h3>
          <div className="flex justify-center items-center gap-3 pb-6">
            <span className="bg-green-300 w-20 h-[.1px]"></span>
            <span className="text-[10px] sm:text-[12px] text-slate-500">
              Continue with social login
            </span>
            <span className="bg-green-300 w-20 h-[.1px]"> </span>
          </div>

          <div className="px-5">
            <OAuth role="vendor" />
          </div>

        </div>
      </div>
    </>
  );
}

export default VendorSignup;
