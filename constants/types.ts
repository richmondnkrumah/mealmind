
export type WEEKDAYS =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export type RECIPE = {
  recipeName: string;
  cookTime: string;
  calories: string;
  imageUrl: string;
  ingredients: string[];
  instructions: string[];
};

export type DAYMEALS = {
  breakfast: RECIPE | null;
  lunch: RECIPE | null;
  dinner: RECIPE | null;
};

type WEEKLYPLAN = Record<WEEKDAYS, DAYMEALS>;

type SHOPPINGLISTITEM = {
  item: string;
  quantity: string;
  category: string;
};

type PlanData = {
  shopping_list: SHOPPINGLISTITEM[];
  weekly_plan: WEEKLYPLAN;
};

type CookedStatus = Record<string, boolean>;

export type DUMMYMEALPLANDATA = {
  plan_data: PlanData;
  cooked_status: CookedStatus;
};

export type PANTRYCARD = {
  deleteItemHandler: (itemtoDelete: string ) => void,
  ingredient: string
}

export type INGREDIENTCARD = {
  label: string,
  quantity: string
}
export type PROFILELINKS = {
  href: any,
  iconName: any,
  text: string
}