import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import Loader from "../WebsiiteLoader/Index";

const AddCategory = ({ closeModal, refreshdata }) => {

    const [formData, setFormData] = useState({
        category: '',
        file: '',
        video: [],
    });
    const token = JSON.parse(sessionStorage.getItem("sessionToken"))
    const [image, setImage] = useState("")
    const [video, setVideo] = useState("")
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [imageDisable, setImageDisable] = useState(false)
    const [videoDisable, setVideoDisable] = useState(false)
    const [imageUpload, setImageUpload] = useState(false)
    const [videoUploading, setVideoUploading] = useState(false);

    console.log(imageUpload)
    console.log(videoUploading)

    const InputHandler = (e) => {
        if (e.target.name === "file") {
            setImage({ file: e.target.files[0] })
        } else if (e.target.name === "video") {
            setVideo({ file: e.target.files[0] })

        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value })
        }
    }

    const uploadImage = async (e) => {
        // alert("ssas")
        // toast.warn("Please select image.")
        // console.log(image);
        setImageUpload(true)

        if (image == "" || image == undefined) {

            setImageUpload(false)
            return toast.warn("Please select file.")
        }

        try {

            const response = await axios.post('api/auth/uploadImage', image, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                // console.log('Category added:', response?.data);
                setFormData({ ...formData, ['file']: response?.data?.url })
                setImageDisable(true)
                setImageUpload(false)
            }
            else {
                setFormData({ ...formData, ['file']: "" })
                setImageDisable(false)
                setImageUpload(false)

            }
        } catch (error) {
            console.error('Error adding category:', error.response.data);
            setImageUpload(false)

        }
    }
    const uploadVideo = async (e) => {
        // console.log(video);
        setVideoUploading(true);
        try {
            if (!video) {
                setVideoUploading(false);
                return toast.warn("Please select a file.");
            }

            const response = await axios.post('api/auth/uploadImage', video, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (response.status === 200) {
                // console.log('Video uploaded:', response?.data);
                const videoUrl = response?.data?.url;
                // formData.video.push(response?.data?.url)        
                setFormData({ ...formData, video: [...formData.video, videoUrl] });
                setVideoDisable(true);
                setVideoUploading(false);
            } else {
                // setFormData({ ...formData, video: "" });
                setVideoDisable(false);
                setVideoUploading(false);
            }
        } catch (error) {
            console.error('Error uploading video:', error.response?.data || error.message);
            // Handle the error: show a message or perform an action accordingly
            setVideoUploading(false);
        }
    };
    const addField = (e) => {
        setVideoDisable(false)
        setVideo("")
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.file == "" || formData.video.length < 1) {
            toast.error("Please fill all fields")
        }
        else {
            setLoading(true)
            try {
                const response = await axios.post('/api/auth/addCategory', formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (response.status === 200) {
                    // console.log('Login successful');
                    toast.success("Category created successfully.")
                    setLoading(false)
                    refreshdata()
                    closeModal()
                } else {
                    // console.log(response);
                    setError('Invalid details');
                    toast.error(response)
                    setLoading(false)
                }
            } catch (error) {
                console.error('Error during category:', error);
                setError("Login failed please try again!")
                toast.error("Something went wrong, try again later.")
                setLoading(false)
            }
        }
    };


    const hideModal = () => {
        closeModal(false)
    }

    return (
        <>
        {(imageUpload || videoUploading) && <Loader /> }
            <div className="">
                <form action="" className="" onSubmit={handleSubmit}>
                    <div className="flex flex-col justify-center px-4 lg:px-8 py-4">

                        <div className="py-3 ">
                            <span className="login-input-label">Category</span>
                            <input
                                type="text"
                                name="category"
                                pattern="^(?!\s)[a-zA-Z ]{1,}$"
                                placeholder="Enter category name"
                                className="login-input w-full mt-2 capitalize "
                                onChange={InputHandler}
                                maxLength={64}
                                required />
                        </div>
                        <div className="py-2 flex items-end gap-x-10">
                            <div className="w-[50%]">
                                <span className="login-input-label cursor-pointer mb-2">Image</span>
                                <div className="flex items-center w-full">
                                    <input
                                        id="file"
                                        type="file"
                                        name="file"
                                        disabled={imageDisable}
                                        onChange={InputHandler}
                                        className="w-full bg-cyan-500 hover:bg-cyan-600 "
                                        accept="image/png,image/jpg, image/jpeg , image/*"
                                    />
                                </div>
                            </div>
                            <div className="">
                                <button
                                 className={`focus-visible:outline-none  text-white text-[13px] px-4 py-1 rounded
                                ${imageDisable ? "bg-[green]" : "bg-[#070708bd]"}`} type="button"
                                    onClick={uploadImage} disabled={imageDisable || imageUpload}>
                                    {imageDisable ? "Uploaded" : imageUpload ? "Loading.." : "Upload"}
                                </button>
                            </div>
                        </div>
                        <div className="py-2 mt-1 flex  items-end gap-x-10">
                            <div className="w-[50%]">
                                <span className="login-input-label cursor-pointer mb-1">Video</span>
                                <div className="flex items-center  w-full">
                                    <input
                                        id="video"
                                        type="file"
                                        name="video"
                                        className="w-full"
                                        onChange={InputHandler}
                                        disabled={videoDisable}
                                        accept="video/mp4,video/x-m4v,video/*"
                                    />
                                </div>
                            </div>
                            <div className="">
                                {
                                    videoDisable ?
                                        <button className="p-2 border h-[20px] flex justify-center items-center" type="button" 
                                        onClick={addField}>+</button> :
                                        <button 
                                        className={`focus-visible:outline-none  text-white text-[13px] px-4 py-1 rounded
                                        ${videoDisable ? "bg-[green]" : "bg-[#070708bd]"}`}
                                            type="button" onClick={uploadVideo}
                                            disabled={videoDisable || videoUploading}>
                                            {videoDisable
                    ? "Uploaded"
                    : videoUploading
                    ? "Loading.."
                    : "Upload"} </button>
                                }
                            </div>
                        </div>
                        <div className="mt-4 flex pt-6 items-center justify-center md:justify-end  md:flex-nowrap gap-y-3 gap-x-3 ">
                            <button
                                type="button"
                                className="rounded-[6px] py-1 px-4 max-w-[300px] w-full lg:w-[50%] border border-[gray] bg-white text-black"
                                onClick={hideModal}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="custom-button rounded-[6px] py-1 px-4 max-w-[300px] w-full lg:w-[50%] border bg-[#1f2432] text-white"
                            >
                                {isLoading ? "Loading.." : "Add"}
                            </button>
                        </div>


                    </div>
                </form>
            </div>

        </>
    )
};

export default AddCategory;
