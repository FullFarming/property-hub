
-- 1. Profiles table (for user info accessible from public schema)
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  display_name TEXT,
  email TEXT,
  phone TEXT,
  department TEXT,
  role TEXT DEFAULT 'viewer',
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 2. Buildings table
CREATE TABLE public.buildings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  address_road TEXT,
  address_jibun TEXT,
  sido TEXT,
  gugun TEXT,
  dong TEXT,
  jibun TEXT,
  latitude DECIMAL,
  longitude DECIMAL,
  total_floors_above INT,
  total_floors_below INT,
  land_area_sqm DECIMAL,
  gross_area_sqm DECIMAL,
  building_area_sqm DECIMAL,
  far_area_sqm DECIMAL,
  building_coverage DECIMAL,
  floor_area_ratio DECIMAL,
  main_use TEXT,
  structure TEXT,
  roof_type TEXT,
  parking TEXT,
  approval_date DATE,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.buildings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view buildings" ON public.buildings FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert buildings" ON public.buildings FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update buildings" ON public.buildings FOR UPDATE TO authenticated USING (true);

-- 3. Listings table
CREATE TABLE public.listings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  building_id UUID REFERENCES public.buildings(id) ON DELETE SET NULL,
  listing_number TEXT,
  listing_type TEXT NOT NULL DEFAULT 'sale',
  workspace TEXT NOT NULL DEFAULT 'building_invest',
  status TEXT DEFAULT '준비',
  classification TEXT,
  sub_class JSONB DEFAULT '[]',
  sale_price BIGINT,
  deposit BIGINT,
  monthly_rent BIGINT,
  maintenance_fee BIGINT,
  yield_rate DECIMAL,
  price_per_pyeong BIGINT,
  is_public BOOLEAN DEFAULT false,
  is_recommended BOOLEAN DEFAULT false,
  is_exclusive BOOLEAN DEFAULT false,
  is_urgent BOOLEAN DEFAULT false,
  assignee_id UUID,
  secret_memo TEXT,
  description TEXT,
  ad_title TEXT,
  tags JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view listings" ON public.listings FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert listings" ON public.listings FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update listings" ON public.listings FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete listings" ON public.listings FOR DELETE TO authenticated USING (true);

-- 4. Floors table
CREATE TABLE public.floors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  building_id UUID NOT NULL REFERENCES public.buildings(id) ON DELETE CASCADE,
  floor_number INT NOT NULL,
  floor_label TEXT,
  main_use TEXT,
  other_use TEXT,
  area_sqm DECIMAL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.floors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view floors" ON public.floors FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage floors" ON public.floors FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update floors" ON public.floors FOR UPDATE TO authenticated USING (true);

-- 5. Lease info table
CREATE TABLE public.lease_info (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  building_id UUID NOT NULL REFERENCES public.buildings(id) ON DELETE CASCADE,
  listing_id UUID REFERENCES public.listings(id) ON DELETE SET NULL,
  floor_label TEXT,
  lease_area_pyeong DECIMAL,
  exclusive_area_pyeong DECIMAL,
  tenant_type TEXT,
  deposit BIGINT,
  monthly_rent BIGINT,
  maintenance_fee BIGINT,
  is_vacant BOOLEAN DEFAULT false,
  is_hidden BOOLEAN DEFAULT false,
  move_in_date DATE,
  source TEXT,
  notes TEXT,
  last_modified_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.lease_info ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view lease_info" ON public.lease_info FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert lease_info" ON public.lease_info FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update lease_info" ON public.lease_info FOR UPDATE TO authenticated USING (true);

-- 6. Brands table
CREATE TABLE public.brands (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  brand_name TEXT NOT NULL,
  company_name TEXT,
  category TEXT,
  sub_category TEXT,
  preferred_areas JSONB DEFAULT '[]',
  min_area_pyeong DECIMAL,
  max_area_pyeong DECIMAL,
  contact_name TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  description TEXT,
  requirements TEXT,
  logo_url TEXT,
  assignee_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view brands" ON public.brands FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert brands" ON public.brands FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update brands" ON public.brands FOR UPDATE TO authenticated USING (true);

-- 7. Customers table
CREATE TABLE public.customers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  customer_type TEXT DEFAULT 'buyer',
  phone TEXT,
  home_phone TEXT,
  other_phone TEXT,
  email TEXT,
  source TEXT,
  grade TEXT,
  preferred_area JSONB DEFAULT '[]',
  budget_min BIGINT,
  budget_max BIGINT,
  area_min DECIMAL,
  area_max DECIMAL,
  memo TEXT,
  assignee_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view customers" ON public.customers FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert customers" ON public.customers FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update customers" ON public.customers FOR UPDATE TO authenticated USING (true);

-- 8. Work logs table
CREATE TABLE public.work_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reference_type TEXT NOT NULL,
  reference_id UUID NOT NULL,
  log_type TEXT DEFAULT 'other',
  content TEXT,
  log_date DATE DEFAULT CURRENT_DATE,
  file_url TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.work_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view work_logs" ON public.work_logs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert work_logs" ON public.work_logs FOR INSERT TO authenticated WITH CHECK (true);

-- 9. Vacancy history table
CREATE TABLE public.vacancy_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lease_info_id UUID NOT NULL REFERENCES public.lease_info(id) ON DELETE CASCADE,
  field_changed TEXT NOT NULL,
  old_value TEXT,
  new_value TEXT,
  changed_by UUID,
  changed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.vacancy_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view vacancy_history" ON public.vacancy_history FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert vacancy_history" ON public.vacancy_history FOR INSERT TO authenticated WITH CHECK (true);

-- 10. Updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Apply triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_buildings_updated_at BEFORE UPDATE ON public.buildings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_listings_updated_at BEFORE UPDATE ON public.listings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_lease_info_updated_at BEFORE UPDATE ON public.lease_info FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_brands_updated_at BEFORE UPDATE ON public.brands FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON public.customers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Indexes for performance
CREATE INDEX idx_listings_building_id ON public.listings(building_id);
CREATE INDEX idx_listings_workspace ON public.listings(workspace);
CREATE INDEX idx_listings_status ON public.listings(status);
CREATE INDEX idx_floors_building_id ON public.floors(building_id);
CREATE INDEX idx_lease_info_building_id ON public.lease_info(building_id);
CREATE INDEX idx_work_logs_reference ON public.work_logs(reference_type, reference_id);
CREATE INDEX idx_buildings_location ON public.buildings(sido, gugun, dong);
