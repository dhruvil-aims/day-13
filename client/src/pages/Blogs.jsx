import { useEffect, useState } from "react";
import { Grid, Card, CardContent, CardMedia, Typography, Button, Box, Container } from "@mui/material";
import { Link } from "react-router-dom";
import { getPosts } from "../services/postApi";

export default function Blogs() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const load = async () => {
    const res = await getPosts(page);
    setPosts(res.data.posts);
    setTotalPages(res.data.totalPages);
  };

  useEffect(() => {
    load();
  }, [page]);

  return (
    <Container maxWidth="lg" sx={{ mt: 6, mb: 6 }}>
      {/* PAGE TITLE */}
      <Typography
        variant="h4"
        fontWeight="bold"
        textAlign="center"
        gutterBottom
      >
        Blogs
      </Typography>

      <Typography
        variant="body1"
        textAlign="center"
        color="text.secondary"
        sx={{ mb: 4 }}
      >
        Read our latest articles, tips, and insights
      </Typography>

      {/* BLOG GRID */}
      <Grid container spacing={4} justifyContent="center">
  {posts.map((post) => (
    <Grid item xs={12} sm={6} md={4} key={post._id}>
      <Card
        sx={{
          height: 380,
          display: "flex",
          flexDirection: "column",
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        {/* IMAGE */}
        <Box
          sx={{
            height: 200,
            backgroundColor: "#f2f2f2",
          }}
        >
          {post.image && (
            <CardMedia
              component="img"
              image={`https://day-13.onrender.com/uploads/${post.image}`}
              alt={post.title}
              sx={{
                height: "100%",
                objectFit: "cover",
              }}
            />
          )}
        </Box>

        {/* CONTENT */}
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography
            variant="h6"
            fontWeight="bold"
            gutterBottom
            noWrap
          >
            {post.title}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {post.content.replace(/<[^>]+>/g, "")}
          </Typography>
        </CardContent>

        {/* FOOTER */}
        <Box sx={{ p: 2 }}>
          <Button
            component={Link}
            to={`/blog/${post._id}`}
            size="small"
          >
            Read More
          </Button>
        </Box>
      </Card>
    </Grid>
  ))}
</Grid>


      {/* PAGINATION */}
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <Button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          sx={{ mr: 2 }}
        >
          Prev
        </Button>
        <Button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </Button>
      </Box>
    </Container>
  );
}
