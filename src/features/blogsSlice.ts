import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface Blog {
    id: string;
    title: string;
    content: string;
    user_id: string;
    created_at: string;
    image_url: string;
}

interface BlogsState {
    blogs: Blog[];
    viewBlog: Blog | null;
    loading: boolean;
}

const initialState: BlogsState = {
    blogs: [],
    viewBlog: null,
    loading: false,
};

const blogsSlice = createSlice({
    name: "blogs",
    initialState,
    reducers: {
        setBlogs: (state, action: PayloadAction<Blog[]>) => {
            state.blogs = action.payload;
            state.loading = false;
        },
        setViewBlog: (state, action: PayloadAction<Blog | null>) => {
            state.viewBlog = action.payload;
            state.loading = false;
        },
        clearViewBlog: (state) => {
            state.viewBlog = null;
        },
        addBlog: (state, action: PayloadAction<Blog>) => { 
            state.blogs.push(action.payload);
        },
        updateBlog: (state, action: PayloadAction<Blog>) => {
            const index = state.blogs.findIndex(blog => blog.id === action.payload.id);
            if (index !== -1) {
                state.blogs[index] = action.payload;
            }
        },
        deleteBlog: (state, action: PayloadAction<string>) => {
            state.blogs = state.blogs.filter(blog => blog.id !== action.payload);
        },
        setLoading: (state) => {
            state.loading = true;
        },
    },
});

export const { setBlogs, setViewBlog, clearViewBlog, addBlog, updateBlog, deleteBlog, setLoading } = blogsSlice.actions;
export default blogsSlice.reducer;