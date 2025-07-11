import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "/src/components/ui/card";
import { Button } from "/src/components/ui/button";

import { PiEnvelopeSimpleThin } from "react-icons/pi";
import { PiMapPinThin } from "react-icons/pi";
import { PiInvoiceThin } from "react-icons/pi";
import { CiCircleCheck } from "react-icons/ci";
import { CiDeliveryTruck } from "react-icons/ci";
import { FaCheckCircle } from "react-icons/fa";

// Import Redux actions and selectors
import {
  selectOrders,
  selectOrderActivities,
  selectCurrentOrderNumber,
  selectOrdersTotalAmount,
  selectOrdersLoading,
  selectOrdersError,
  selectCurrentOrder,
  selectOrderItemsCount,
  selectFetchingActivities,
  fetchOrders,
  fetchOrderById,
  fetchOrderActivities,
  updateOrderItemQuantity,
  removeOrderItem,
  addOrderActivity,
  updateOrderStatus,
  updateQuantityOptimistic,
  clearError,
} from "../redux/slices/ordersSlice";

function Orders() {
  const dispatch = useDispatch();
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  // Redux selectors
  const orders = useSelector(selectOrders);
  const orderActivities = useSelector(selectOrderActivities);
  const currentOrderNumber = useSelector(selectCurrentOrderNumber);
  const currentOrder = useSelector(selectCurrentOrder);
  const totalAmount = useSelector(selectOrdersTotalAmount);
  const itemsCount = useSelector(selectOrderItemsCount);
  const loading = useSelector(selectOrdersLoading);
  const error = useSelector(selectOrdersError);
  const fetchingActivities = useSelector(selectFetchingActivities);

  // ProductImage component for handling image errors and placeholders
  const ProductImage = ({ src, alt, name }) => {
    const [imageSrc, setImageSrc] = useState(src);
    const [imageLoading, setImageLoading] = useState(true);
    const [imageError, setImageError] = useState(false);

    // Fallback images from Unsplash - Türkçe ürün isimleri ile eşleştirildi
    const fallbackImages = {
      "Organik Muz":
        "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=100&h=100&fit=crop",
      "Kırmızı Elma":
        "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=100&h=100&fit=crop",
      "Organik Süt":
        "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=100&h=100&fit=crop",
      "Tam Buğday Ekmek":
        "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=100&h=100&fit=crop",
      "Organik Domates":
        "https://images.unsplash.com/photo-1546470427-e9e7d4e95ed8?w=100&h=100&fit=crop",
      "Çiftlik Yumurtası":
        "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=100&h=100&fit=crop",
      "Butter Croissant":
        "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=100&h=100&fit=crop",
      "Çikolatalı Kek":
        "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=100&h=100&fit=crop",

      "Fresh Bananas":
        "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=100&h=100&fit=crop",
      "Red Apples":
        "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=100&h=100&fit=crop",
      "Fresh Carrots":
        "https://images.unsplash.com/photo-1445282768818-728615cc910a?w=100&h=100&fit=crop",
      "Whole Wheat Bread":
        "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=100&h=100&fit=crop",
      "Organic Tomatoes":
        "https://images.unsplash.com/photo-1546470427-e9e7d4e95ed8?w=100&h=100&fit=crop",
      "French Baguette":
        "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=100&h=100&fit=crop",
    };

    const categoryIcons = {
      Meyve: "🍎",
      Sebze: "🥕",
      "Fırın Ürünleri": "🍞",
      "Süt Ürünleri": "🥛",
      Kahvaltılık: "🥚",
      "Et Ürünleri": "🥩",

      Fruits: "🍎",
      Vegetables: "🥕",
      Bakery: "🍞",
      Dairy: "🥛",
      Meat: "🥩",
      default: "📦",
    };

    const handleImageError = () => {
      if (fallbackImages[name] && imageSrc !== fallbackImages[name]) {
        setImageSrc(fallbackImages[name]);
        setImageError(false);
      } else {
        setImageError(true);
        setImageLoading(false);
      }
    };

    const handleImageLoad = () => {
      setImageLoading(false);
      setImageError(false);
    };

    const getCategory = () => {
      if (!name) return "default";

      const nameLower = name.toLowerCase();

      if (
        nameLower.includes("muz") ||
        nameLower.includes("elma") ||
        nameLower.includes("meyve")
      )
        return "Meyve";
      if (
        nameLower.includes("domates") ||
        nameLower.includes("sebze") ||
        nameLower.includes("havuç")
      )
        return "Sebze";
      if (
        nameLower.includes("ekmek") ||
        nameLower.includes("croissant") ||
        nameLower.includes("kek") ||
        nameLower.includes("fırın")
      )
        return "Fırın Ürünleri";
      if (
        nameLower.includes("süt") ||
        nameLower.includes("peynir") ||
        nameLower.includes("yoğurt")
      )
        return "Süt Ürünleri";
      if (nameLower.includes("yumurta") || nameLower.includes("kahvaltı"))
        return "Kahvaltılık";

      if (nameLower.includes("banana") || nameLower.includes("apple"))
        return "Fruits";
      if (nameLower.includes("carrot") || nameLower.includes("tomato"))
        return "Vegetables";
      if (nameLower.includes("bread") || nameLower.includes("baguette"))
        return "Bakery";

      return "default";
    };

    if (imageError) {
      return (
        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
          <span className="text-2xl">
            {categoryIcons[getCategory()] || categoryIcons.default}
          </span>
        </div>
      );
    }

    return (
      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
        {imageLoading && (
          <div className="animate-pulse bg-gray-200 w-full h-full flex items-center justify-center">
            <span className="text-gray-400 text-xs">📦</span>
          </div>
        )}
        <img
          src={
            imageSrc ||
            fallbackImages[name] ||
            "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=100&h=100&fit=crop"
          }
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-200 ${
            imageLoading ? "opacity-0" : "opacity-100"
          }`}
          onError={handleImageError}
          onLoad={handleImageLoad}
        />
      </div>
    );
  };

  // Load data on component mount
  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  // Load activities when current order changes
  useEffect(() => {
    if (currentOrder?.id) {
      dispatch(fetchOrderActivities(currentOrder.id));
    }
  }, [dispatch, currentOrder?.id]);

  // Handler functions
  const handleMessageCustomer = async () => {
    if (!currentOrder?.id) return;

    try {
      await dispatch(
        addOrderActivity({
          order_id: currentOrder.id,
          title: "Message Sent",
          description: `Message sent to customer for ${currentOrderNumber}`,
          icon: "✉️",
          status: "completed",
          color: "blue",
        })
      ).unwrap();

      console.log("Message sent to customer");
    } catch (error) {
      console.error("Failed to add activity:", error);
    }
  };

  const handleUpdateStatus = async () => {
    if (!currentOrder?.id) return;

    try {
      await dispatch(
        updateOrderStatus({
          orderId: currentOrder.id,
          status: "processing",
        })
      ).unwrap();

      await dispatch(
        addOrderActivity({
          order_id: currentOrder.id,
          title: "Status Updated",
          description: `Order ${currentOrderNumber} status updated to processing`,
          icon: "📝",
          status: "completed",
          color: "orange",
        })
      ).unwrap();

      console.log("Status updated successfully");
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const handlePrintInvoice = async () => {
    if (!currentOrder?.id) return;

    try {
      await dispatch(
        addOrderActivity({
          order_id: currentOrder.id,
          title: "Invoice Printed",
          description: `Invoice generated for ${currentOrderNumber}`,
          icon: "🖨️",
          status: "completed",
          color: "green",
        })
      ).unwrap();

      // Simulate print
      window.print();
      console.log("Invoice printed");
    } catch (error) {
      console.error("Failed to add activity:", error);
    }
  };

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    // Optimistic update for immediate UI feedback
    dispatch(updateQuantityOptimistic({ itemId, quantity: newQuantity }));

    try {
      await dispatch(
        updateOrderItemQuantity({
          itemId,
          quantity: newQuantity,
        })
      ).unwrap();

      // Add activity log
      await dispatch(
        addOrderActivity({
          order_id: currentOrder.id,
          title: "Quantity Updated",
          description: `Item quantity updated to ${newQuantity}`,
          icon: "📝",
          status: "completed",
          color: "blue",
        })
      );
    } catch (error) {
      console.error("Failed to update quantity:", error);
      // Revert optimistic update by refetching
      dispatch(fetchOrderById(currentOrder.id));
    }
  };

  const handleRemoveItem = async (itemId) => {
    if (!window.confirm("Are you sure you want to remove this item?")) return;

    try {
      await dispatch(removeOrderItem(itemId)).unwrap();

      await dispatch(
        addOrderActivity({
          order_id: currentOrder.id,
          title: "Item Removed",
          description: `Item removed from ${currentOrderNumber}`,
          icon: "🗑️",
          status: "completed",
          color: "red",
        })
      );

      console.log("Item removed successfully");
    } catch (error) {
      console.error("Failed to remove item:", error);
    }
  };

  const handleRefresh = () => {
    dispatch(fetchOrders());
    if (currentOrder?.id) {
      dispatch(fetchOrderActivities(currentOrder.id));
    }
  };

  const handleClearError = () => {
    dispatch(clearError());
  };

  // Loading state
  if (loading && orders.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="border border-neutral-200 p-3 sm:p-4 lg:p-6 m-2 sm:m-4 lg:m-6 rounded-lg">
        <div className="mb-3 sm:mb-4">
          <span className="bg-purple-100 text-purple-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
            🔧 Redux Toolkit + Supabase - Orders Management
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div className="flex-1">
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2">
              Orders Management
            </h1>
            <div className="flex flex-wrap gap-2 text-xs sm:text-sm">
              <Button
                onClick={handleRefresh}
                variant="outline"
                size="sm"
                disabled={loading}
                className="text-xs px-2 sm:px-3"
              >
                {loading ? "Refreshing..." : "Refresh"}
              </Button>
              {error && (
                <Button
                  onClick={handleClearError}
                  variant="outline"
                  size="sm"
                  className="text-red-600 border-red-200 text-xs px-2 sm:px-3"
                >
                  Clear Error
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 mt-3 sm:mt-4">
            <p className="text-red-800 text-xs sm:text-sm">
              <strong>Error:</strong> {error}
            </p>
          </div>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 mx-2 sm:mx-4 lg:mx-6">
        <div className="flex-1 min-w-0">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-base sm:text-lg lg:text-xl">
                    Order Number {currentOrderNumber}
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Order details and management • {itemsCount} items
                    {currentOrder?.status && (
                      <span
                        className={`ml-2 px-2 py-1 rounded text-xs ${
                          currentOrder.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : currentOrder.status === "processing"
                            ? "bg-blue-100 text-blue-800"
                            : currentOrder.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {currentOrder.status}
                      </span>
                    )}
                  </CardDescription>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-green-500 hover:bg-green-600 text-white border-green-500 text-xs sm:text-sm"
                    onClick={handleMessageCustomer}
                    disabled={!currentOrder}
                  >
                    <PiEnvelopeSimpleThin className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Message Customer</span>
                    <span className="sm:hidden">Message</span>
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-blue-500 hover:bg-blue-600 text-white border-blue-500 text-xs sm:text-sm"
                    onClick={handleUpdateStatus}
                    disabled={!currentOrder}
                  >
                    <PiMapPinThin className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Update Status</span>
                    <span className="sm:hidden">Update</span>
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-orange-500 hover:bg-orange-600 text-white border-orange-500 text-xs sm:text-sm"
                    onClick={handlePrintInvoice}
                    disabled={!currentOrder}
                  >
                    <PiInvoiceThin className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Print Invoice</span>
                    <span className="sm:hidden">Print</span>
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-3 sm:p-4 lg:p-6">
              {currentOrder?.order_items?.map((item) => (
                <Card key={item.id} className="mb-3 sm:mb-4 p-3 sm:p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                    {/* Product Info */}
                    <div className="flex gap-3 sm:gap-4 items-start sm:items-center flex-1 min-w-0">
                      <ProductImage
                        src={item.image_url}
                        alt={item.name}
                        name={item.name}
                      />

                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm sm:text-base lg:text-lg truncate">
                          {item.name}
                        </h3>
                        <p className="text-gray-600 text-xs sm:text-sm line-clamp-2 sm:line-clamp-1">
                          {item.description}
                        </p>
                        <span className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs mt-1">
                          {item.category}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 shrink-0">
                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between sm:justify-start gap-2">
                        <span className="text-xs sm:text-sm text-gray-600">
                          Qty:
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() =>
                              handleQuantityChange(item.id, item.quantity - 1)
                            }
                            className="w-6 h-6 sm:w-8 sm:h-8 rounded bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-sm disabled:opacity-50"
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <span className="font-medium px-2 min-w-[30px] text-center text-sm sm:text-base">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleQuantityChange(item.id, item.quantity + 1)
                            }
                            className="w-6 h-6 sm:w-8 sm:h-8 rounded bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-sm"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Price Info */}
                      <div className="text-right sm:text-left">
                        <p className="text-xs sm:text-sm text-gray-600">
                          Unit:{" "}
                          <span className="font-medium">${item.price}</span>
                        </p>
                        <p className="text-sm sm:text-lg font-bold text-green-600">
                          Total: ${(item.price * item.quantity).toFixed(2)}
                        </p>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-xs text-red-500 hover:text-red-700 mt-1"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}

              {!currentOrder?.order_items?.length && (
                <div className="text-center py-6 sm:py-8 text-gray-500">
                  <p className="text-sm sm:text-base">No items in this order</p>
                </div>
              )}

              {currentOrder?.order_items?.length > 0 && (
                <Card className="mt-4 sm:mt-6 bg-gray-50">
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4">
                      <div>
                        <h3 className="text-base sm:text-lg font-semibold">
                          Order Summary
                        </h3>
                        <p className="text-gray-600 text-xs sm:text-sm">
                          {itemsCount} items total
                        </p>
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="text-lg sm:text-2xl font-bold text-green-600">
                          Grand Total: ${totalAmount.toFixed(2)}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-600">
                          Including taxes and fees
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </div>
        <div className="w-full lg:w-80 lg:shrink-0">
          <Card>
            <CardHeader className="p-3 sm:p-4 lg:p-6">
              <CardTitle className="text-base sm:text-lg">
                Activity
                {fetchingActivities && (
                  <span className="ml-2 text-xs sm:text-sm text-gray-500">
                    Loading...
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-4 lg:p-6">
              {orderActivities.length > 0 ? (
                <div className="space-y-3 max-h-60 sm:max-h-80 lg:max-h-96 overflow-y-auto">
                  {orderActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start gap-3 p-2 sm:p-3 bg-gray-50 rounded-lg"
                    >
                      <FaCheckCircle
                        className="text-green-500 flex-shrink-0 mt-1"
                        size={14}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-xs sm:text-sm line-clamp-2">
                          {activity.title}
                        </p>
                        <p className="text-xs text-gray-500 line-clamp-2 mt-1">
                          {activity.description}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(activity.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 sm:py-8 text-gray-500">
                  <p className="text-xs sm:text-sm">No activities yet</p>
                </div>
              )}
            </CardContent>
            <CardFooter className="p-3 sm:p-4 lg:p-6">
              <p className="text-xs sm:text-sm text-gray-500">
                Order tracking timeline
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Orders;
