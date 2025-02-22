import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


// fetching of data using an api (JSONPlaceholder) JSONPlaceholder /posts

//  API endpoint for fetching posts
const API_URL = "https://jsonplaceholder.typicode.com/posts";


// implementing thunks for async oprations (fetching, adding, editing, and deleting data)

// Fetching all posts (fetching data)
export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
    const response = await axios.get(API_URL);
    return response.data;
  });



// Creating a new post (adding data)
export const createPost = createAsyncThunk("posts/createPost", async (newPost) => {
    const response = await axios.post(API_URL, newPost);
    return response.data;
  });


// Updating a single post (editing data)
export const updatePost = createAsyncThunk("posts/updatePost", async (updatedPost) => {
    const response = await axios.put(`${API_URL}/${updatedPost.id}`, updatedPost);
    return response.data;
  });


// Deleting a single post (deleting data)
export const deletePost = createAsyncThunk("posts/deletePost", async (postId) => {
    await axios.delete(`${API_URL}/${postId}`);
    return postId;
  });


// redux state management

  const postSlice = createSlice({
    name: "posts",
    initialState: {
    // items holds the list of posts
      items: [], 
    //   status tracks the loading status
      status: "idle",
      error: null,
    },
    reducers: {},
    

    // updating state after each CRUD operation

    extraReducers: (builder) => {
      builder

    //   updating state for fetching posts
        .addCase(fetchPosts.pending, (state) => {
          state.status = "loading";
        })
        .addCase(fetchPosts.fulfilled, (state, action) => {
          state.status = "succeeded";
          state.items = action.payload;
        })
        .addCase(fetchPosts.rejected, (state, action) => {
          state.status = "failed";
          state.error = action.error.message;
        })

    //   updating state for creating a new post

        .addCase(createPost.fulfilled, (state, action) => {
          state.items.push(action.payload);
        })

    //   updating state for editing a post

        .addCase(updatePost.fulfilled, (state, action) => {
          const index = state.items.findIndex((post) => post.id === action.payload.id);
          if (index !== -1) {
            state.items[index] = action.payload;
          }
        })


    //   updating state for deleting a post

        .addCase(deletePost.fulfilled, (state, action) => {
          state.items = state.items.filter((post) => post.id !== action.payload);
        });
    },
  });
  
  export default postSlice.reducer;