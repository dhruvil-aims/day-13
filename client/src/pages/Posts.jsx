import { useEffect, useState } from "react";
import {
  Container,
  Card,
  CardContent,
  Button,
  TextField,
} from "@mui/material";
import { getPosts, deletePost, likePost, commentPost } from "../services/postApi";
import { useLocation, Link } from "react-router-dom";
import FavoriteIcon from "@mui/icons-material/Favorite";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [comment, setComment] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;
  const location = useLocation();

  const load = async () => {
    const res = await getPosts(page);
    setPosts(res.data.posts);
    setTotalPages(res.data.totalPages);
    setComment("");
  };
  const remove = async (id) => {
    if(!confirm("Are you sure? You want to delete this post.")) return;
    try {
      await deletePost(id);
      showMessage("Post deleted successfully");
    } catch(e){ showMessage("You are not authorized to delete this post", "error"); }
  };

  useEffect(() => {
    load();
    if (location.state?.message) {
      showMessage(location.state.message);
    }
  }, [page]);

  const [snack, setSnack] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const showMessage = (message, severity = "success") => {
    setSnack({ open: true, message, severity });
  };

  return (
    <Container sx={{ mt: 4 }}>
      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>📰 Posts</h2>
        {user && (
          <Button variant="contained" component={Link} to="/posts/new">
            Add Post
          </Button>
        )}
      </div>

      {posts.map((p) => (
        <Card key={p._id} sx={{ mt: 2 }}>
          <CardContent>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h3 style={{ margin: 0 }}>{p.title}</h3>

            {p.author?._id === userId && (
              <div style={{ display: "flex", gap: 2 }}>
                <IconButton
                  size="small"
                  component={Link}
                  to={`/posts/edit/${p._id}`}
                >
                  <EditIcon fontSize="small" />
                </IconButton>

                <IconButton style={{ margin: "0 1rem 0 0" }}
                  size="small"
                  color="error"
                  onClick={() => remove(p._id).then(load)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </div>
            )}
          </div>

            {/* IMAGE */}
            {p.image && (
              <img
                src={`http://localhost:5000${p.image}`}
                style={{ width: "100px", borderRadius: 6 }}
              />
            )}

            <p>{p.content.replace(/<[^>]+>/g, " ")}</p>

            <small>
              {p.category} | By {p.author?.name}
            </small><br/><br/>

            {/* LIKE BUTTON SMALL */}
            <IconButton className="w-0"
              size="small"
              onClick={() => likePost(p._id).then(() => { showMessage("Post liked ❤️");load();}).catch(() => showMessage("Login required to like post", "error"))}
            >
              <FavoriteIcon fontSize="small" color="error" />
            </IconButton><br/>
            {p.likes.length}

                {/* COMMENTS */}
            <TextField
              fullWidth
              placeholder="Write a comment..."
              size="small"
              sx={{ mt: 2 }}
              onChange={(e) => setComment(e.target.value)}
            />

            <Button
              size="small"
              onClick={() => commentPost(p._id, comment).then(() => { showMessage("Comment added 💬");load();}).catch(() => showMessage("Failed to add comment", "error"))}
            >
              Comment
            </Button>

            {p.comments.map((c, i) => (
              <p key={i}>💬 {c.text}</p>
            ))}
            <Snackbar
              open={snack.open}
              autoHideDuration={3000}
              onClose={() => setSnack({ ...snack, open: false })}
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
              <Alert
                severity={snack.severity}
                onClose={() => setSnack({ ...snack, open: false })}
                variant="filled"
              >
                {snack.message}
              </Alert>
            </Snackbar>

          </CardContent>
        </Card>
      ))}

      {/* PAGINATION */}
      <div style={{ marginTop: 20 }}>
        <Button disabled={page === 1} onClick={() => setPage(page - 1)}>
          Prev
        </Button>
        <Button disabled={page === totalPages} onClick={() => setPage(page + 1)}>
          Next
        </Button>
      </div>
    </Container>
  );
}



