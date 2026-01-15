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
    const [image, setImage] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
    const user = useSelector((state: RootState) => state.auth.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const blog = blogs.find((b) => b.id === id);
        if (blog) {
            setTitle(blog.title);
            setContent(blog.content);
            setExistingImageUrl(blog.image_url || null);
        }
    }, [id, blogs]);

    const uploadImage = async (file: File) => { 
        setUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${user?.id}/${Math.random()}.${fileExt}`;
            
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

    const handleUpdate = async () => {
        if (!user) return;

        let finalImageUrl = existingImageUrl;

        if (image) {
            const uploadedUrl = await uploadImage(image);
            if (uploadedUrl) {
                finalImageUrl = uploadedUrl;
            } else {
                return;
            }
        }

        try {
            const { data, error } = await supabase
                .from('blogs')
                .update({ 
                    title, 
                    content, 
                    image_url: finalImageUrl 
                })
                .eq('id', id)
                .select();

            if (error) {
                console.log("Error updating blog:", error);
                return;
            }

            if (data && data[0]) {
                dispatch(updateBlog(data[0]));
                navigate("/");
            }
        } catch (error) {
            console.error("Update blog error:", error);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 p-6">
            <div className="max-w-3xl mx-auto bg-slate-800 p-8 rounded-lg shadow-lg">
                <button 
                    onClick={() => navigate("/")} 
                    className="text-slate-400 underline hover:text-yellow-500 font-medium"
                >
                    Back to Feed
                </button>
                <h2 className="text-3xl font-bold mb-6 text-center text-blue-300">Edit Blog</h2>
                <input 
                    className="w-full bg-slate-700 text-white text-2xl border border-slate-500 rounded p-3 mb-4 focus:outline-none focus:border-yellow-500"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter New Blog Title"
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
                    onClick={handleUpdate}
                    disabled={uploading}
                >
                    {uploading ? "Uploading..." : "Update Blog"}
                </button>
            </div>
        </div>
    );
};

export default UpdateBlog;