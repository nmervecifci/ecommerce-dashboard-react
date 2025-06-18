// src/tests/components/DashboardLayout.test.jsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import DashboardLayout from "../../components/layout/DashboardLayout";

describe("Dashboard Layout Component", () => {
  it("dashboard component render oluyor mu?", () => {
    render(<DashboardLayout />);

    expect(screen.getByText("🍎 Satış Dashboard")).toBeInTheDocument();
  });

  it("sales banner text'i gösteriliyor mu?", () => {
    render(<DashboardLayout />);
    expect(
      screen.getByText("Here's happening in your sales last weeks")
    ).toBeInTheDocument();
  });

  it("satış rakamı gösteriliyor mu?", () => {
    render(<DashboardLayout />);

    expect(screen.getByText("$8,567.000")).toBeInTheDocument();
  });

  it("product selling text'i gösteriliyor mu?", () => {
    render(<DashboardLayout />);
    expect(screen.getByText("2,478 product are sellings")).toBeInTheDocument();
  });

  it("REST Mode butonu var mı?", () => {
    render(<DashboardLayout />);
    expect(screen.getByText("REST Mode")).toBeInTheDocument();
  });

  it("View report butonu var mı?", () => {
    render(<DashboardLayout />);
    expect(screen.getByText("View report")).toBeInTheDocument();
  });

  it("Ürünler bölümü var mı?", () => {
    render(<DashboardLayout />);

    expect(screen.getByText(/📦 Ürünler/)).toBeInTheDocument();
  });

  it("Satışlar bölümü var mı?", () => {
    render(<DashboardLayout />);
    expect(screen.getByText(/💰 Satışlar/)).toBeInTheDocument();
  });

  it("satış text'i regex ile aranıyor", () => {
    render(<DashboardLayout />);

    expect(screen.getByText(/happening in your sales/i)).toBeInTheDocument();
  });

  it("para birimi text'i partial match", () => {
    render(<DashboardLayout />);
    // $ işareti olan herhangi bir text
    expect(screen.getByText(/\$8,567/)).toBeInTheDocument();
  });
});
