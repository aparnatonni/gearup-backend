-- Add unique constraint: one review per customer per gear
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_customerId_gearItemId_key" UNIQUE ("customerId", "gearItemId");