import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "/src/components/ui/card";
import { Button } from "/src/components/ui/button";

import banana from "../assets/images/banana_image_1.png";
import { PiEnvelopeSimpleThin } from "react-icons/pi";
import { PiMapPinThin } from "react-icons/pi";
import { PiInvoiceThin } from "react-icons/pi";
import { CiCircleCheck } from "react-icons/ci";
import { CiDeliveryTruck } from "react-icons/ci";
import { FaCheckCircle } from "react-icons/fa";
// Mock order data
const orders = [
  {
    id: 1,
    name: "Fresh Bananas",
    description: "Organic yellow bananas from Ecuador",
    image: banana,
    price: 12.99,
    quantity: 2,
    category: "Fruits",
  },
  {
    id: 2,
    name: "Red Apples",
    description: "Crispy red apples from Washington",
    image: banana,
    price: 8.5,
    quantity: 1,
    category: "Fruits",
  },
  {
    id: 3,
    name: "Fresh Carrots",
    description: "Organic carrots perfect for cooking",
    image: banana,
    price: 5.75,
    quantity: 3,
    category: "Vegetables",
  },
  {
    id: 4,
    name: "Whole Wheat Bread",
    description: "Freshly baked whole wheat bread",
    image: banana,
    price: 4.25,
    quantity: 1,
    category: "Bakery",
  },
  {
    id: 5,
    name: "Organic Tomatoes",
    description: "Fresh organic tomatoes from local farm",
    image: banana,
    price: 15.8,
    quantity: 2,
    category: "Vegetables",
  },
  {
    id: 6,
    name: "French Baguette",
    description: "Traditional French baguette bread",
    image: banana,
    price: 6.99,
    quantity: 2,
    category: "Bakery",
  },
];

const orderActivities = [
  {
    id: 1,
    title: "Ready to Pickup",
    description: "Order#252596 from T-shirt",
    time: "11:00",
    icon: "🚚",
    status: "completed",
    color: "green",
  },
  {
    id: 2,
    title: "Order Processed",
    description: "Order#252596 from T-shirt",
    time: "10:30",
    icon: "📦",
    status: "completed",
    color: "blue",
  },
  {
    id: 3,
    title: "Payment Confirmed",
    description: "Order#252596 from T-shirt",
    time: "10:00",
    icon: "💳",
    status: "completed",
    color: "green",
  },
  {
    id: 4,
    title: "Order Placed",
    description: "Order#252596 from T-shirt",
    time: "09:30",
    icon: "🛒",
    status: "completed",
    color: "orange",
  },
];

function Orders() {
  const totalAmount = orders.reduce((total, order) => {
    return total + order.price * order.quantity;
  }, 0);

  return (
    <div>
      {/* Header */}
      <div className="border border-neutral-200 p-6 m-6 rounded-lg">
        <div className="mb-4">
          <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
            🔧 Redux Toolkit - Orders Management
          </span>
        </div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
        </div>
      </div>

      {/* Main Content - Flex Container */}
      <div className="flex gap-6 mx-6">
        {/* Sol taraf - Order Details */}
        <div className="flex-1">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Order Number #252596</CardTitle>
                  <CardDescription>
                    Order details and management • {orders.length} items
                  </CardDescription>
                </div>

                {/* Butonlar yan yana */}
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-green-500 hover:bg-green-600 text-white border-green-500"
                  >
                    <PiEnvelopeSimpleThin className="w-4 h-4" />
                    Message Customer
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-blue-500 hover:bg-blue-600 text-white border-blue-500"
                  >
                    <PiMapPinThin className="w-4 h-4" />
                    Update Status
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-orange-500 hover:bg-orange-600 text-white border-orange-500"
                  >
                    <PiInvoiceThin className="w-4 h-4" />
                    Print Invoice
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              {orders.map((order) => (
                <Card key={order.id} className="mb-4 p-4">
                  <div className="flex items-center justify-between">
                    {/* Product Info */}
                    <div className="flex gap-4 items-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={order.image}
                          alt={order.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div>
                        <h3 className="font-semibold text-lg">{order.name}</h3>
                        <p className="text-gray-600 text-sm">
                          {order.description}
                        </p>
                        <span className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs mt-1">
                          {order.category}
                        </span>
                      </div>
                    </div>

                    {/* Quantity & Price */}
                    <div className="text-right">
                      <p className="text-sm text-gray-600">
                        Quantity:{" "}
                        <span className="font-medium">{order.quantity}</span>
                      </p>
                      <p className="text-sm text-gray-600">
                        Unit Price:{" "}
                        <span className="font-medium">${order.price}</span>
                      </p>
                      <p className="text-lg font-bold text-green-600">
                        Total: ${(order.price * order.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}

              {/* Order Summary */}
              <Card className="mt-6 bg-gray-50">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold">Order Summary</h3>
                      <p className="text-gray-600">
                        {orders.length} items total
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
            </CardContent>
          </Card>
        </div>

        {/* Sağ taraf - Activity */}
        <div className="w-80">
          <Card>
            <CardHeader>
              <CardTitle>Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {orderActivities.map((activity) => (
                <div key={activity.id} className="flex items-center gap-3 mb-3">
                  <FaCheckCircle className="text-green-500" />
                  <CiDeliveryTruck className="text-blue-500" />
                  <div>
                    <p className="font-medium">{activity.title}</p>
                    <p className="text-sm text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
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
