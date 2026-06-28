# TODO - Fix product images & errors

- [ ] Gather more context (API response fields, current frontend image usage)
- [ ] Brainstorm plan for: ensure every product card/detail can display images + click-through
- [ ] Confirm plan with user
- [ ] Implement fixes in frontend components (ProductCard, ProductDetail, Products/Home if needed)
- [ ] Ensure product image/gallery handling uses both `image` (single) and `images` (array)
- [ ] Add safe helpers for image URL building (avoid broken `STORAGE_BASE + product.image` when missing)
- [ ] Verify routes and click behavior: card image click navigates to detail
- [ ] Run frontend build/lint/tests if available

