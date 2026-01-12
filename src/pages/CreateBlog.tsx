import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { addBlog } from "../features/blogsSlice";
import type { RootState } from "../store";

const CreateBlog = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const user = useSelector((state: RootState) => state.auth.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleCreate = async () => {
        if (!user) {
            return;
        }
        try {
            const { data, error } = await supabase
                .from('blogs')
                .insert([
                    { title, content, user_id: user.id }
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
                <button 
                    className="w-full bg-yellow-500 hover:bg-yellow-300 text-slate-800 font-semibold py-3 px-4 rounded"
                    onClick={handleCreate}
                >
                    Create
                </button>
            </div>
        </div>
    );
};

export default CreateBlog;