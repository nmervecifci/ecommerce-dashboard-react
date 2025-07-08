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
      // İngilizce isimler de backward compatibility için
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

    // Category icons - Türkçe kategoriler ile
    const categoryIcons = {
      Meyve: "🍎",
      Sebze: "🥕",
      "Fırın Ürünleri": "🍞",
      "Süt Ürünleri": "🥛",
      Kahvaltılık: "🥚",
      "Et Ürünleri": "🥩",
      // İngilizce kategoriler (backward compatibility)
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

    // Get category from item name - Türkçe ürün isimleri ile
    const getCategory = () => {
      if (!name) return "default";

      const nameLower = name.toLowerCase();

      // Türkçe ürün isimlerine göre kategori belirleme
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

      // İngilizce fallback (backward compatibility)
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
      {/* Header */}
      <div className="border border-neutral-200 p-6 m-6 rounded-lg">
        <div className="mb-4">
          <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
            🔧 Redux Toolkit + Supabase - Orders Management
          </span>
        </div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
          <div className="flex gap-2">
            <Button
              onClick={handleRefresh}
              variant="outline"
              size="sm"
              disabled={loading}
            >
              {loading ? "Refreshing..." : "Refresh"}
            </Button>
            {error && (
              <Button
                onClick={handleClearError}
                variant="outline"
                size="sm"
                className="text-red-600 border-red-200"
              >
                Clear Error
              </Button>
            )}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-800 text-sm">
              <strong>Error:</strong> {error}
            </p>
          </div>
        )}
      </div>

      {/* Main Content - Flex Container */}
      <div className="flex gap-6 mx-6">
        {/* Sol taraf - Order Details */}
        <div className="flex-1">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Order Number {currentOrderNumber}</CardTitle>
                  <CardDescription>
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

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-green-500 hover:bg-green-600 text-white border-green-500"
                    onClick={handleMessageCustomer}
                    disabled={!currentOrder}
                  >
                    <PiEnvelopeSimpleThin className="w-4 h-4" />
                    Message Customer
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-blue-500 hover:bg-blue-600 text-white border-blue-500"
                    onClick={handleUpdateStatus}
                    disabled={!currentOrder}
                  >
                    <PiMapPinThin className="w-4 h-4" />
                    Update Status
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-orange-500 hover:bg-orange-600 text-white border-orange-500"
                    onClick={handlePrintInvoice}
                    disabled={!currentOrder}
                  >
                    <PiInvoiceThin className="w-4 h-4" />
                    Print Invoice
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              {currentOrder?.order_items?.map((item) => (
                <Card key={item.id} className="mb-4 p-4">
                  <div className="flex items-center justify-between">
                    {/* Product Info */}
                    <div className="flex gap-4 items-center">
                      <ProductImage
                        src={item.image_url}
                        alt={item.name}
                        name={item.name}
                      />

                      <div>
                        <h3 className="font-semibold text-lg">{item.name}</h3>
                        <p className="text-gray-600 text-sm">
                          {item.description}
                        </p>
                        <span className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs mt-1">
                          {item.category}
                        </span>
                      </div>
                    </div>

                    {/* Quantity & Price with Controls */}
                    <div className="text-right">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm text-gray-600">Quantity:</span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() =>
                              handleQuantityChange(item.id, item.quantity - 1)
                            }
                            className="w-6 h-6 rounded bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-sm disabled:opacity-50"
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <span className="font-medium px-2 min-w-[30px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleQuantityChange(item.id, item.quantity + 1)
                            }
                            className="w-6 h-6 rounded bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-sm"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">
                        Unit Price:{" "}
                        <span className="font-medium">${item.price}</span>
                      </p>
                      <p className="text-lg font-bold text-green-600">
                        Total: ${(item.price * item.quantity).toFixed(2)}
                      </p>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-xs text-red-500 hover:text-red-700 mt-1"
                      >
                        Remove Item
                      </button>
                    </div>
                  </div>
                </Card>
              ))}

              {/* Empty state */}
              {!currentOrder?.order_items?.length && (
                <div className="text-center py-8 text-gray-500">
                  <p>No items in this order</p>
                </div>
              )}

              {/* Order Summary */}
              {currentOrder?.order_items?.length > 0 && (
                <Card className="mt-6 bg-gray-50">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-semibold">Order Summary</h3>
                        <p className="text-gray-600">
                          {itemsCount} items total
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-600">
                          Grand Total: ${totalAmount.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-600">
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

        {/* Sağ taraf - Activity */}
        <div className="w-80">
          <Card>
            <CardHeader>
              <CardTitle>
                Activity
                {fetchingActivities && (
                  <span className="ml-2 text-sm text-gray-500">Loading...</span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {orderActivities.length > 0 ? (
                orderActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center gap-3 mb-3"
                  >
                    <FaCheckCircle className="text-green-500 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate">{activity.title}</p>
                      <p className="text-xs text-gray-500 truncate">
                        {activity.description}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(activity.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500">
                  <p className="text-sm">No activities yet</p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <p className="text-sm text-gray-500">Order tracking timeline</p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Orders;
