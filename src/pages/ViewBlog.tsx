import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";
import { setViewBlog, clearViewBlog } from "../features/blogsSlice";
import type { RootState } from "../store";

const ViewBlog = () => {
    const { id } = useParams<{ id: string }>();
    const blogs = useSelector((state: RootState) => state.blogs.blogs);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    // Ito yung blog na nahanap natin
    const blog = blogs.find((b) => b.id === id);

    useEffect(() => {
        if (blog) {
            dispatch(setViewBlog(blog));
        }

        return () => {
            dispatch(clearViewBlog());
        };
    }, [blog, dispatch]);

    return (
        <div className="min-h-screen bg-slate-900 p-6">
            <div className="max-w-3xl mx-auto bg-slate-800 p-8 rounded-lg shadow-lg">
                <div className="bg-slate-800  rounded-lg shadow-lg hover:shadow-xl">
                    <button 
                        onClick={() => navigate("/")} 
                        className="text-slate-400 hover:text-yellow-500 font-medium mb-4 underline"
                    >
                        Back to Feed
                    </button>
                    <div className="bg-slate-700 text-white text-2xl border border-slate-500 rounded p-3 mb-4">
                        <h2 className="text-yellow-400 text-4xl font-semibold mb-5">{blog.title}</h2>
                        <p className="text-slate-200 text-2xl mb-2 whitespace-pre-wrap">{blog.content}</p>
                    </div>
                    <Link to={`/update/${blog.id}`} className="text-slate-500 text-xl hover:text-yellow-500 font-medium">Edit</Link>
                </div>
            </div>
        </div>
    );
};

export default ViewBlog;