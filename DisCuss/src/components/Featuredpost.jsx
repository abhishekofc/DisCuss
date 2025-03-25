import React from 'react'
import { Link } from 'react-router-dom'

const Featuredpost = () => {
  return (
    <div className="mt-8 flex flex-col lg:flex-row gap-4">
      {/* Featured Post */}
      <div className="w-full lg:w-1/2 flex flex-col gap-4 p-6 bg-gray-50 rounded-xl hover:shadow-xl">
        <img 
          src="https://i.pinimg.com/736x/99/38/d5/9938d5413831d7e8bb1147c35677de54.jpg" 
          alt="Featured Post" 
          className="w-full h-auto rounded-3xl object-cover transition-transform duration-300 hover:scale-105" 
        />
        <div className="flex items-center gap-2">
          <Link className="text-blue-800 text-lg">Web design</Link>
          {/* <span className="text-gray-500">2 Days Ago</span> */}
        </div>
        <Link to="/test" className="text-xl lg:text-2xl font-semibold">
        Crimson Twilight: A Glimpse into Ancient Serenity
        </Link>
        <p className="mt-2 text-gray-700 text-sm line-clamp-2">
        This artwork beautifully captures the essence of traditional Asian architecture against a surreal red sunset. The deep crimson hues and intricate pagoda-style buildings evoke a sense of nostalgia and mystery, blending history with fantasy. Such visuals are often used in concept art, storytelling, and atmospheric world-building in games and films.        </p>
      </div>

      {/* Secondary Posts */}
      <div className="w-full lg:w-1/2 flex flex-col gap-4">
        {[1, 2, 3].map((item) => {
          let imgSrc;
          if (item === 1) {
            imgSrc = "https://i.pinimg.com/736x/c8/62/28/c86228c22a42eec00a9bed2d84642dab.jpg";
          } else if (item === 2) {
            imgSrc = "https://i.pinimg.com/736x/99/e5/20/99e520cfb514eeb0083f9fad6837f9c4.jpg";
          } else {
            imgSrc = "https://i.pinimg.com/736x/b9/ce/99/b9ce99607f405a040b6c072d7dc22b8f.jpg";
          }
          return (
            <div key={item} className="flex gap-4 bg-gray-50 rounded-xl p-4 hover:shadow-xl">
              <img 
                src={imgSrc}
                alt={`Post ${item}`}
                className="w-1/3 h-auto rounded-3xl object-cover transition-transform duration-300 hover:scale-105"
              />
              <div className="w-2/3">
                <div className="flex items-center gap-2 text-sm mb-2">
                  <Link className="text-blue-800">Web design</Link>
                  <span className="text-gray-500">2 Days Ago</span>
                </div>
                <Link 
                  to="/test" 
                  className="text-base sm:text-lg md:text-xl font-semibold"
                >
                  Lorem, ipsum dolor sit amet consectetur adipisicing elit. Corporis, laborum?
                </Link>
                <p className="mt-2 text-gray-700 text-sm line-clamp-2">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent vehicula diam at dolor convallis, sed varius enim consectetur.
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Featuredpost
