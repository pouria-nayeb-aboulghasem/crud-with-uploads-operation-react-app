import { Link, NavLink, Route, Routes } from "react-router-dom";
import ProductDetailsPage from "@/pages/ProductDetailsPage";
import ProductFormPage from "@/pages/ProductFormPage";
import ProductListPage from "@/pages/ProductListPage";

function App() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f6f7f4] font-sans text-[#20241f] antialiased">
      <header className="flex h-16 items-center justify-between border-b border-[#e8eae5] bg-white px-5 sm:h-19 sm:px-7 lg:px-10 xl:px-[calc((100vw-1120px)/2)]">
        <Link
          className="flex items-center gap-2.75 text-[15px] font-bold tracking-[-0.3px]"
          to="/"
        >
          <span className="grid size-8 place-items-center rounded-[10px] bg-[#2c6745] font-serif text-xl text-white">
            P
          </span>
          <span>Product Studio</span>
        </Link>
        <nav
          aria-label="Main navigation"
          className="flex items-center gap-4.25 text-[13px] font-semibold text-[#646a63] sm:gap-6.5"
        >
          <NavLink
            className={({ isActive }) =>
              `flex min-h-16 items-center sm:min-h-19 ${
                isActive ? "border-b-2 border-[#2c6745] text-[#2c6745]" : ""
              }`
            }
            to="/"
            end
          >
            Products
          </NavLink>
          <Link
            className="hidden min-h-10.5 items-center justify-center gap-2 rounded-[7px] bg-[#2c6745] px-4.25 text-xs font-semibold text-white transition hover:bg-[#205437] sm:inline-flex"
            to="/products/new"
          >
            <span aria-hidden="true" className="text-base">
              +
            </span>
            Add product
          </Link>
        </nav>
      </header>

      <main className="mx-auto w-[calc(100%-2.25rem)] max-w-220 flex-1 py-11.5 sm:w-[calc(100%-3rem)] sm:py-16.75">
        <Routes>
          <Route path="/" element={<ProductListPage />} />
          <Route path="/products/new" element={<ProductFormPage />} />
          <Route path="/products/:id" element={<ProductDetailsPage />} />
          <Route path="/products/:id/edit" element={<ProductFormPage />} />
          <Route
            path="*"
            element={
              <section className="flex min-h-77.5 flex-col items-center justify-center rounded-[10px] border border-[#e8eae5] bg-white px-6 py-9 text-center">
                <p className="mb-3 text-[10px] font-bold uppercase tracking-[1.55px] text-[#2c6745]">
                  404 · Page not found
                </p>
                <h1 className="mb-5 text-3xl font-semibold tracking-[-1px]">
                  This page doesn’t exist.
                </h1>
                <Link
                  className="inline-flex min-h-10.5 items-center justify-center rounded-[7px] bg-[#2c6745] px-4.25 text-xs font-semibold text-white transition hover:bg-[#205437]"
                  to="/"
                >
                  Back to products
                </Link>
              </section>
            }
          />
        </Routes>
      </main>
      <footer className="border-t border-[#e8eae5] px-6 py-5.25 text-center text-xs text-[#92978f]">
        A simpler way to manage your catalog.
      </footer>
    </div>
  );
}

export default App;
