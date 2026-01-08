// Home.jsx
import React from "react";
import BlogCard from "./BlogCard"; // ✅ use the real one

const Home = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center">
        <div className="w-full max-w-4xl">
          <div className="carousel carousel-vertical rounded-box space-y-4 h-[600px]">
            <div className="carousel-item h-80 lg:h-72 w-full transition-all duration-300 hover:shadow-xl ">
              <BlogCard /> {/* ✅ Now it will fetch from Firestore */}
            </div>
          </div>

          <div className="flex justify-center mt-6 space-x-2">
            {[...Array(7)].map((_, i) => (
              <a
                key={i}
                href={`#item${i + 1}`}
                className="btn btn-xs btn-square"
              >
                {i + 1}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
