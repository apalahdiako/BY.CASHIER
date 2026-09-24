import { Heart } from "lucide-react";
import { Food, Page } from "../../types";
import { FoodCard } from "../FoodCard";

interface FavoritesPageProps {
  list: Food[];
  favorites: number[];
  toggle: (id: number) => void;
  add: (food: Food) => void;
  detail: (food: Food) => void;
  go: (p: Page) => void;
}

export function FavoritesPage({ list, favorites, toggle, add, detail, go }: FavoritesPageProps) {
  return (
    <div className="px-5 pb-28 pt-5 lg:px-8 lg:pb-10">
      <p className="mb-6 text-sm text-gray-500">
        {list.length > 0
          ? `${list.length} dish${list.length !== 1 ? "es" : ""} in your collection`
          : "Your handpicked collection of premium tastes."}
      </p>

      {list.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {list.map((food) => (
            <FoodCard
              key={food.id}
              food={food}
              isFav={favorites.includes(food.id)}
              onFav={() => toggle(food.id)}
              onAdd={() => add(food)}
              onDetail={() => detail(food)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-3xl bg-white py-24 shadow-sm ring-1 ring-gray-100">
          <div className="grid size-20 place-items-center rounded-full bg-[#fce7ef]">
            <Heart size={32} className="text-rose-400" />
          </div>
          <h2 className="mt-6 font-['Space_Grotesk'] text-xl font-bold text-[#1c075c]">No Favorites Yet</h2>
          <p className="mt-2 max-w-xs text-center text-sm text-gray-500">
            Tap the heart icon on any dish to save it here for quick access later.
          </p>
          <button
            onClick={() => go("order")}
            className="mt-7 rounded-2xl bg-[#1c075c] px-8 py-3.5 text-sm font-bold text-white transition hover:brightness-110 active:scale-[0.98]"
          >
            Browse Dishes
          </button>
        </div>
      )}
    </div>
  );
}
