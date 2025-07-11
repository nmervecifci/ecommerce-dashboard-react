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
    <div className="border border-neutral-200 p-3 sm:p-4 lg:p-6 m-2 sm:m-4 lg:m-6 rounded-lg">
      <div className="mb-3 sm:mb-4">
        <span className="bg-green-100 text-green-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
          🔧 Context API - Product Management
        </span>
      </div>

      <div className="mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
          <div className="flex-1">
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2">
              Products Management
            </h1>

            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-1 sm:gap-4 text-xs sm:text-sm text-gray-600">
              <div className="flex items-center gap-2 sm:gap-4">
                <span className="bg-gray-100 px-2 py-1 rounded whitespace-nowrap">
                  Total: {getTotalProducts()}
                </span>
                <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded whitespace-nowrap">
                  Low Stock: {lowStockCount}
                </span>
              </div>
              <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded whitespace-nowrap">
                Showing: {filteredProducts.length} products
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white border-green-500 shrink-0"
            onClick={handleAddProduct}
          >
            <FaPlus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            <span className="text-xs sm:text-sm">Add Product</span>
          </Button>
        </div>
      </div>

      <div className="mb-4 sm:mb-6">
        <Input
          type="text"
          placeholder="Search products by name..."
          className="w-full sm:max-w-md lg:max-w-lg"
          value={localSearchTerm}
          onChange={handleSearch}
        />
        {searchTerm && (
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Searching for: "{searchTerm}"
          </p>
        )}
      </div>

      <hr className="mb-4 sm:mb-6" />

      <div className="mb-4 sm:mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Category Filter */}
          <div>
            <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 block">
              Category
            </label>
            <Select
              onValueChange={handleCategoryFilter}
              value={selectedCategory}
            >
              <SelectTrigger className="w-full text-xs sm:text-sm">
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
              <p className="text-xs text-gray-500 mt-1 truncate">
                Filtered by:{" "}
                {categories.find((c) => c.id === selectedCategory)?.name}
              </p>
            )}
          </div>

          {/* Status Filter */}
          <div>
            <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 block">
              Status
            </label>
            <Select onValueChange={handleStatusFilter} value={selectedStatus}>
              <SelectTrigger className="w-full text-xs sm:text-sm">
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
            <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 block">
              Price Range
            </label>
            <Select
              onValueChange={handlePriceFilter}
              value={selectedPriceRange}
            >
              <SelectTrigger className="w-full text-xs sm:text-sm">
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

          {/* Stock Status Filter */}
          <div>
            <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 block">
              Stock Status
            </label>
            <Select
              onValueChange={handleStockFilter}
              value={selectedStockStatus}
            >
              <SelectTrigger className="w-full text-xs sm:text-sm">
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
      </div>

      <hr className="mb-4 sm:mb-6" />

      <div className="bg-white border rounded-lg overflow-hidden mb-4 sm:mb-6">
        <div className="overflow-x-auto">
          <Table className="min-w-full">
            <TableCaption className="text-xs sm:text-sm">
              A list of your products inventory - Total: {getTotalProducts()}{" "}
              products
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8 sm:w-12 hidden sm:table-cell">
                  <MdCheckBoxOutlineBlank className="w-3 h-3 sm:w-4 sm:h-4" />
                </TableHead>
                <TableHead className="text-xs sm:text-sm font-medium">
                  Product
                </TableHead>
                <TableHead className="text-xs sm:text-sm font-medium hidden md:table-cell">
                  Category
                </TableHead>
                <TableHead className="text-xs sm:text-sm font-medium">
                  Price
                </TableHead>
                <TableHead className="text-xs sm:text-sm font-medium">
                  Stock
                </TableHead>
                <TableHead className="text-xs sm:text-sm font-medium hidden lg:table-cell">
                  Status
                </TableHead>
                <TableHead className="text-xs sm:text-sm font-medium text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <TableRow key={product.id} className="hover:bg-gray-50">
                    <TableCell className="hidden sm:table-cell">
                      <MdCheckBoxOutlineBlank className="w-3 h-3 sm:w-4 sm:h-4" />
                    </TableCell>

                    <TableCell className="font-medium text-xs sm:text-sm max-w-[120px] sm:max-w-none">
                      <div className="truncate" title={product.name}>
                        {product.name}
                      </div>

                      <div className="md:hidden text-xs text-gray-500 mt-1">
                        {product.categories?.name || "No Category"}
                      </div>
                    </TableCell>

                    <TableCell className="hidden md:table-cell">
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        {product.categories?.name || "No Category"}
                      </span>
                    </TableCell>

                    {/* Price */}
                    <TableCell className="font-semibold text-xs sm:text-sm">
                      ${product.price}
                    </TableCell>

                    {/* Stock */}
                    <TableCell>
                      <span
                        className={`font-medium text-xs sm:text-sm ${
                          product.stock_quantity < 20
                            ? "text-orange-600"
                            : "text-green-600"
                        }`}
                      >
                        {product.stock_quantity}
                      </span>
                    </TableCell>

                    <TableCell className="hidden lg:table-cell">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          getProductStatus(product) === "Active"
                            ? "bg-green-100 text-green-800"
                            : getProductStatus(product) === "Low Stock"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {getProductStatus(product)}
                      </span>
                    </TableCell>

                    {/* Actions - Responsive butonlar */}
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1 sm:gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-blue-500 hover:bg-blue-600 text-white border-blue-500 text-xs px-2 sm:px-3"
                          onClick={() => handleEdit(product)}
                        >
                          <CiEdit className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="hidden sm:inline ml-1">Edit</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-red-500 hover:bg-red-600 text-white border-red-500 text-xs px-2 sm:px-3"
                          onClick={() => handleDelete(product.id)}
                        >
                          <CiTrash className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="hidden sm:inline ml-1">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-6 sm:py-8 text-gray-500"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-xl sm:text-2xl">📦</span>
                      <span className="text-sm sm:text-base">
                        No products found
                      </span>
                      {searchTerm && (
                        <span className="text-xs sm:text-sm">
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
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div className="text-xs sm:text-sm text-gray-700 order-2 sm:order-1">
          <span>
            Showing {filteredProducts.length} of {getTotalProducts()} products
          </span>
          {selectedCategory !== "all" && (
            <span className="block sm:inline sm:ml-2 text-green-600">
              • Filtered by{" "}
              {categories.find((c) => c.id === selectedCategory)?.name}
            </span>
          )}
        </div>

        {/* Pagination buttons */}
        <div className="flex gap-1 sm:gap-2 order-1 sm:order-2 justify-center sm:justify-end">
          <Button
            variant="outline"
            size="sm"
            disabled
            className="text-xs px-2 sm:px-3"
          >
            Prev
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-green-500 text-white text-xs px-2 sm:px-3"
          >
            1
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-xs px-2 sm:px-3 hidden sm:inline-flex"
          >
            2
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-xs px-2 sm:px-3 hidden sm:inline-flex"
          >
            3
          </Button>
          <Button variant="outline" size="sm" className="text-xs px-2 sm:px-3">
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Products;
