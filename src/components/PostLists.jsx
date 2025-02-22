/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPosts,
  createPost,
  updatePost,
  deletePost,
} from "../features/posts/postslice";
import "./PostLists.css";

const PostLists = () => {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((state) => state.posts);
  const [newPost, setNewPost] = useState({ title: "", body: "" });
  const [editViewModal, setEditViewModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  // Open the add post modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Close the add post modal
  const closeModal = () => {
    setIsModalOpen(false);
    setNewPost({ title: "", body: "" });
  };

  //   adding new post

  const handleAddPost = async () => {
    if (newPost.title.trim() && newPost.body.trim()) {
      try {
        await dispatch(
          createPost({ title: newPost.title, body: newPost.body })
        ).unwrap();
        toast.success("Post added successfully!");
        closeModal();
      } catch (err) {
        toast.error("Failed to add post!");
      }
    } else {
      toast.warning("Title and body cannot be empty!");
    }
  };

  //   updating a post and viewing a post

  const openEditViewModal = (post, mode) => {
    setSelectedPost({ ...post, mode });
    setEditViewModal(true);
  };

  // Close update/View modal

  const closeEditViewModal = () => {
    setEditViewModal(false);
    setSelectedPost(null);
  };

  // Updating a single Post
  const handleUpdatePost = async () => {
    if (selectedPost.title.trim() && selectedPost.body.trim()) {
      try {
        await dispatch(updatePost(selectedPost)).unwrap();
        toast.success("Post updated successfully!");
        closeEditViewModal();
      } catch (err) {
        toast.error("Failed to update post!");
      }
    } else {
      toast.warning("Title and body cannot be empty!");
    }
  };

  //   deleting a single post

  const handleDeletePost = async (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this post?"
    );
    if (!isConfirmed) return;

    try {
      await dispatch(deletePost(id)).unwrap();
      toast.success("Post deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete post!");
    }
  };

  //   UI to handle CRUD operations

  return (
    <div className="container">
      <button onClick={openModal} className="add-btn">
        Add Post
      </button>
      <h2>Post Lists</h2>

      {status === "loading" && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      <ToastContainer position="top-right" autoClose={3000} />

      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Body</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {items.map((post) => (
            <tr key={post.id}>
              <td>
                {post.title.length > 30
                  ? post.title.slice(0, 30) + "..."
                  : post.title}
              </td>
              <td>
                {post.body.length > 50
                  ? post.body.slice(0, 50) + "..."
                  : post.body}
              </td>
              <td className="btn">
                <button
                  onClick={() => openEditViewModal(post, "edit")}
                  className="edit-btn"
                >
                  Edit
                </button>
                <button
                  onClick={() => openEditViewModal(post, "view")}
                  className="view-btn"
                >
                  View
                </button>
                <button
                  onClick={() => handleDeletePost(post.id)}
                  className="delete-btn"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for Adding a new Post */}

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Add New Post</h3>
            <input
              type="text"
              value={newPost.title}
              onChange={(e) =>
                setNewPost({ ...newPost, title: e.target.value })
              }
              placeholder="Enter post title"
            />
            <textarea
              value={newPost.body}
              onChange={(e) => setNewPost({ ...newPost, body: e.target.value })}
              placeholder="Enter post body"
            />
            <button onClick={handleAddPost}>Submit</button>
            <button onClick={closeModal}>Cancel</button>
          </div>
        </div>
      )}

      {/* Modal for updating/viewing a single Post */}
      {editViewModal && (
        <div className="modal-overlay">
          <div className="modal">
            {selectedPost?.mode === "view" ? (
              <>
                <h3>View Post</h3>
                <p>
                  <strong>Title:</strong> {selectedPost.title}
                </p>
                <p>
                  <strong>Body:</strong> {selectedPost.body}
                </p>
                <button onClick={closeEditViewModal}>Close</button>
              </>
            ) : (
              <>
                <h3>Edit Post</h3>
                <input
                  type="text"
                  value={selectedPost.title}
                  onChange={(e) =>
                    setSelectedPost({ ...selectedPost, title: e.target.value })
                  }
                />
                <textarea
                  value={selectedPost.body}
                  onChange={(e) =>
                    setSelectedPost({ ...selectedPost, body: e.target.value })
                  }
                />
                <button onClick={handleUpdatePost}>Save</button>
                <button onClick={closeEditViewModal}>Cancel</button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostLists;
