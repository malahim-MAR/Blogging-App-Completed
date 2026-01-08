import Link from 'next/link';

const categories = [
  {
    name: 'Business',
    slug: 'business',
    imageUrl: 'https://github.com/malahim-MAR/blogging-app-nextjs-firebase-dynamic-routing/blob/main/src/Assets/business.jpg?raw=true'
  },
  {
    name: 'Health',
    slug: 'health',
    imageUrl: 'https://github.com/malahim-MAR/blogging-app-nextjs-firebase-dynamic-routing/blob/main/src/Assets/health.jpg?raw=true'
  },
  {
    name: 'Lifestyle',
    slug: 'lifestyle',
    imageUrl: 'https://github.com/malahim-MAR/blogging-app-nextjs-firebase-dynamic-routing/blob/main/src/Assets/lifestyle.jpg?raw=true'
  },
  {
    name: 'Politics',
    slug: 'politics',
    imageUrl: 'https://github.com/malahim-MAR/blogging-app-nextjs-firebase-dynamic-routing/blob/main/src/Assets/politics.jpg?raw=true'
  },
  {
    name: 'Sports',
    slug: 'sports',
    imageUrl: 'https://github.com/malahim-MAR/blogging-app-nextjs-firebase-dynamic-routing/blob/main/src/Assets/sports.jpg?raw=true'
  },
  {
    name: 'Tech',
    slug: 'tech',
    imageUrl: 'https://github.com/malahim-MAR/blogging-app-nextjs-firebase-dynamic-routing/blob/main/src/Assets/tecch.jpg?raw=true'
  },
  {
    name: 'Travel',
    slug: 'travel',
    imageUrl: 'https://github.com/malahim-MAR/blogging-app-nextjs-firebase-dynamic-routing/blob/main/src/Assets/travel.jpg?raw=true'
  }
];

const Slideshow = () => {
  return (
    <section className="container mx-auto px-4 py-12" aria-labelledby="categories-heading">
      <h2 id="categories-heading" className="sr-only">Blog Categories</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <div 
            key={category.slug}
            className="relative group overflow-hidden rounded-xl h-64 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
              style={{ backgroundImage: `url(${category.imageUrl})` }}
              aria-hidden="true"
            />
            
            {/* Dark Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-gray-900/30 group-hover:from-gray-900/90 group-hover:to-gray-900/40 transition-all duration-500" />
            
            {/* Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-end p-6 text-white">
              <h3 className="text-2xl font-semibold mb-3 text-center">
                {category.name}
              </h3>
              <Link 
                href={`/category/${category.slug}`}
                className="px-5 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/30 hover:bg-white hover:text-gray-900 transition-colors duration-300 font-medium focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900"
                aria-label={`Explore posts in ${category.name} category`}
              >
                Explore Posts
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Slideshow;