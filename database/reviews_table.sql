-- Create the review table
CREATE TABLE IF NOT EXISTS public.review (
    review_id SERIAL PRIMARY KEY,  -- Auto-generated unique ID
    review_text TEXT NOT NULL,     -- The actual review text
    review_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL, -- Auto-filled with current timestamp
    inv_id INTEGER NOT NULL,       -- The inventory item being reviewed
    account_id INTEGER NOT NULL,   -- The user who wrote the review
    CONSTRAINT fk_inventory FOREIGN KEY (inv_id) REFERENCES public.inventory (inv_id) ON DELETE CASCADE,
    CONSTRAINT fk_account FOREIGN KEY (account_id) REFERENCES public.account (account_id) ON DELETE CASCADE
);
