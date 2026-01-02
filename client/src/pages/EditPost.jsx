import { useEffect, useState } from "react";
import { Container, TextField, Button, Card, CardContent, MenuItem } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import { Link } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import ArrowBack from "@mui/icons-material/ArrowBack";
import RichEditor from "../services/quill.jsx";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", content: "", category: "", tags: "" });
  const [errors, setErrors] = useState({});
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (id) {
      API.get(`/posts/${id}`).then(res => {setForm(res.data); if(res?.data?.image) setPreview(`https://day-13.onrender.com/uploads/${res.data.image}`);});
      
    }
  }, [id]);

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

  const VisuallyHiddenInput = styled('input')({
                                clip: 'rect(0 0 0 0)',
                                clipPath: 'inset(50%)',
                                height: 1,
                                overflow: 'hidden',
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                whiteSpace: 'nowrap',
                                width: 1,
                              });
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile)); // 👈 instant preview
  };

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

          <TextField
            select
            error={!!errors.category}
            helperText={errors.category}
            label="Select Category"
            fullWidth
            margin="normal"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            <MenuItem value="">Select Category</MenuItem>
            <MenuItem value="Tech">Tech</MenuItem>
            <MenuItem value="Life">Life</MenuItem>
            <MenuItem value="Nature">Nature</MenuItem>
            <MenuItem value="Sports">Sports</MenuItem>
            <MenuItem value="Education">Education</MenuItem>
            <MenuItem value="Travel">Travel</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </TextField>

          <TextField
            label="Tags (comma separated)"
            fullWidth
            margin="normal"
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
          />

          <div style={{ display: "flex", alignItems: "center", gap: 16, margin: 12,}}>
            <Button component="label" role={undefined} variant="contained" tabIndex={-1} startIcon={<CloudUploadIcon />}>
              Upload Image
              <VisuallyHiddenInput type="file" onChange={handleFileChange} accept="image/*" />
            </Button>
            {preview && (
              <img src={preview} alt="Preview" style={{ marginTop: 10, display: "right", width: 120, height: 120, objectFit: "cover", borderRadius: 8,}} />
            )}
          </div>

          {/*<input type="file" onChange={(e) => setFile(e.target.files[0])} accept="image/*" />*/}
          <Button fullWidth variant="contained" onClick={submit}>
            Update
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
}
