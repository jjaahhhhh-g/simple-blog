import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { addBlog } from "../features/blogsSlice";
import type { RootState } from "../store";

const CreateBlog = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const user = useSelector((state: RootState) => state.auth.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const uploadImage = async (file: File) => { 
        setUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}/${Math.random()}.${fileExt}`;
            
            const { error } = await supabase.storage
                .from('images-blog')
                .upload(fileName, file);

            if (error) {
                console.log("Error uploading image:", error);
                return null;
            }

            const { data } = supabase.storage
                .from('images-blog')
                .getPublicUrl(fileName);

            return data.publicUrl;
            
        } catch (error) {
            console.error("Upload error:", error);
            return null;
        } finally {
            setUploading(false);
        }
    }

    const handleCreate = async () => {
        if (!user) {
            return;
        }

        let imageUrl = null;

        if (image) {
            imageUrl = await uploadImage(image);
            if (!imageUrl) {
                return;
            }
        }

        try {
            const { data, error } = await supabase
                .from('blogs')
                .insert([
                    { title, content, user_id: user.id, image_url: imageUrl }
                ])
                .select();
            if (error) {
                console.log("Error creating blog:", error);
                return;
            }
            dispatch(addBlog(data[0]));
            navigate("/");
        } catch (error) {
            console.error("Create blog error:", error);
            setTitle("");
            setContent("");
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 p-6">
            <div className="max-w-3xl mx-auto bg-slate-800 p-8 rounded-lg shadow-lg">
                <button 
                        onClick={() => navigate("/")} 
                        className="text-slate-400 hover:text-yellow-500 font-medium md:text-right mb-4 underline"
                    >
                        Back to Feed
                    </button>
                <h2 className="text-3xl font-bold mb-6 text-center text-blue-300">Write Blog</h2>
                <input 
                    className="w-full bg-slate-700 text-white text-2xl border border-slate-500 rounded p-3 mb-4 focus:outline-none focus:border-yellow-500"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter Blog Title"
                />
                <textarea 
                    className="w-full bg-slate-700 text-white border border-slate-500 rounded p-3 mb-6 h-40 resize-none focus:outline-none focus:border-yellow-500"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write content here..."
                />
                <input 
                    type="file"
                    accept="image/*"
                    onChange={ (e) => setImage(e.target.files ? e.target.files[0] : null) }
                    className="w-full text-center text-yellow-300 border-2 border-dashed border-slate-500 p-4 mb-6 rounded-lg cursor-pointer"
                />
                <button 
                    className="w-full bg-yellow-500 hover:bg-yellow-300 text-slate-800 font-semibold py-3 px-4 rounded cursor-pointer disabled:opacity-50"
                    onClick={handleCreate}
                    disabled={uploading}
                >
                    {uploading ? "Uploading..." : "Create Blog"}
                </button>
            </div>
        </div>
    );
};

export default CreateBlog;