import { useState } from "react";
import Modal from "../../components/CustomModal";
import { LuUserCog, LuSave, LuX } from "react-icons/lu";
import TextField from "@mui/material/TextField";
import { useDispatch, useSelector } from "react-redux";
import { editUserProfile, setUpdated } from "../../redux/user/userSlice";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";

const ProfileEdit = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { username, email, phoneNumber, adress, _id } = useSelector(
    (state) => state.user.currentUser
  );

  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();

  const editProfileData = async (data, id) => {
    try {
      if (data) {
        const formData = data;
        dispatch(editUserProfile({ ...formData }));
        await fetch(`/api/user/editUserProfile/${id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ formData }),
        });
        dispatch(setUpdated(true));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        type="button" 
        className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-5 py-2.5 rounded-2xl flex items-center gap-2 text-sm font-bold shadow-xl hover:bg-white/20 transition-all"
        onClick={() => setIsModalOpen(true)}
      >
        <LuUserCog size={18} />
        Edit Profile
      </motion.button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="bg-white mt-10 rounded-[2.5rem] max-w-[600px] min-w-[360px] overflow-hidden"
      >
        <form onSubmit={handleSubmit((data) => {
          editProfileData(data, _id);
          setIsModalOpen(false);
        })}>
          <div className="p-8 md:p-10">
            <div className="mb-10">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Account Settings</h2>
              <p className="text-slate-500 text-sm mt-1">Update your personal information and contact details.</p>
            </div>

            <div className="flex flex-col gap-8 my-8">
              <TextField
                fullWidth
                id="username"
                label="Full Name"
                variant="outlined"
                {...register("username")}
                defaultValue={username}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '1rem' } }}
              />

              <TextField
                fullWidth
                id="email"
                label="Email Address"
                variant="outlined"
                defaultValue={email}
                {...register("email")}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '1rem' } }}
              />

              <TextField
                fullWidth
                id="phoneNumber"
                label="Phone Number"
                type="text"
                variant="outlined"
                defaultValue={phoneNumber}
                {...register("phoneNumber")}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '1rem' } }}
              />

              <TextField
                fullWidth
                id="adress"
                label="Residential Address"
                multiline
                rows={3}
                defaultValue={adress}
                {...register("adress")}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '1.25rem' } }}
              />
            </div>

            <div className="flex justify-end items-center gap-4 pt-4">
              <button
                type="button"
                className="px-6 py-3 text-slate-400 hover:text-slate-600 font-bold transition-colors text-sm"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-600 text-white font-bold px-10 py-3.5 rounded-2xl shadow-xl shadow-green-100 transition-all flex items-center gap-2 text-sm"
              >
                <LuSave size={18} />
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default ProfileEdit;
