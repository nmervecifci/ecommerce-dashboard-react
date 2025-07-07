import React, { useState } from "react";
import { Input } from "/src/components/ui/input";
import { Button } from "/src/components/ui/button";
import { FaPlus } from "react-icons/fa6";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "/src/components/ui/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "/src/components/ui/table";
import { CiEdit } from "react-icons/ci";
import { CiTrash } from "react-icons/ci";
import { MdCheckBoxOutlineBlank } from "react-icons/md";
import { useProducts } from "../contexts/ProductContext";

function Products() {
  const {
    filteredProducts,
    products,
    categories,
    addProduct,
    updateProduct,
    deleteProduct,
    searchProducts,
    filterByCategory,
    filterByStatus,
    filterByPriceRange,
    filterByStockStatus,
    getTotalProducts,
    getLowStockProducts,
    getProductStatus,
    searchTerm,
    selectedCategory,
    selectedStatus,
    selectedPriceRange,
    selectedStockStatus,
  } = useProducts();

  const [localSearchTerm, setLocalSearchTerm] = useState("");

  // Event handlers
  const handleSearch = (e) => {
    const term = e.target.value;
    setLocalSearchTerm(term);
    searchProducts(term);
  };

  const handleCategoryFilter = (category) => {
    console.log("Category selected:", category);
    filterByCategory(category);
  };

  const handleEdit = (product) => {
    console.log("Edit product:", product);
  };

  const handleDelete = (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      deleteProduct(productId);
    }
  };

  const handleAddProduct = () => {
    console.log("Add new product");
  };

  const handleStatusFilter = (status) => {
    console.log("Status selected:", status);
    filterByStatus(status);
  };

  const handlePriceFilter = (priceRange) => {
    console.log("Price selected:", priceRange);
    filterByPriceRange(priceRange);
  };

  const handleStockFilter = (stockStatus) => {
    console.log("Stock selected:", stockStatus);
    filterByStockStatus(stockStatus);
  };

  const getUniqueCategories = () => {
    return categories; // Direkt categories state'ini kullan
  };

  const lowStockCount = getLowStockProducts().length;

  return (
    <div className="border border-neutral-200 p-6 m-6 rounded-lg">
      {/* Tech Badge */}
      <div className="mb-4">
        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
          🔧 Context API - Product Management
        </span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Products Management
          </h1>
          <div className="flex gap-4 text-sm text-gray-600 mt-1">
            <span>Total Products: {getTotalProducts()}</span>
            <span>•</span>
            <span className="text-orange-600">Low Stock: {lowStockCount}</span>
            <span>•</span>
            <span>Showing: {filteredProducts.length} products</span>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="bg-green-500 hover:bg-green-600 text-white border-green-500"
          onClick={handleAddProduct}
        >
          <FaPlus className="w-4 h-4" />
          Add Product
        </Button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <Input
          type="text"
          placeholder="Search products by name..."
          className="max-w-md"
          value={localSearchTerm}
          onChange={handleSearch}
        />
        {searchTerm && (
          <p className="text-sm text-gray-500 mt-1">
            Searching for: "{searchTerm}"
          </p>
        )}
      </div>

      <hr className="mb-6" />

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Category
          </label>
          <Select onValueChange={handleCategoryFilter} value={selectedCategory}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {getUniqueCategories().map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedCategory !== "all" && (
            <p className="text-xs text-gray-500 mt-1">
              Filtered by:{" "}
              {categories.find((c) => c.id === selectedCategory)?.name}
            </p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Status
          </label>
          <Select onValueChange={handleStatusFilter} value={selectedStatus}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Low Stock">Low Stock</SelectItem>
              <SelectItem value="Out of Stock">Out of Stock</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Price Range
          </label>
          <Select onValueChange={handlePriceFilter} value={selectedPriceRange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Prices" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Prices</SelectItem>
              <SelectItem value="0-500">$0 - $500</SelectItem>
              <SelectItem value="500-1000">$500 - $1000</SelectItem>
              <SelectItem value="1000-1500">$1000 - $1500</SelectItem>
              <SelectItem value="1500+">$1500+</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Stock Status
          </label>
          <Select onValueChange={handleStockFilter} value={selectedStockStatus}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Stock" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stock</SelectItem>
              <SelectItem value="in-stock">In Stock (20+)</SelectItem>
              <SelectItem value="low-stock">Low Stock (&lt;20)</SelectItem>
              <SelectItem value="out-of-stock">Out of Stock</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <hr className="mb-6" />

      {/* Table */}
      <div className="bg-white border rounded-lg overflow-hidden">
        <Table>
          <TableCaption>
            A list of your products inventory - Total: {getTotalProducts()}{" "}
            products
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <MdCheckBoxOutlineBlank className="w-4 h-4" />
              </TableHead>
              <TableHead>Product Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <TableRow key={product.id} className="hover:bg-gray-50">
                  <TableCell>
                    <MdCheckBoxOutlineBlank className="w-4 h-4" />
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                      {/* ✅ DÜZELTİLDİ */}
                      {product.categories?.name || "No Category"}
                    </span>
                  </TableCell>
                  <TableCell className="font-semibold">
                    ${product.price}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`font-medium ${
                        product.stock_quantity < 20 // ✅ DÜZELTİLDİ
                          ? "text-orange-600"
                          : "text-green-600"
                      }`}
                    >
                      {product.stock_quantity} {/* ✅ DÜZELTİLDİ */}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        getProductStatus(product) === "Active" // ✅ DÜZELTİLDİ
                          ? "bg-green-100 text-green-800"
                          : getProductStatus(product) === "Low Stock"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {getProductStatus(product)} {/* ✅ DÜZELTİLDİ */}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-blue-500 hover:bg-blue-600 text-white border-blue-500"
                        onClick={() => handleEdit(product)}
                      >
                        <CiEdit className="w-4 h-4" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-red-500 hover:bg-red-600 text-white border-red-500"
                        onClick={() => handleDelete(product.id)}
                      >
                        <CiTrash className="w-4 h-4" />
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-gray-500"
                >
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-2xl">📦</span>
                    <span>No products found</span>
                    {searchTerm && (
                      <span className="text-sm">
                        Try searching for a different product name
                      </span>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-6">
        <div className="text-sm text-gray-700">
          <span>
            Showing {filteredProducts.length} of {getTotalProducts()} products
          </span>
          {selectedCategory !== "all" && (
            <span className="ml-2 text-green-600">
              • Filtered by{" "}
              {categories.find((c) => c.id === selectedCategory)?.name}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-green-500 text-white"
          >
            1
          </Button>
          <Button variant="outline" size="sm">
            2
          </Button>
          <Button variant="outline" size="sm">
            3
          </Button>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Products;
