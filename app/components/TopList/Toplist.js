"use client";

import Image from "next/image";
import { useState } from "react";
import { Star } from "lucide-react";
import "./Toplist.css";

function TopList() {
  const meals = [
    {
      id: 1,
      image: "/Assets/Bizaa.jpg",
      name: "Bizza One",
      description: "Bizza spicy boil with seafood and pork in hot pot",
      price: "20$",
    },
    {
      id: 2,
      image: "/Assets/burger2.jpg",
      name: "Burger Two",
      description: "Delicious Burger with fresh vegetables and beef",
      price: "22$",
    },
    {
      id: 3,
      image: "/Assets/shawerma.jpg",
      name: "Shawerma Three",
      description: "Delicious Shawerma with fresh vegetables and beef",
      price: "25$",
    },
    {
      id: 4,
      image: "/Assets/whiteSpacity.jpg",
      name: "WhiteSpacity Four",
      description: "WhiteSpacity spicy boil with seafood and pork in hot pot",
      price: "17$",
    },
    {
      id: 5,
      image: "/Assets/potato.jpg",
      name: "Potato Five",
      description: "Delicious Potatoes with fresh vegetables and beef",
      price: "15$",
    },
  ];

  // State to manage ratings for each meal
  const [ratings, setRatings] = useState({});

  const handleRating = (mealId, rating) => {
    setRatings((prevRatings) => ({
      ...prevRatings,
      [mealId]: rating,
    }));
  };

  return (
    <div className="toplist">
      <h2>Top List</h2>
      <p>Our Mainstay Menu</p>
      <div className="mealsContainer">
        {meals.map((meal) => (
          <div key={meal.id} className="meal">
            <Image src={meal.image} alt={meal.name} width={200} height={100} />
            {/* Star Rating */}
            <div className="rating">
              {[...Array(5)].map((_, index) => {
                const starIndex = index + 1;
                return (
                  <Star
                    key={starIndex}
                    onClick={() => handleRating(meal.id, starIndex)}
                    className={`cursor-pointer transition-colors ${
                      starIndex <= (ratings[meal.id] || 0)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-400"
                    }`}
                    size={20}
                  />
                );
              })}
              <span className="ml-2 text-sm">{ratings[meal.id] || 0}/5</span>
            </div>
            <h3>{meal.name}</h3>
            <p>{meal.description}</p>
            <h5>{meal.price}</h5>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TopList;
