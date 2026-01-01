import { useEffect, useState } from "react";
import { Container, TextField, Button, Card, CardContent } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import { Link } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import ArrowBack from "@mui/icons-material/ArrowBack";
import RichEditor from "../services/quill.jsx";

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", content: "", category: "", tags: "" });
  const [errors, setErrors] = useState({});
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (id) {
      API.get(`/posts/${id}`).then(res => setForm(res.data));
    }
  }, [id]);

  const submit = async () => {
    let err = {};
    if (!form.title) err.title = "Required";
    if (!form.content) err.content = "Required";
    // if (!form.category) err.category = "Required";

    if (Object.keys(err).length) {
      setErrors(err);
      return;
    }
    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => data.append(k, v));
    if (file) data.append("image", file);

    await API.put(`/posts/${id}`, data);
    navigate("/posts", {
      state: { message: "Post updated successfully 🎉" },
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
              </IconButton>Edit Post</h2>

          <TextField
            error={!!errors.title}
            helperText={errors.title}
            fullWidth
            label="Title"
            margin="normal"
            value={form.title}
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
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />

          <TextField
            label="Tags (comma separated)"
            fullWidth
            margin="normal"
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
          />

          <Button fullWidth variant="contained" onClick={submit}>
            Update
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
}
