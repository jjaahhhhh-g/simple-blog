import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { updateBlog } from "../features/blogsSlice";
import type { RootState } from "../store";

const UpdateBlog = () => {
    const { id } = useParams<{ id: string }>();
    const blogs = useSelector((state: RootState) => state.blogs.blogs);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const blog = blogs.find((b) => b.id === id);
        if (blog) {
            setTitle(blog.title);
            setContent(blog.content);
        }
    }, [id, blogs]);

    const handleUpdate = async () => {
        try {
            const {error} = await supabase
                .from('blogs')
                .update({ title, content })
                .eq('id', id);
            if (error) {
                console.log("Error updating blog:", error);
                return;
            }
            dispatch(updateBlog({ id: id!, title, content, user_id: "" , created_at: "" }));
            navigate("/");
        } catch (error) {
            console.error("Update blog error:", error);
            setTitle("");
            setContent("");
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 p-6">
            <div className="max-w-3xl mx-auto bg-slate-800 p-8 rounded-lg shadow-lg">
                <h2 className="text-3xl font-bold mb-6 text-center text-blue-300">Edit Blog</h2>
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
                    onClick={handleUpdate}
                >
                    Update
                </button>
            </div>
        </div>
    );
};

export default UpdateBlog;