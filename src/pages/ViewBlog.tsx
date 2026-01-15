import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";
import { setViewBlog, clearViewBlog } from "../features/blogsSlice";
import { supabase } from "../supabaseClient";
import type { RootState } from "../store";

const ViewBlog = () => {
    const { id } = useParams<{ id: string }>();
    const user = useSelector((state: RootState) => state.auth.user);
    const blogs = useSelector((state: RootState) => state.blogs.blogs);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [comments, setComments] = useState<any[]>([]);
    const [commentContent, setCommentContent] = useState("");
    const [commentImage, setCommentImage] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);


    const blog = blogs.find((b) => b.id === id);

    const fetchComments = async () => {
        const { data, error } = await supabase
            .from("comments")
            .select("*")
            .eq("blog_id", id)
            .order("created_at", { ascending: false });

            if (error) {
                console.error("Error fetching comments:", error);
                return;
            } else {
                setComments(data || []);
            }
    };

    const handlePostComment = async () => {
        if (!commentContent && !commentImage) {
            return;
        }
        setUploading(true);

        let imageUrl = null;

        if (commentImage) {
            const fileExt = commentImage.name.split('.').pop();
            const fileName = `${user.id}/comments/${Math.random()}.${fileExt}`;
            const { error: uploadError } = await supabase.storage
                .from('images-blog')
                .upload(fileName, commentImage);

            if (!uploadError) {
                const { data } = supabase.storage
                    .from('images-blog')
                    .getPublicUrl(fileName);
                imageUrl = data.publicUrl;
            }
        }

        const { error } = await supabase
            .from("comments")
            .insert([
                {
                    blog_id: id,
                    user_id: user?.id,
                    content: commentContent,
                    image_url: imageUrl,
                }
            ]);

        if (error) {
            console.error("Error posting comment:", error);
        } else {
            setCommentContent("");
            setCommentImage(null);
            fetchComments();
        }
        setUploading(false);
    }

    const handleDeleteComment = async (commentId: string, imageUrl: string | null) => {
        try {
            if (imageUrl) {
                const filePath = imageUrl.split('/public/images-blog/')[1];
                if (filePath) {
                    await supabase.storage.from('images-blog').remove([filePath]);
                }
            }

            const { error } = await supabase
                .from("comments")
                .delete()
                .eq("id", commentId);

            if (error) {
                console.error("Error deleting comment:", error);
                return;
            }

            setComments(comments.filter(c => c.id !== commentId));
        } catch (error) {
            console.error("Error deleting comment:", error);
        }
    };

    useEffect(() => {

        if (blog) {
            dispatch(setViewBlog(blog));
        }

        if (id) {
            fetchComments();
        }

        return () => {
            dispatch(clearViewBlog());
        };
    }, [id, blog, dispatch]);

    if (!blog) {
        return (
            <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white">
                <p className="text-xl mb-4">Blog not found.</p>
                <button onClick={() => navigate("/")} className="text-yellow-500 hover:underline cursor-pointer">Go back home</button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900 p-6">
            <div className="max-w-3xl mx-auto">
                <button 
                    onClick={() => navigate("/")} 
                    className="text-slate-400 hover:text-yellow-500 font-medium mb-4 underline cursor-pointer"
                >
                    Back to Feed
                </button>
                <div className="mb-10">
                    <div className="bg-slate-900 rounded-3xl shadow-2xl border border-slate-800 overflow-hidden mb-10">
                        {blog.image_url && (
                            <div className="w-full bg-slate-800 border-b border-slate-800">
                                <img 
                                    src={blog.image_url} 
                                    alt={blog.title} 
                                    className="w-full h-auto max-h-[600px] object-contain mx-auto" 
                                />
                            </div>
                        )}
                        <div className="p-8 md:p-12">
                            <h1 className="text-yellow-400 text-5xl font-bold mb-6">{blog.title}</h1>
                            <p className="text-slate-200 text-xl  whitespace-pre-wrap mb-10">{blog.content}</p>

                            <div className="flex justify-end border-t border-slate-800 pt-6">
                                <Link 
                                    to={`/update/${blog.id}`} 
                                    className="bg-slate-800 hover:bg-slate-700 text-yellow-500 px-6 py-2 rounded-full font-semibold transition-all border border-slate-700"
                                >
                                    Edit
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 rounded-lg">
                        <textarea 
                            className="w-full bg-slate-800 text-white p-3 rounded mb-3 focus:outline-none border border-slate-600 focus:border-yellow-500"
                            placeholder="Write a comment..."
                            value={commentContent}
                            onChange={(e) => setCommentContent(e.target.value)}
                        />
                        
                        <div className="flex items-center justify-between mb-8">
                            <div className="relative">
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    id="comment-upload"
                                    onChange={(e) => setCommentImage(e.target.files ? e.target.files[0] : null)}
                                    className="hidden"
                                />
                                <label 
                                    htmlFor="comment-upload"
                                    className="flex items-center gap-2 text-slate-400 hover:text-yellow-500 cursor-pointer transition-colors text-sm font-medium bg-slate-800 px-4 py-2 rounded-lg border border-slate-700"
                                >
                                    {commentImage ? "Change Image" : "Add Image"}
                                </label>
                                {commentImage && <p className="text-xs text-yellow-500 mt-2">Image attached: {commentImage.name}</p>}
                            </div>
                            <button 
                                onClick={handlePostComment}
                                disabled={uploading}
                                className="bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold py-2 px-6 rounded disabled:opacity-50"
                            >
                                {uploading ? "Posting..." : "Post Comment"}
                            </button>
                        </div>

                        <h3 className="text-slate-100 text-2xl font-bold mb-8 flex items-center gap-3">
                            Comments 
                            <span className="text-sm bg-slate-800 text-slate-400 px-3 py-1 rounded-full border border-slate-700">
                                {comments.length}
                            </span>
                        </h3>
                        <div className="space-y-4">
                            {comments.map((comment) => (
                                <div key={comment.id} className="bg-slate-700/50 p-4 rounded-lg border border-slate-700">
                                    {user?.id === comment.user_id && (
                                        <button 
                                            onClick={() => handleDeleteComment(comment.id, comment.image_url)}
                                            className="text-slate-500 hover:text-red-500 text-xl font-bold uppercase tracking-widest cursor-pointer rounded-lg float-right"
                                        >
                                            X
                                        </button>
                                    )}
                                    <p className="text-slate-200 text-lg mb-3">{comment.content}</p>
                                    {comment.image_url && (
                                        <div className="max-w-xs rounded overflow-hidden mb-2 border border-slate-600">
                                            <img src={comment.image_url} alt="comment" className="w-full h-auto" />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewBlog;