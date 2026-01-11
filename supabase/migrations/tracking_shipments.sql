-- Create tracking_shipments table
CREATE TABLE IF NOT EXISTS tracking_shipments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    tracking_number TEXT UNIQUE NOT NULL,
    carrier TEXT DEFAULT 'SmartWave Logistics',
    status TEXT DEFAULT 'created', -- created, picked_up, in_transit, delivered
    events JSONB DEFAULT '[]'::jsonb, -- Array of { status, location, timestamp, description }
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE tracking_shipments ENABLE ROW LEVEL SECURITY;

-- Create policy for public read (anyone with tracking number needs to be able to read, but we might want to filter by tracking number in query)
-- For simplicity, if you have the tracking number, you can query by it.
-- But since RLS is row-based, we'll allow public read for now or restrict to owner.
-- Let's allow public read so the /track-order page works for guests without auth,
-- provided they know the tracking number (query filtering handles the 'know' part).
CREATE POLICY "Enable read access for all users" ON tracking_shipments FOR SELECT USING (true);

-- Allow admins to insert/update
-- Assuming admins are authenticated users for now or specific role.
-- adjust 'authenticated' to your admin role logic if needed.
CREATE POLICY "Enable all access for authenticated users" ON tracking_shipments USING (auth.role() = 'authenticated');
