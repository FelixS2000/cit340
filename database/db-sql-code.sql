-- Drop the type if it already exists
DROP TYPE IF EXISTS public.account_type;

-- Create the ENUM type
CREATE TYPE public.account_type AS ENUM (
    'Client',
    'Employee',
    'Admin'
);

ALTER TYPE public.account_type
    OWNER TO cse340db;

-- Table structure for table `classification`
CREATE TABLE public.classification(
    classification_id INT GENERATED BY DEFAULT AS IDENTITY,
    classification_name VARCHAR(255) NOT NULL,
    CONSTRAINT classification_pk PRIMARY KEY (classification_id)
);

-- Table structure for table `inventory`
CREATE TABLE IF NOT EXISTS public.inventory(
    inv_id integer GENERATED BY DEFAULT AS IDENTITY,
    inv_make character varying NOT NULL,
    inv_model character varying NOT NULL,
    inv_year character(4) NOT NULL,
    inv_description text NOT NULL,
    inv_image character varying NOT NULL,
    inv_thumbnail character varying NOT NULL,
    inv_price numeric(9, 0) NOT NULL,
    inv_miles integer NOT NULL,
    inv_color character varying NOT NULL,
    classification_id integer NOT NULL,
    CONSTRAINT inventory_pkey PRIMARY KEY (inv_id)
);

-- Create relationship between `classification` and `inventory` tables
ALTER TABLE IF EXISTS public.inventory
    ADD CONSTRAINT fk_classification FOREIGN KEY (classification_id) 
    REFERENCES public.classification(classification_id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE NO ACTION;

-- Table structure for table `account`
CREATE TABLE IF NOT EXISTS public.account
(
    account_id integer NOT NULL GENERATED BY DEFAULT AS IDENTITY,
    account_firstname character varying NOT NULL,
    account_lastname character varying NOT NULL,
    account_email character varying NOT NULL,
    account_password character varying NOT NULL,
    account_type account_type NOT NULL DEFAULT 'Client'::account_type,
    CONSTRAINT account_pkey PRIMARY KEY (account_id)
);

-- Data for table `classification`
INSERT INTO public.classification (classification_name)
VALUES ('Custom'),
    ('Sport'),
    ('SUV'),
    ('Truck'),
    ('Sedan');

-- Data for table `inventory`
INSERT INTO public.inventory (
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
)
VALUES (
    'Chevy',
    'Camaro',
    '2018',
    'If you want to look cool this is the car you need! This car has great performance at an affordable price. Own it today!',
    '/images/camaro.jpg',
    '/images/camaro-tn.jpg',
    25000,
    101222,
    'Silver',
    2
), (
    'Batmobile',
    'Custom',
    '2007',
    'Ever want to be a super hero? Now you can with the batmobile. This car allows you to switch to bike mode allowing you to easily maneuver through traffic during rush hour.',
    '/images/batmobile.jpg',
    '/images/batmobile-tn.jpg',
    65000,
    29887,
    'Black',
    1
);

-- Additional INSERT statements...
