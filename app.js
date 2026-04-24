import express from "express";
import { v4 as uuidv4 } from "uuid";

const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

const CATEGORIES = ["Movies", "Sports", "Psychology", "General"];

const posts = [
  {
    id: uuidv4(),
    title: "3 Idiots: A Masterclass in Following Your Passion",
    category: "Movies",
    excerpt: "A powerful film that challenges the education system and reminds us to follow passion over pressure.",

    content: `3 Idiots is not just a film, it’s an emotion for every student. It beautifully shows the reality of the education system and the pressure students face.

💡 Story Overview:
The story follows three engineering students – Rancho, Farhan, and Raju. While Farhan and Raju struggle with expectations and fear, Rancho believes in learning with passion instead of chasing marks.

🌟 Key Message:
"Follow excellence, success will chase you."
The movie teaches us that understanding concepts is more important than rote learning.

😂 Humor + Emotion:
The film perfectly balances comedy and emotional moments. It makes you laugh, but also makes you think deeply about life.

❤️ Why I Like This Movie:
This movie changed my perspective on studies. It reminds me to focus on learning and curiosity rather than just marks.

⭐ Final Thoughts:
If you are a student, this movie is a must-watch. It inspires, entertains, and leaves you with a powerful life lesson.`,

    date: "April 18, 2025",
    readTime: "4 min read",
  },

  {
    id: uuidv4(),
    title: "The Kohli Mindset: Discipline, Belief & 200% Effort",
    category: "Sports",
    excerpt: "Virat Kohli’s mindset shows how discipline, belief, and effort create excellence beyond talent.",

    content: `Virat Kohli isn’t just a cricketer—he’s a mindset. What makes him different isn’t only his records, but the way he thinks and approaches life.

One thing that stands out from his interviews is his belief in giving 200%, not just 100%. For Kohli, effort isn’t about doing enough—it’s about doing everything you possibly can, every single day. That level of commitment is what builds consistency over time.

He also talks about “God’s plan”—trusting the process even when things aren’t going your way. There have been phases in his career where he struggled, faced criticism, and failed repeatedly. But instead of doubting himself, he stayed patient and believed that everything would eventually fall into place.

Another powerful mindset he shows is belief in small chances. Even if there is a 1% chance, he goes all in. Most people give up when the odds are low, but Kohli uses that as motivation. That’s what separates performers from champions.

In many of his interviews and podcasts, he emphasizes that fear often comes from not taking risks. When you avoid challenges, your confidence drops. But when you face them, even if you fail, you grow stronger. Kohli chooses to face pressure instead of running from it.

What stands out most is his intensity. Whether it’s practice or a big match, his energy and focus remain the same. That discipline builds not just skill, but a strong mindset.

The real lesson from Kohli isn’t just about cricket. It’s about showing up every day, giving your 200%, trusting the process, and believing—even when the chances are just 1%.`,

    date: "April 20, 2025",
    readTime: "3 min read",
  },

  {
    id: uuidv4(),
    title: "Overthinking: When Your Mind Becomes Your Enemy",
    category: "Psychology",
    excerpt: "Overthinking feels like solving problems, but often creates more confusion than clarity.",

    content: `Overthinking feels like problem-solving, but in reality, it often creates more problems than it solves. Instead of finding clarity, your mind keeps replaying the same thoughts, increasing doubts and fear.

It usually starts small—a decision, a conversation, or a future worry. But then your brain keeps adding “what if” after “what if.” Slowly, a simple situation turns into something overwhelming.

The truth is, overthinking is less about the situation and more about the need for control. We want perfect answers and zero uncertainty, but life doesn’t work that way.

The more you try to control everything, the more anxious you become.

One way to break this cycle is awareness. Notice when you're stuck in the same loop. Ask yourself: “Is this helping me solve the problem, or am I just repeating thoughts?”

Another powerful solution is action. Even a small step can break overthinking. Action creates clarity, while overthinking creates confusion.

At the end, most things we overthink never actually happen. And the time spent worrying could have been used living.`,

    date: "April 22, 2025",
    readTime: "5 min read",
  }
];

// HOME
app.get("/", (req, res) => {
  const { category } = req.query;
  const filtered = category
    ? posts.filter((p) => p.category === category)
    : posts;
  res.render("index", {
    posts: filtered,
    categories: CATEGORIES,
    activeCategory: category || null,
    totalPosts: posts.length,
  });
});

// NEW POST FORM
app.get("/posts/new", (req, res) => {
  res.render("new", { categories: CATEGORIES });
});

// CREATE POST
app.post("/posts", (req, res) => {
  const { title, category, content } = req.body;
  const excerpt = content.split("\n")[0].slice(0, 160) + (content.length > 160 ? "…" : "");
  const wordCount = content.trim().split(/\s+/).length;
  const readTime = Math.ceil(wordCount / 200) + " min read";
  const now = new Date();
  const date = now.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  posts.unshift({ id: uuidv4(), title, category, excerpt, content, date, readTime });
  res.redirect("/");
});

// VIEW SINGLE POST
app.get("/posts/:id", (req, res) => {
  const post = posts.find((p) => p.id === req.params.id);
  if (!post) return res.redirect("/");
  res.render("post", { post });
});

// EDIT FORM
app.get("/posts/:id/edit", (req, res) => {
  const post = posts.find((p) => p.id === req.params.id);
  if (!post) return res.redirect("/");
  res.render("edit", { post, categories: CATEGORIES });
});

// UPDATE POST
app.post("/posts/:id/update", (req, res) => {
  const post = posts.find((p) => p.id === req.params.id);
  if (!post) return res.redirect("/");
  const { title, category, content } = req.body;
  post.title = title;
  post.category = category;
  post.content = content;
  post.excerpt = content.split("\n")[0].slice(0, 160) + (content.length > 160 ? "…" : "");
  const wordCount = content.trim().split(/\s+/).length;
  post.readTime = Math.ceil(wordCount / 200) + " min read";
  res.redirect(`/posts/${post.id}`);
});

// DELETE POST
app.post("/posts/:id/delete", (req, res) => {
  const idx = posts.findIndex((p) => p.id === req.params.id);
  if (idx !== -1) posts.splice(idx, 1);
  res.redirect("/");
});

app.listen(PORT, () => {
  console.log(`InsightVerse running at http://localhost:${PORT}`);
});
