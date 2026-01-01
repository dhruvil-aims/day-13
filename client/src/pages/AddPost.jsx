import { Container, TextField, Button, Card, CardContent } from "@mui/material";
import { useState } from "react";
import { createPost } from "../services/postApi";
import { useNavigate, Link } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import ArrowBack from "@mui/icons-material/ArrowBack";
import RichEditor from "../services/quill.jsx";

export default function AddPost() {
  const [form, setForm] = useState({ title: "", content: "" });
  const navigate = useNavigate();

  const [errors, setErrors] = useState({});
  const [file, setFile] = useState(null);

  const submit = async () => {
    let err = {};
    if (!form.title) err.title = "Required";
    if (!form.content) err.content = "Required";
    if (!form.category) err.category = "Required";

    if (Object.keys(err).length) {
      setErrors(err);
      return;
    }

    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => data.append(k, v));
    if (file) data.append("image", file);

    await createPost(data);
    navigate("/posts", {
      state: { message: "Post created successfully 🎉" },
    });
  };
  const handleContentChange = (val) => {
    setForm((prev) => ({
      ...prev,
      content: val,
    }));
  }


  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Card>
        <CardContent>
          <h2><IconButton
                size="small"
                component={Link}
                to={`/posts`}
                title="Back"
              >
                <ArrowBack />
              </IconButton>Add Post</h2>

          <TextField
            error={!!errors.title}
            helperText={errors.title}
            fullWidth
            label="Title"
            margin="normal"
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          
          <RichEditor
            error={!!errors.content}
            helperText={errors.content}
            value={form.content}
            onChange={handleContentChange}
          />
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />

          <TextField
            label="Category"
            fullWidth
            margin="normal"
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />

          <TextField
            label="Tags (comma separated)"
            fullWidth
            margin="normal"
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
          />

          <Button fullWidth variant="contained" onClick={submit}>
            Publish
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
}
