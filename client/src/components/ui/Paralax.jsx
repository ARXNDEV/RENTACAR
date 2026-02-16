"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export const HeroParallax = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const res = await fetch("/api/user/listAllVehicles");
        if (res.ok) {
          const data = await res.json();
          // Map backend data to parallax format
          const formattedData = data.slice(0, 1).map(vehicle => ({
            title: vehicle.name,
            link: `/vehicleDetails`,
            thumbnail: vehicle.image[0],
            price: vehicle.price,
            model: vehicle.model
          }));
          setProducts(formattedData);
        }
      } catch (error) {
        console.error("Failed to fetch parallax vehicles:", error);
      }
    };
    fetchVehicles();
  }, []);

  const firstRow = products.length > 0 ? products.slice(0, 1) : [
    {
      title: "Premium Fleet",
      link: "#",
      thumbnail: "https://evmwheels.com/front-theme/images/Group%20316.png",
    }
  ];

  return (
    <>
      <div className="h-full py-32 md:py-40 overflow-hidden mb-[100px] md:mb-[200px] antialiased relative flex flex-col items-center">
        <Header />
        
        {/* Apple-style Reveal Container instead of scrolling sliding math */}
        <motion.div
          initial={{ opacity: 0, y: 80, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }} // Custom spring-like bezier
          className="w-full flex justify-center mt-20 md:mt-36 lg:mt-44"
        >
          {firstRow.map((product, index) => (
            <div key={index} className="relative flex flex-col lg:flex-row items-center justify-between bg-white/70 border border-white shadow-[0_10px_50px_rgba(0,0,0,0.05)] backdrop-blur-3xl w-[90%] md:w-[800px] lg:w-[1200px] gap-8 md:gap-14 rounded-[3rem] py-16 px-10 xl:py-24 xl:px-20 overflow-hidden hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-all duration-700">
              
              {/* Premium Light Mode Glass Glow Backdrop */}
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-emerald-100/50 via-transparent to-transparent pointer-events-none" />

              <div className="z-10 lg:w-1/2 flex flex-col justify-center">
                <h1 className="text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-extrabold text-gray-900 leading-tight md:leading-snug mb-6 tracking-tight">
                  Find the perfect ride at <span className="text-transparent bg-clip-text bg-gradient-to-br from-emerald-500 to-green-600">unbeatable prices.</span>
                </h1>
                <p className="text-gray-500 text-lg md:text-xl font-medium leading-relaxed">
                  Whether it's a weekend getaway or a long-term rental, we’ve got you covered with flexible plans and zero hidden fees. Book now and hit the road in style!
                </p>
              </div>

              <div className="z-10 lg:w-1/2 w-full mt-10 lg:mt-0 flex items-center justify-center h-[250px] md:h-[350px] lg:h-[450px]">
                <ProductCard product={product} />
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </>
  );
};

export const Header = () => {
  return (
    <div className="max-w-7xl relative mx-auto px-6 lg:px-12 w-full left-0 top-0 z-20">
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 tracking-tight leading-tight">
          The Ultimate <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-600">Car Rental</span> For You
        </h1>
        <p className="max-w-2xl text-lg md:text-xl mt-10 md:mt-14 text-gray-500 font-medium leading-relaxed">
          We provide beautiful vehicles with clean transparent pricing. We are a team of
          skilled professionals passionate about getting you on the road in style.
        </p>
      </motion.div>
    </div>
  );
};

export const ProductCard = ({
  product,
}) => {
  return (
    <motion.div
      initial={{ y: 0 }}
      animate={{ y: [0, -18, 0] }} // Continuous buttery float animation
      transition={{ 
        repeat: Infinity, 
        duration: 5,
        ease: "easeInOut" 
      }}
      whileHover={{
        scale: 1.05,
      }}
      key={product.title}
      className="group/product h-full w-full relative flex-shrink-0 flex items-center justify-center cursor-pointer"
    >
      <img
        src={product.thumbnail}
        className="object-contain object-center w-full h-full max-h-[300px] lg:max-h-[400px] drop-shadow-2xl hover:drop-shadow-[0_20px_50px_rgba(16,185,129,0.3)] transition-all duration-500"
        alt={product.title}
        draggable={false}
      />
    </motion.div>
  );
};
