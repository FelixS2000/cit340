-- Task 1: Insert Tony Stark record into the account table
INSERT INTO public.account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

-- Task 2: Modify the Employee account to change the account_type to 'Employee'
UPDATE public.account
SET account_type = 'Employee'
WHERE account_email = 'employee@example.com'; -- Replace with actual employee email

-- Task 3: Modify the Manager account to change the account_type to 'Admin'
UPDATE public.account
SET account_type = 'Admin'
WHERE account_email = 'manager@example.com'; -- Replace with actual manager email


-- Task 3: Delete the Tony Stark record from the database
DELETE FROM public.account
WHERE account_email = 'tony@starkent.com';

-- Task 4: Modify the "GM Hummer" record's description using the REPLACE function
UPDATE public.inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_make = 'GM' AND inv_model = 'Hummer';

-- Task 5: Use an INNER JOIN to select make, model, and classification name for 'Sport' category
SELECT i.inv_make, i.inv_model, c.classification_name
FROM public.inventory i
INNER JOIN public.classification c ON i.classification_id = c.classification_id
WHERE c.classification_name = 'Sport';

-- Task 6: Update all records in inventory to add '/vehicles' to inv_image and inv_thumbnail paths
UPDATE public.inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');
