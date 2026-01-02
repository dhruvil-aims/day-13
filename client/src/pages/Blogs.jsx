import { useEffect, useState } from "react";
import { Grid, Card, CardContent, CardMedia, Typography, Button, Box, Container } from "@mui/material";
import { Link } from "react-router-dom";
import { getBlogs, getBlogById } from "../services/postApi";

export default function Blogs() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const load = async () => {
    const res = await getBlogs(page);
    setPosts(res.data.posts);
    setTotalPages(res.data.totalPages);
  };

  useEffect(() => {
    load();
  }, [page]);
  const stripHtml = (html = "") =>
  html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

  const limitWords = (text = "", limit = 20) => {
    const words = text.split(" ");
    return words.length > limit
      ? words.slice(0, limit).join(" ") + "..."
      : text;
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 6, mb: 6 }}>
      {/* PAGE TITLE */}
      <Typography variant="h4" fontWeight="bold" textAlign="center" gutterBottom>
        Blogs
      </Typography>

      <Typography variant="body1" textAlign="center" color="text.secondary" sx={{ mb: 4 }}>
        Read our latest articles, tips, and insights
      </Typography>

      {/* BLOG GRID */}
      <Grid container spacing={4}>
        {posts.map((post) => (
          <Grid item xs={12} sm={6} md={4} key={post._id}>
            <Card sx={{ height: 420, display: "flex", flexDirection: "column", borderRadius: 2, boxShadow: 2,}} >
              {/* IMAGE (ALWAYS SAME SIZE) */}
              <Box sx={{ height: 200, backgroundColor: "#f2f2f2" }}>
                <CardMedia component="img" image={post.image ? `https://day-13.onrender.com/${post.image}` : "https://via.placeholder.com/400x200?text=No+Image"}
                  sx={{ height: "100%", width: "100%", objectFit: "cover",}} />
              </Box>

              {/* CONTENT */}
              <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column", }}>
                <Typography fontWeight={600} mb={1}>
                  {limitWords(post.title, 7)}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ flexGrow: 1 }}
                >
                  {limitWords(stripHtml(post.content), 20)}
                </Typography>

                <Link
                  to={`/blogs/${post._id}`}
                  style={{ marginTop: 12 }}
                >
                  Read More →
                </Link>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>




      {/* PAGINATION */}
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <Button disabled={page === 1} onClick={() => setPage(page - 1)} sx={{ mr: 2 }}>
          Prev
        </Button>
        <Button disabled={page === totalPages} onClick={() => setPage(page + 1)}>
          Next
        </Button>
      </Box>
    </Container>
  );
}
