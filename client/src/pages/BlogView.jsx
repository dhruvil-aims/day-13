import { useEffect, useState } from "react";
import { Container, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import API from "../services/api";

export default function BlogView() {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    API.get(`/blogs/${id}`).then((res) => setPost(res.data));
  }, [id]);

  if (!post) return null;

  return (
    <Container maxWidth="md">
      <Typography variant="h3" mt={4}>{post.title}</Typography>

      {post.image && (
        <img
          src={`https://day-13.onrender.com/uploads/${post.image}`}
          style={{ width: "100%", marginTop: 20, borderRadius: 10 }}
        />
      )}

      <div
        style={{ marginTop: 20 }}
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </Container>
  );
}
