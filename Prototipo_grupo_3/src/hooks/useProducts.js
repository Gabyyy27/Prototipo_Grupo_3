import { mockProducts } from '../data/mockProducts.js';
import { useLocalStorage } from './useLocalStorage.js';

const PRODUCTS_KEY = 'contfia.products.v1';

export function useProducts() {
  const [products, setProducts] = useLocalStorage(PRODUCTS_KEY, mockProducts);

  function getProduct(productId) {
    return products.find((product) => product.id === productId) || null;
  }

  function createProduct(product) {
    setProducts([
      {
        ...product,
        id: `product-${Date.now()}`,
        price: Number(product.price),
        cost: Number(product.cost),
        stock: Number(product.stock),
        sold: 0,
      },
      ...products,
    ]);
  }

  function updateProduct(productId, nextProduct) {
    setProducts(products.map((product) =>
      product.id === productId
        ? {
            ...product,
            ...nextProduct,
            price: Number(nextProduct.price),
            cost: Number(nextProduct.cost),
            stock: Number(nextProduct.stock),
          }
        : product,
    ));
  }

  function deleteProduct(productId) {
    setProducts(products.filter((product) => product.id !== productId));
  }

  function registerSaleStock(productId, quantity) {
    if (!productId) return;
    setProducts(products.map((product) =>
      product.id === productId
        ? {
            ...product,
            stock: Math.max(0, Number(product.stock) - Number(quantity || 1)),
            sold: Number(product.sold || 0) + Number(quantity || 1),
          }
        : product,
    ));
  }

  return {
    products,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    registerSaleStock,
  };
}
