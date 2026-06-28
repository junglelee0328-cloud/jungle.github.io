import { getAllPostMetas, getCategories } from "@/lib/blog";
import ClientTabs from "./components/ClientTabs";

export default function Home() {
  const posts = getAllPostMetas();
  const categories = getCategories();
  return <ClientTabs posts={posts} categories={categories} />;
}
