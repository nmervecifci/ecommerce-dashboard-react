import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export const ProductContext = createContext();

const ProductContextProvider = (props) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSeason, setSelectedSeason] = useState("all");
  const [organicOnly, setOrganicOnly] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPriceRange, setSelectedPriceRange] = useState("all");
  const [selectedStockStatus, setSelectedStockStatus] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Categories fetch
        const { data: categoriesData, error: categoriesError } = await supabase
          .from("categories")
          .select("*")
          .order("name");

        if (categoriesError) throw categoriesError;
        setCategories(categoriesData || []);

        // Products fetch with category JOIN
        const { data: productsData, error: productsError } = await supabase
          .from("products")
          .select(
            `
            *,
            categories (
              id,
              name
            )
          `
          )
          .order("created_at", { ascending: false });

        if (productsError) throw productsError;
        setProducts(productsData || []);
      } catch (err) {
        setError(err.message);
        console.error("Fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // SUPABASE CRUD OPERATIONS
  const addProduct = async (newProduct) => {
    try {
      const { data, error } = await supabase
        .from("products")
        .insert([newProduct]).select(`
          *,
          categories (id, name)
        `);

      if (error) throw error;
      setProducts((prev) => [data[0], ...prev]);
      return { success: true, data: data[0] };
    } catch (err) {
      console.error("Add error:", err);
      return { success: false, error: err.message };
    }
  };

  const updateProduct = async (id, updatedProduct) => {
    try {
      const { data, error } = await supabase
        .from("products")
        .update(updatedProduct)
        .eq("id", id).select(`
          *,
          categories (id, name)
        `);

      if (error) throw error;
      setProducts((prev) => prev.map((p) => (p.id === id ? data[0] : p)));
      return { success: true, data: data[0] };
    } catch (err) {
      console.error("Update error:", err);
      return { success: false, error: err.message };
    }
  };

  const deleteProduct = async (id) => {
    try {
      const { error } = await supabase.from("products").delete().eq("id", id);

      if (error) throw error;
      setProducts((prev) => prev.filter((p) => p.id !== id));
      return { success: true };
    } catch (err) {
      console.error("Delete error:", err);
      return { success: false, error: err.message };
    }
  };

  const searchProducts = (term) => setSearchTerm(term);
  const filterByCategory = (categoryId) => setSelectedCategory(categoryId);
  const filterBySeason = (season) => setSelectedSeason(season);
  const toggleOrganicFilter = () => setOrganicOnly(!organicOnly);

  const filterByStatus = (status) => setSelectedStatus(status);
  const filterByPriceRange = (priceRange) => setSelectedPriceRange(priceRange);
  const filterByStockStatus = (stockStatus) =>
    setSelectedStockStatus(stockStatus);

  // STATUS HESAPLAMA FONKSİYONU
  const getProductStatus = (product) => {
    if (product.stock_quantity === 0) return "Out of Stock";
    if (product.stock_quantity < 20) return "Low Stock";
    return "Active";
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" || product.category_id === selectedCategory;

    const matchesSeason =
      selectedSeason === "all" || product.season === selectedSeason;

    const matchesOrganic = !organicOnly || product.is_organic;

    const productStatus = getProductStatus(product);
    const matchesStatus =
      selectedStatus === "all" || productStatus === selectedStatus;

    const matchesPriceRange = (() => {
      if (selectedPriceRange === "all") return true;
      const price = parseFloat(product.price);
      switch (selectedPriceRange) {
        case "0-500":
          return price >= 0 && price <= 500;
        case "500-1000":
          return price > 500 && price <= 1000;
        case "1000-1500":
          return price > 1000 && price <= 1500;
        case "1500+":
          return price > 1500;
        default:
          return true;
      }
    })();

    const matchesStockStatus = (() => {
      if (selectedStockStatus === "all") return true;
      const stock = product.stock_quantity;
      switch (selectedStockStatus) {
        case "in-stock":
          return stock >= 20;
        case "low-stock":
          return stock > 0 && stock < 20;
        case "out-of-stock":
          return stock === 0;
        default:
          return true;
      }
    })();

    return (
      matchesSearch &&
      matchesCategory &&
      matchesSeason &&
      matchesOrganic &&
      matchesStatus &&
      matchesPriceRange &&
      matchesStockStatus
    );
  });

  const getTotalProducts = () => products.length;
  const getLowStockProducts = () =>
    products.filter((p) => p.stock_quantity < 20);
  const getOrganicProducts = () => products.filter((p) => p.is_organic);

  const value = {
    // State
    products,
    categories,
    filteredProducts,
    isLoading,
    error,
    searchTerm,
    selectedCategory,
    selectedSeason,
    organicOnly,
    selectedStatus,
    selectedPriceRange,
    selectedStockStatus,

    // Functions
    addProduct,
    updateProduct,
    deleteProduct,
    searchProducts,
    filterByCategory,
    filterBySeason,
    toggleOrganicFilter,
    filterByStatus,
    filterByPriceRange,
    filterByStockStatus,
    getTotalProducts,
    getLowStockProducts,
    getOrganicProducts,
    getProductStatus,
  };

  return (
    <ProductContext.Provider value={value}>
      {props.children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProducts must be used within ProductContextProvider");
  }
  return context;
};

export default ProductContextProvider;
