const STORAGE_KEY = "products";

const initialProducts = [
  {
    id: 1,
    name: "Nike Air Force 1",
    size: "42",
    gender: "Hombre",
    brand: "Nike",
    price: 45000,
    condition: "Nuevo",
    description: "Zapatillas nuevas con su caja original",
    image: "/img/shoe.png",
  },
  {
    id: 2,
    name: "Adidas Forum",
    size: "41",
    gender: "Mujer",
    brand: "Adidas",
    price: 38000,
    condition: "Usado",
    description:
      "Zapatillas usadas en excelente estado, solo 3 posturas",
    image: "/img/shoe.png",
  },
  {
    id: 3,
    name: "Puma Suede",
    size: "40",
    gender: "Unisex",
    brand: "Puma",
    price: 32000,
    condition: "Nuevo",
    description:
      "Las vendo porque me quedaron pequeñas, sin uso y con su caja",
    image: "/img/shoe.png",
  },
];

export const initProducts = () => {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialProducts));
  }
};

export const getProducts = () => {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
};

export const addProduct = (product) => {
  const products = getProducts();
  const updated = [...products, product];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};
