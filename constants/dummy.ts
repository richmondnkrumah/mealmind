import { DUMMYMEALPLANDATA } from "./types";

export const dummyNutritionsData = [
  { label: "Calories", quantity: "500g" },
  { label: "Protein", quantity: "30g" },
  { label: "Carbo", quantity: "50g" },
  { label: "Fats", quantity: "20g" },
]

export const dummyIngredientsData = [
  {
    label: "Tomato",
    quantity: "2 pcs"
  },
  {
    label: "Lettuce",
    quantity: "1 head"
  },
  {
    label: "Broccoli",
    quantity: "1 head"
  },
  {
    label: "Salad",
    quantity: "1 bunch"
  },
  {
    label: "Carrot",
    quantity: "3 pcs"
  },
  {
    label: "Cucumber",
    quantity: "2 pcs"
  },
  {
    label: "Corn",
    quantity: "2 ears"
  },
  {
    label: "Beet",
    quantity: "4 pcs"
  },
  {
    label: "Celery",
    quantity: "1 bunch"
  }
];
export const dummyMealPlanData: DUMMYMEALPLANDATA = {
  plan_data: {
    shopping_list: [
      { item: "Salmon Fillets", quantity: "2", category: "Meat & Fish" },
      { item: "Lemon", quantity: "1", category: "Produce" },
      { item: "Asparagus", quantity: "1 bunch", category: "Produce" },
      { item: "Avocado", quantity: "2", category: "Produce" },
      { item: "Whole Wheat Bread", quantity: "1 loaf", category: "Bakery" },
      { item: "Eggs", quantity: "6", category: "Dairy & Eggs" },
      { item: "Greek Yogurt", quantity: "1 container", category: "Dairy & Eggs" },
      { item: "Berries", quantity: "1 pint", category: "Produce" },
      { item: "Quinoa", quantity: "1 cup", category: "Pantry" },
      { item: "Black Beans", quantity: "1 can", category: "Pantry" },
      { item: "Corn", quantity: "1 can", category: "Pantry" },
      { item: "Red Onion", quantity: "1", category: "Produce" },
      { item: "Cilantro", quantity: "1 bunch", category: "Produce" },
    ],
    weekly_plan: {
      monday: {
        breakfast: {
          recipeName: "Avocado Toast with Eggs",
          cookTime: "10 min",
          calories: "350 kcal",
          imageUrl:
            "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?q=80&w=2120&auto=format&fit=crop",
          ingredients: ["2 slices Whole Wheat Bread", "1 Avocado", "2 Eggs", "Salt & Pepper"],
          instructions: [
            "Toast the bread.",
            "Mash the avocado and spread on toast.",
            "Fry or poach eggs and place on top.",
          ],
        },
        lunch: {
          recipeName: "Quinoa Salad with Black Beans",
          cookTime: "20 min",
          calories: "450 kcal",
          imageUrl:
            "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?q=80&w=1964&auto=format&fit=crop",
          ingredients: [
            "1 cup cooked Quinoa",
            "1 can Black Beans",
            "1 can Corn",
            "1/2 Red Onion, chopped",
            "Cilantro, chopped",
            "Lime Vinaigrette",
          ],
          instructions: ["Combine all ingredients in a large bowl.", "Toss with lime vinaigrette."],
        },
        dinner: {
          recipeName: "Sheet Pan Lemon Herb Salmon",
          cookTime: "25 min",
          calories: "550 kcal",
          imageUrl:
            "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=2070&auto=format&fit=crop",
          ingredients: [
            "2 Salmon Fillets",
            "1 bunch Asparagus",
            "1 Lemon",
            "Olive Oil",
            "Herbs, Salt, Pepper",
          ],
          instructions: [
            "Preheat oven to 400°F (200°C).",
            "Place salmon and asparagus on a baking sheet.",
            "Drizzle with olive oil, lemon juice, and seasonings.",
            "Bake for 15-20 minutes until salmon is cooked through.",
          ],
        },
      },
      tuesday: {
        breakfast: {
          recipeName: "Greek Yogurt with Berries",
          cookTime: "5 min",
          calories: "250 kcal",
          imageUrl:
            "https://images.unsplash.com/photo-1525253013412-55c1aeda2a54?q=80&w=1974&auto=format&fit=crop",
          ingredients: ["1 cup Greek Yogurt", "1/2 cup Mixed Berries", "Honey (optional)"],
          instructions: [
            "Place yogurt in a bowl.",
            "Top with berries and a drizzle of honey if desired.",
          ],
        },
        lunch: null,
        dinner: {
          recipeName: "Chicken Stir-fry",
          cookTime: "30 min",
          calories: "500 kcal",
          imageUrl:
            "https://images.unsplash.com/photo-1603133872878-684f208fb84b?q=80&w=1925&auto=format&fit=crop",
          ingredients: [
            "1 lb Chicken Breast, sliced",
            "Assorted Vegetables (Broccoli, Carrots)",
            "Soy Sauce",
            "Ginger",
            "Garlic",
          ],
          instructions: [
            "Sauté chicken until browned.",
            "Add vegetables and stir-fry until tender-crisp.",
            "Add sauce and serve over rice.",
          ],
        },
      },
      wednesday: { breakfast: null, lunch: null, dinner: null },
      thursday: { breakfast: null, lunch: null, dinner: null },
      friday: { breakfast: null, lunch: null, dinner: null },
      saturday: { breakfast: null, lunch: null, dinner: null },
      sunday: { breakfast: null, lunch: null, dinner: null },
    },
  },
  cooked_status: {
    monday_breakfast: true,
  },
};
