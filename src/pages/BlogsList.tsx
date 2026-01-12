import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { setBlogs, setLoading, deleteBlog } from '../features/blogsSlice';
import { clearUser } from "../features/authSlice";
import type { RootState } from "../store";

const BlogsList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state: RootState) => state.auth.user);
    const {blogs, loading} = useSelector((state: RootState) => state.blogs);
    const [page, setPage] = useState(1);
    const limit = 10;

    useEffect(() => {
        if (!user) {
            navigate("/login");
            return
        }

        const fetchBlogs = async () => {
            dispatch(setLoading());
            const { data, error } = await supabase
                .from('blogs')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .range((page - 1) * limit, page * limit - 1);

            if (error) {
                console.log("Error fetching blogs:", error);
                return;
            } else {
                dispatch(setBlogs(data || []));
            }
        };

        fetchBlogs();
    }, [
        dispatch, navigate, page, user
    ]);

    const handleDelete = async (id: string) => {
        try {
            const { error } = await supabase
                .from('blogs')
                .delete()
                .eq('id', id);
            if (error) {
                console.log("Error deleting blog:", error);
                return;
            }
            dispatch(deleteBlog(id));
        } catch (error) {
            console.error("Delete error:", error);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        dispatch(clearUser());
        navigate("/login");
    };

    if (loading) {
        return <p className="min-h-screen text-center text-slate-400 text-lg mt-10">Loading blogs...</p>;
    }

    return (
        <div className="min-h-screen bg-slate-900 p-6">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-center text-yellow-500 text-3xl md:text-left font-bold mb-6">YOUR BLOGS</h2>
                <div className="mb-6 flex justify-between">
                    <Link to="/create" className="bg-yellow-500 text-center text-slate-800 hover:bg-yellow-300 hover:text-slate-200 font-semibold py-2 px-4 rounded">Write New Blog</Link>
                    <button onClick={handleLogout} className="bg-slate-800 text-yellow-500 hover:text-red-500 font-semibold py-2 px-4 rounded">Logout</button>
                </div>
                {blogs.length === 0 ? (
                <p className="text-slate-500 text-center">No blogs yet. Start creating!</p>
                ) : (
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {blogs.map((blog) => (
                        <li key={blog.id} className="bg-slate-800 p-6 rounded-lg shadow-lg hover:shadow-xl">
                            <h3 className="text-yellow-400 text-xl font-semibold mb-2">{blog.title}</h3>
                            <p className="text-slate-200 mb-4">{blog.content}</p>
                            <div className="flex space-x-4">
                                <Link to={`/update/${blog.id}`} className="text-slate-500 hover:text-yellow-500 font-medium">Edit</Link>
                                <button onClick={() => handleDelete(blog.id)} className="text-slate-500 hover:text-red-400 font-medium">Delete</button>
                            </div>
                        </li>
                    ))}
                </ul>
                )}
                <div className="flex justify-center mt-8 space-x-4">
                    <button 
                        onClick={() => setPage((p) => Math.max(1, p-1))}
                        disabled={page === 1}
                        className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <button 
                        onClick={() => setPage((p) => p + 1)}
                        className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BlogsList;