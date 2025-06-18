// src/tests/components/SalesFunnel.test.jsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// 🔧 API hatalarını önlemek için basit mock
vi.mock("@supabase/supabase-js", () => ({
  createClient: () => ({
    from: () => ({
      select: () => Promise.resolve({ data: [] }),
    }),
  }),
}));

// Mock fetch for GraphQL
global.fetch = vi.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ data: {} }),
  })
);

import SalesFunnel from "../../components/SalesFunnel";

describe("SalesFunnel Component", () => {
  const user = userEvent.setup();

  it("component çalışıyor mu?", () => {
    render(<SalesFunnel />);
    expect(screen.getByText("🍎 Satış Dashboard")).toBeInTheDocument();
  });

  it("REST Mode butonu var mı?", () => {
    render(<SalesFunnel />);
    expect(screen.getByText("REST Mode")).toBeInTheDocument();
  });

  it("butona tıklayınca text değişiyor mu?", async () => {
    render(<SalesFunnel />);

    const button = screen.getByText("REST Mode");
    await user.click(button);

    expect(screen.getByText("GraphQL Mode")).toBeInTheDocument();
  });

  it("REST mode mavi renkte mi?", () => {
    render(<SalesFunnel />);

    const button = screen.getByText("REST Mode");
    expect(button).toHaveClass("bg-blue-500");
  });

  it("GraphQL mode pembe renkte mi?", async () => {
    render(<SalesFunnel />);

    await user.click(screen.getByText("REST Mode"));

    const graphqlButton = screen.getByText("GraphQL Mode");
    expect(graphqlButton).toHaveClass("bg-pink-500");
  });

  it("ürünler bölümü render oluyor mu?", () => {
    render(<SalesFunnel />);
    expect(screen.getByText(/📦 Ürünler/)).toBeInTheDocument();
  });

  it("satışlar bölümü render oluyor mu?", () => {
    render(<SalesFunnel />);
    expect(screen.getByText(/💰 Satışlar/)).toBeInTheDocument();
  });

  it("2 kez tıklayınca orijinal duruma dönüyor mu?", async () => {
    render(<SalesFunnel />);

    const button = screen.getByText("REST Mode");

    // 1. tıklama: REST -> GraphQL
    await user.click(button);
    expect(screen.getByText("GraphQL Mode")).toBeInTheDocument();

    // 2. tıklama: GraphQL -> REST
    await user.click(screen.getByText("GraphQL Mode"));
    expect(screen.getByText("REST Mode")).toBeInTheDocument();
  });

  // ✅ 9. Accessibility test
  it("keyboard ile erişilebilir mi?", async () => {
    render(<SalesFunnel />);

    await user.tab();
    expect(screen.getByText("REST Mode")).toHaveFocus();
  });
});
